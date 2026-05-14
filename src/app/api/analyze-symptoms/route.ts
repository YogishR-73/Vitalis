import OpenAI from "openai";
import { NextResponse } from "next/server";
import { normalizeTriagePayload, parseModelJson, type TriageAnalysis } from "@/lib/triage-analysis";

/**
 * --- OpenRouter provider flow ---
 * 1) This route uses the OpenAI-compatible HTTPS API at `openrouter.ai/api/v1`.
 * 2) `OPENROUTER_API_KEY` authenticates server-side only (never bundled to the client).
 * 3) Optional `OPENROUTER_HTTP_REFERER` / `OPENROUTER_MODEL` env vars tune rankings and model routing.
 */

/**
 * --- NLP flow (high level) ---
 * 1) Client captures free-text symptom narrative (no key material leaves the browser).
 * 2) This route wraps that narrative in a clinician-style system brief + strict JSON contract.
 * 3) The instruction model performs semantic extraction, severity language, differentials, and escalation cues.
 * 4) We parse + normalize server-side before returning typed JSON to the UI.
 */

/** Default: strong free instruction model on OpenRouter (override with OPENROUTER_MODEL). */
const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-chat-v3-0324:free";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * Exact JSON shape the model must emit (keys and array types must match for `normalizeTriagePayload`).
 */
const TRIAGE_JSON_SHAPE = `{
  "symptoms": [],
  "severity": "",
  "possible_conditions": [],
  "emergency_flags": [],
  "recommendation": "",
  "confidence": "",
  "triage_level": ""
}`;

const SYSTEM_INSTRUCTION = `You are a clinical decision-support assistant for a structured triage prototype.
You are not providing a definitive diagnosis or legally binding medical advice.
Extract and organize information from the user's narrative into the required JSON fields only.
Use cautious, evidence-aligned language; prefer "consider" over "diagnose".
If information is missing, infer conservatively and reflect uncertainty in confidence and triage_level.
Always populate every JSON field; arrays may be empty only when truly no items apply.
For emergency_flags, include concise machine-like tokens when red-flag patterns appear (e.g., "thunderclap_headache", "focal_neurologic_deficit").
Respond with a single JSON object only — no markdown fences, no commentary before or after.
The JSON object MUST have exactly these keys and value types:
${TRIAGE_JSON_SHAPE}
symptoms, possible_conditions, and emergency_flags are arrays of strings; all other fields are strings.`;

type AnalyzeBody = { symptoms?: string };

type OkPayload = { ok: true; data: TriageAnalysis };
type ErrPayload = { ok: false; error: string };

/**
 * --- NLP orchestration ---
 * Single-shot chat completion with JSON mode (`response_format: json_object`) so the assistant emits parseable structured output.
 */

/**
 * --- Structured triage pipeline ---
 * OpenRouter returns assistant text → `parseModelJson` → `normalizeTriagePayload` → typed `TriageAnalysis` for the UI.
 */
export async function POST(req: Request): Promise<NextResponse<OkPayload | ErrPayload>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Server configuration error: OPENROUTER_API_KEY is not set." },
      { status: 500 },
    );
  }

  let body: AnalyzeBody;
  try {
    body = (await req.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const symptoms = typeof body.symptoms === "string" ? body.symptoms.trim() : "";
  if (!symptoms) {
    return NextResponse.json({ ok: false, error: "Symptom text is required." }, { status: 400 });
  }
  if (symptoms.length > 8000) {
    return NextResponse.json(
      { ok: false, error: "Symptom text exceeds maximum length (8000 characters)." },
      { status: 400 },
    );
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL;
  const referer = process.env.OPENROUTER_HTTP_REFERER?.trim();

  const client = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders: {
      "X-Title": "VITALIS AI Triage",
      ...(referer ? { "HTTP-Referer": referer } : {}),
    },
  });

  const userPrompt = `Chief complaint / symptom narrative:\n"""${symptoms}"""\n\nReturn only the triage JSON object as specified.`;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.35,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: userPrompt },
      ],
    });

    const rawText = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!rawText) {
      return NextResponse.json(
        { ok: false, error: "Model returned an empty response." },
        { status: 502 },
      );
    }

    const parsed = parseModelJson(rawText);
    const normalized = normalizeTriagePayload(parsed);
    if (!normalized) {
      return NextResponse.json(
        { ok: false, error: "Model returned JSON that failed server-side validation." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, data: normalized });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: `OpenRouter request failed: ${message}` },
      { status: 502 },
    );
  }
}

/** Ensure fresh env reads on Vercel serverless invocations. */
export const dynamic = "force-dynamic";
