/**
 * Shared contract between the OpenRouter-backed triage pipeline (`/api/analyze-symptoms`)
 * and the cinematic assistant UI. Keeping this module isomorphic-friendly
 * (no Node-only imports) lets the client stay strictly typed without leaking secrets.
 */

export type TriageAnalysis = {
  symptoms: string[];
  severity: string;
  possible_conditions: string[];
  emergency_flags: string[];
  recommendation: string;
  confidence: string;
  triage_level: string;
};

const REQUIRED_KEYS: (keyof TriageAnalysis)[] = [
  "symptoms",
  "severity",
  "possible_conditions",
  "emergency_flags",
  "recommendation",
  "confidence",
  "triage_level",
];

function asTrimmedString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asTrimmedString(item))
    .filter((s) => s.length > 0);
}

/**
 * Normalizes arbitrary JSON into our triage contract or returns null if the payload
 * cannot be trusted for clinical-adjacent display (fail closed on the API layer).
 */
export function normalizeTriagePayload(raw: unknown): TriageAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  for (const key of REQUIRED_KEYS) {
    if (!(key in o)) return null;
  }
  const symptoms = asStringList(o.symptoms);
  const possible_conditions = asStringList(o.possible_conditions);
  const emergency_flags = asStringList(o.emergency_flags);
  const severity = asTrimmedString(o.severity);
  const recommendation = asTrimmedString(o.recommendation);
  const confidence = asTrimmedString(o.confidence);
  const triage_level = asTrimmedString(o.triage_level);

  if (!severity || !recommendation || !confidence || !triage_level) return null;

  return {
    symptoms,
    severity,
    possible_conditions,
    emergency_flags,
    recommendation,
    confidence,
    triage_level,
  };
}

/**
 * Safely parse model output that should already be JSON — tolerates rare fence drift.
 */
export function parseModelJson(text: string): unknown | null {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/u, "");
  }
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return null;
  }
}

export function triageToNarrativeSummary(t: TriageAnalysis): string {
  const lines = [
    t.recommendation,
    "",
    `Triage level: ${t.triage_level} · Severity: ${t.severity} · Confidence: ${t.confidence}`,
  ];
  if (t.emergency_flags.length) {
    lines.push("", `Escalation watchlist: ${t.emergency_flags.join(" · ")}`);
  }
  return lines.join("\n");
}
