/**
 * Deterministic PRNG (Mulberry32). Same seed → same sequence on server and client.
 * Use instead of Math.random() anywhere initial render must match hydration.
 */
export function createMulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a += 0x6d2b79f5;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type NeuralParticleSpec = {
  id: number;
  x: number;
  y: number;
  s: number;
  d: number;
};

/** Stable particle field for NeuralParticles — identical SSR + CSR markup. */
export function buildNeuralParticles(count: number, seed = 0x4b495441): NeuralParticleSpec[] {
  const rnd = createMulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rnd() * 100,
    y: rnd() * 100,
    s: 1 + rnd() * 3,
    d: 12 + rnd() * 28,
  }));
}
