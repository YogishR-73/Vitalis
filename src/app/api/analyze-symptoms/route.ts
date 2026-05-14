import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { normalizeTriagePayload, parseModelJson, type TriageAnalysis } from "@/lib/triage-analysis";

/**
 * --- NLP flow (high level) ---
 * 1) Client captures free-text symptom narrative (no key material leaves the browser).
 * 2) This route wraps that narrative in a clinician-style system brief + JSON-only contract.
 * 3) Gemini Flash performs semantic extraction, severity language, differentials, and escalation cues.
 * 4) We parse + normalize server-side before returning typed JSON to the UI.
 */

/** Gemini Flash — fast structured generation for interactive triage prototypes. */
const GEMINI_FLASH_MODEL = "gemini-2.0-flash";

/**
 * JSON schema passed to Gemini so the candidate is constrained to our triage object.
 * This complements the system prompt and reduces malformed outputs.
 */
const triageResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  required: [
    "symptoms",
    "severity",
    "possible_conditions",
    "emergency_flags",
    "recommendation",
    "confidence",
    "triage_level",
  ],
  properties: {
    symptoms: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Discrete symptom phrases inferred from the narrative.",
    },
    severity: {
      type: SchemaType.STRING,
      description: "Qualitative severity label (e.g., mild / moderate / severe) plus brief justification.",
    },
    possible_conditions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Ranked differentials as lay + clinical short labels, not definitive diagnoses.",
    },
    emergency_flags: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Red-flag patterns that warrant urgent or emergent escalation if present.",
    },
    recommendation: {
      type: SchemaType.STRING,
      description: "Immediate safety-oriented next steps, including when to seek emergency care.",
    },
    confidence: {
      type: SchemaType.STRING,
      description: "Epistemic humility statement or qualitative confidence band for the triage view.",
    },
    triage_level: {
      type: SchemaType.STRING,
      description: "Acuity bucket such as ESI-inspired level or emergent / urgent / less-urgent / routine.",
    },
  },
};

type AnalyzeBody = { symptoms?: string };

type OkPayload = { ok: true; data: TriageAnalysis };
type ErrPayload = { ok: false; error: string };

/**
 * --- AI orchestration ---
 * Single-shot generateContent with JSON mime type + response schema.
 * API key stays server-side (`GEMINI_API_KEY`); never forwarded to the client bundle.
 */
export async function POST(req: Request): Promise<NextResponse<OkPayload | ErrPayload>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Server configuration error: GEMINI_API_KEY is not set." },
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

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_FLASH_MODEL,
    generationConfig: {
      temperature: 0.35,
      topP: 0.9,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
      responseSchema: triageResponseSchema,
    },
    systemInstruction: `You are a clinical decision-support assistant for a structured triage prototype.
You are not providing a definitive diagnosis or legally binding medical advice.
Extract and organize information from the user's narrative into the required JSON fields only.
Use cautious, evidence-aligned language; prefer "consider" over "diagnose".
If information is missing, infer conservatively and reflect uncertainty in confidence and triage_level.
Always populate every JSON field; arrays may be empty only when truly no items apply.
For emergency_flags, include concise machine-like tokens when red-flag patterns appear (e.g., "thunderclap_headache", "focal_neurologic_deficit").
Never include markdown, commentary, or text outside JSON.`,
  });

  const userPrompt = `Chief complaint / symptom narrative:\n"""${symptoms}"""\n\nReturn the triage JSON object per schema.`;

  try {
    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const rawText = response.text();
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
      { ok: false, error: `Gemini request failed: ${message}` },
      { status: 502 },
    );
  }
}

/** Ensure fresh env reads on Vercel serverless invocations. */
export const dynamic = "force-dynamic";
