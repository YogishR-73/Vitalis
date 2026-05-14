"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Send, Sparkles } from "lucide-react";
import {
  duration,
  ease,
  fadeUpHero,
  fadeUpItem,
  spring,
  staggerReveal,
  viewport,
} from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TriageAnalysis } from "@/lib/triage-analysis";
import { triageToNarrativeSummary } from "@/lib/triage-analysis";
import { TriageInsightPanel } from "@/components/sections/triage-insight-panel";

/**
 * --- Triage pipeline (client side) ---
 * 1) Capture user narrative in the glass copilot surface.
 * 2) POST to `/api/analyze-symptoms` (server-only Gemini access).
 * 3) Render typed triage JSON with motion-native disclosure + fallback copy on failures.
 */

type Msg = {
  id: string;
  role: "user" | "ai";
  text: string;
  triage?: TriageAnalysis;
  isError?: boolean;
};

type AnalyzeOk = { ok: true; data: TriageAnalysis };
type AnalyzeErr = { ok: false; error: string };
type AnalyzeResponse = AnalyzeOk | AnalyzeErr;

const WELCOME_TEXT =
  "You are connected to the VITALIS triage reasoning layer. Describe your chief complaint, timing, severity (0–10), associated symptoms, and modifiers. Each send routes your narrative through Gemini Flash for structured triage JSON—review every field with a licensed clinician before acting.";

const initialMessages: Msg[] = [
  {
    id: "welcome-static",
    role: "ai",
    text: WELCOME_TEXT,
  },
];

