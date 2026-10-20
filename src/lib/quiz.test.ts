import { describe, expect, it } from 'vitest';
import { buildQuiz, rng, scoreQuiz } from './quiz';

const pool = Array.from({ length: 10 }, (_, i) => ({ id: `q${i}`, options: ['a', 'b', 'c', 'd'], answer: i % 4 }));

describe('quiz', () => {
  it('is deterministic for a seed and different for another seed', () => {
    const a = buildQuiz(pool, 5, rng(42));
    expect(buildQuiz(pool, 5, rng(42))).toEqual(a);
    expect(buildQuiz(pool, 5, rng(7)).map((q) => q.id)).not.toEqual(a.map((q) => q.id));
  });

  it('picks the configured number of distinct questions, 0 meaning all', () => {
    const five = buildQuiz(pool, 5, rng(1));
    expect(new Set(five.map((q) => q.id)).size).toBe(5);
    expect(buildQuiz(pool, 0, rng(1))).toHaveLength(10);
    expect(buildQuiz(pool, 50, rng(1))).toHaveLength(10);
  });

  it('shuffles options as a permutation and keeps the answer index pointing at the same option', () => {
    const items = buildQuiz(pool, 0, rng(3));
    for (const q of items) expect([...q.order].sort()).toEqual([0, 1, 2, 3]);
    expect(items.some((q) => q.order.join() !== '0,1,2,3')).toBe(true);
    expect(items.every((q) => q.options[q.answer] === pool.find((p) => p.id === q.id)!.options[q.answer])).toBe(true);
  });

  it('scores answers and lists the mistakes', () => {
    const items = buildQuiz(pool, 4, rng(9));
    const picks = items.map((q, i) => (i < 3 ? q.answer : (q.answer + 1) % 4));
    const r = scoreQuiz(items, picks);
    expect(r).toMatchObject({ score: 3, total: 4 });
    expect(r.wrong.map((q) => q.id)).toEqual([items[3].id]);
  });
});
