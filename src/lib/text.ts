/** Polish plural form: plural(5, 'pytanie', 'pytania', 'pytań') -> 'pytań'. */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d = n % 10;
  const t = n % 100;
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
}

/** Lowercase, no diacritics (ł included), for accent-insensitive search. */
export const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');

export const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');

const DAY = new Intl.DateTimeFormat('pl', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
/** `2026-10-20` -> `20 paź 2026`. UTC, so the day never shifts with the reader's time zone. */
export const formatDay = (isoDate: string) => DAY.format(new Date(isoDate));

export const host = (url: string) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
};

/** Reading time of prose and Q&A at ~180 words per minute (technical Polish text). */
export function readMinutes(parts: (string | undefined)[]): number {
  const words = parts.map((p) => stripHtml(p ?? '')).join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