export function AiSymptomAssistant() {
  const [messages, setMessages] = React.useState<Msg[]>(initialMessages);
  const [input, setInput] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnalyzing]);

  /**
   * Streams the narrative summary into the bubble while the structured panel
   * (fed by the same triage object) animates in—keeps the cinematic cadence without faking model output.
   */
  const streamAiNarrative = React.useCallback(async (messageId: string, triage: TriageAnalysis) => {
    const full = triageToNarrativeSummary(triage);
    for (let i = 0; i <= full.length; i++) {
      const shown = full.slice(0, i);
      setMessages((m) =>
        m.map((x) => (x.id === messageId ? { ...x, text: shown, triage } : x)),
      );
      await new Promise((r) => setTimeout(r, 10 + ((i * 5) % 9)));
    }
  }, []);

  const send = async () => {
    const t = input.trim();
    if (!t || isAnalyzing) return;
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: t }]);

    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: t }),
      });
      const payload = (await res.json()) as AnalyzeResponse;

      if (!res.ok || !payload.ok) {
        const errText =
          !payload.ok && "error" in payload
            ? payload.error
            : `Request failed (${res.status}).`;
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "ai",
            isError: true,
            text:
              errText +
              "\n\nFallback: if symptoms are severe, worsening, or involve chest pain, stroke signs, or trouble breathing, seek emergency care immediately.",
          },
        ]);
        return;
      }

      const aiId = crypto.randomUUID();
      setMessages((m) => [...m, { id: aiId, role: "ai", text: "", triage: payload.data }]);
      await streamAiNarrative(aiId, payload.data);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "ai",
          isError: true,
          text:
            "We could not reach the triage service. Check your connection and try again.\n\nFallback: for any emergency signs, call local emergency services without delay.",
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const suggestions = [
    "Summarize risk in one sentence",
    "What should I avoid until help arrives?",
    "Show differential ranking",
  ];

  return (
    <section id="assistant" className="relative border-b border-cyan-500/10 py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <motion.div
          className="mb-12 max-w-2xl space-y-4"
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={fadeUpHero}>
            <Badge variant="glow" className="uppercase tracking-[0.25em]">
              Symptom intelligence
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUpHero} className="font-display text-3xl text-white md:text-5xl">
            Conversational triage with cinematic clarity
          </motion.h2>
          <motion.p variants={fadeUpHero} className="text-base text-cyan-100/65 md:text-lg">
            A premium copilot surface for patients and clinicians—motion-native, glass layered, and tuned for emotional safety during uncertainty.
          </motion.p>
          <motion.p
            variants={fadeUpHero}
            className="rounded-2xl border border-cyan-500/20 bg-black/30 px-4 py-3 text-sm leading-relaxed text-cyan-100/80 backdrop-blur-sm"
          >
            <span className="font-medium text-cyan-50">Medical disclaimer: </span>
            This is an AI-assisted triage prototype and not a replacement for licensed medical professionals.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            variants={fadeUpHero}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="glass-panel holo-border relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative grid size-11 place-items-center rounded-2xl border border-cyan-400/35 bg-gradient-to-br from-cyan-500/30 to-sky-600/10 shadow-cyan"
                  whileHover={{ scale: 1.03 }}
                  transition={spring.soft}
                >
                  <Sparkles className="size-5 text-cyan-50" />
                </motion.div>
                <div>
                  <div className="text-sm font-medium text-white">VITALIS Copilot</div>
                  <div className="text-xs text-cyan-200/60">Gemini Flash · Server-side NLP</div>
                </div>
              </div>
              <motion.div whileTap={{ scale: 0.96 }} transition={spring.tactile}>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  title="Voice capture (prototype)"
                  className="rounded-xl border-cyan-500/25 bg-white/5 text-cyan-100 hover:bg-cyan-500/10"
                >
                  <Mic className="size-4" />
                </Button>
              </motion.div>
            </div>

            <ScrollArea className="h-[400px] px-2 md:h-[420px]">
              <div className="space-y-4 p-4 pb-28">
                <AnimatePresence initial={false}>
                  {messages.map((m, idx) => (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{
                        duration: duration.message,
                        ease: ease.out,
                        delay: Math.min(idx * 0.025, 0.15),
                      }}
                      className={cn(
                        "max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-panel backdrop-blur-md md:text-[15px]",
                        m.role === "user"
                          ? "ml-auto border-cyan-500/15 bg-white/[0.04] text-cyan-50"
                          : m.isError
                            ? "mr-auto border-rose-500/35 bg-rose-950/25 text-rose-50"
                            : "mr-auto border-cyan-400/25 bg-gradient-to-br from-cyan-500/15 via-sky-500/5 to-transparent text-cyan-50",
                      )}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>
                      {m.role === "ai" && m.text.length === 0 && !m.isError && (
                        <span className="inline-flex gap-1.5 pl-0.5">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-300/85"
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{
                                duration: 1.15,
                                repeat: Infinity,
                                ease: ease.inOut,
                                delay: i * 0.14,
                              }}
                            />
                          ))}
                        </span>
                      )}
                      {m.triage && !m.isError && <TriageInsightPanel triage={m.triage} />}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.35, ease: ease.out }}
                      className="mr-auto flex items-center gap-2 rounded-full border border-cyan-500/20 bg-black/30 px-3 py-2 text-xs text-cyan-100/70"
                    >
                      <motion.span
                        className="h-1.5 w-1.5 rounded-full bg-cyan-300"
                        animate={{ opacity: [0.35, 1, 0.35] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: ease.inOut }}
                      />
                      Running Gemini triage synthesis…
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="absolute inset-x-0 bottom-0 border-t border-cyan-500/10 bg-gradient-to-t from-black/70 to-transparent p-4 backdrop-blur-xl">
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <motion.button
                    key={s}
                    type="button"
                    onClick={() => setInput(s)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={spring.soft}
                    className="rounded-full border border-cyan-500/15 bg-white/5 px-3 py-1 text-[11px] text-cyan-100/80 hover:border-cyan-400/35 hover:bg-cyan-500/10"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void send()}
                  disabled={isAnalyzing}
                  placeholder="Describe symptoms with as much context as you can…"
                  className="flex-1 rounded-2xl border border-cyan-500/20 bg-black/40 px-4 py-3 text-sm text-cyan-50 outline-none ring-0 placeholder:text-cyan-200/35 focus:border-cyan-400/50 disabled:opacity-50"
                />
                <motion.div whileTap={{ scale: 0.97 }} transition={spring.tactile}>
                  <Button
                    type="button"
                    onClick={() => void send()}
                    disabled={isAnalyzing || !input.trim()}
                    className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 text-black shadow-cyan hover:opacity-95 disabled:opacity-40"
                  >
                    <Send className="size-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-4"
          >
            {[
              {
                title: "Live safety rails",
                body: "Tone-stabilized responses, escalation triggers, and clinician-readable rationales on every turn.",
              },
              {
                title: "Continuity graph",
                body: "Copilot memory that respects consent boundaries while preserving longitudinal symptom evolution.",
              },
              {
                title: "Voice + vision",
                body: "Optional multimodal intake: cough spectrograms, wound imaging, and wearable deltas fused into one stream.",
              },
            ].map((c, i) => (
              <motion.div key={c.title} variants={fadeUpItem}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={spring.lift}
                  className="glass-panel rounded-2xl p-5"
                >
                  <div className="mb-2 text-xs uppercase tracking-[0.25em] text-cyan-300/55">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-lg font-medium text-white">{c.title}</div>
                  <p className="mt-2 text-sm text-cyan-100/65">{c.body}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
