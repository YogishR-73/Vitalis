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

type Msg = { id: string; role: "user" | "ai"; text: string };

const seed: Msg[] = [
  {
    id: "1",
    role: "user",
    text: "I have a sharp chest pressure that radiates to my jaw after exertion. It fades in a few minutes.",
  },
];

const aiReplies = [
  "Understood. I am cross-referencing your vitals stream, ECG morphology priors, and exertion timeline. Give me a moment to stabilize the model ensemble…",
];

export function AiSymptomAssistant() {
  const [messages, setMessages] = React.useState<Msg[]>(seed);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const booted = React.useRef(false);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const pushAi = React.useCallback(async (text: string) => {
    setTyping(true);
    await new Promise((r) => setTimeout(r, 900));
    setTyping(false);
    const id = crypto.randomUUID();
    let shown = "";
    setMessages((m) => [...m, { id, role: "ai", text: "" }]);
    for (let i = 0; i <= text.length; i++) {
      shown = text.slice(0, i);
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, text: shown } : x)));
      await new Promise((r) => setTimeout(r, 14 + ((i * 7) % 11)));
    }
  }, []);

  React.useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    void pushAi(aiReplies[0]);
  }, [pushAi]);

  const send = async () => {
    const t = input.trim();
    if (!t) return;
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: t }]);
    await pushAi(
      "Acknowledged. I am tightening surveillance on ST trends, troponin kinetics priors, and exertional onset. If pain exceeds 6/10, persists beyond 10 minutes, or returns at rest, initiate emergency routing immediately."
    );
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
                  <div className="text-xs text-cyan-200/60">Multimodal · On-device optional</div>
                </div>
              </div>
              <motion.div whileTap={{ scale: 0.96 }} transition={spring.tactile}>
                <Button
                  size="icon"
                  variant="outline"
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
                          : "mr-auto border-cyan-400/25 bg-gradient-to-br from-cyan-500/15 via-sky-500/5 to-transparent text-cyan-50"
                      )}
                    >
                      {m.text}
                      {m.role === "ai" && m.text.length === 0 && (
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
                    </motion.div>
                  ))}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {typing && (
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
                      Synthesizing differential space…
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
                  placeholder="Describe symptoms with as much context as you can…"
                  className="flex-1 rounded-2xl border border-cyan-500/20 bg-black/40 px-4 py-3 text-sm text-cyan-50 outline-none ring-0 placeholder:text-cyan-200/35 focus:border-cyan-400/50"
                />
                <motion.div whileTap={{ scale: 0.97 }} transition={spring.tactile}>
                  <Button
                    onClick={() => void send()}
                    className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 text-black shadow-cyan hover:opacity-95"
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
