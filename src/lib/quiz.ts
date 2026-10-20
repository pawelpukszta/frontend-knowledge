// Quiz building and scoring, pure and seedable so tests are deterministic.

/** Small fast PRNG (mulberry32): same seed, same sequence. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: readonly T[], random: () => number = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface Question { id: string; options: string[]; answer: number }
/** A question in a session: `order` is the display order of option indexes. */
export type SessionItem<Q extends Question> = Q & { order: number[] };

/** Picks `count` random questions (0 = all) and shuffles the options of each. */
export function buildQuiz<Q extends Question>(pool: readonly Q[], count: number, random: () => number = Math.random): SessionItem<Q>[] {
  const picked = shuffle(pool, random);
  return (count ? picked.slice(0, count) : picked).map((q) => ({ ...q, order: shuffle(q.options.map((_, i) => i), random) }));
}

/** `picks[i]` is the original option index chosen for item i. */
export function scoreQuiz<Q extends Question>(items: readonly Q[], picks: readonly number[]) {
  const wrong = items.filter((q, i) => picks[i] !== q.answer);
  return { score: items.length - wrong.length, total: items.length, wrong };
}
