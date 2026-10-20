// UserData store: owns the user's document (progress, self-assessment, settings). State in memory is the
// source of truth for the UI; saving to storage is debounced and never blocks rendering.
import { z } from 'zod';
import { createStore, useStore } from './store';
import type { StorageAdapter } from './storage';

export const SCHEMA_VERSION = 1;
const DOC_KEY = 'userData';

const mark = z.enum(['known', 'review']);
export type Mark = z.infer<typeof mark>;
export type LevelFilter = 'all' | 'mid' | 'senior';

/** Missing fields get defaults, so adding a field does not need a schema version bump. */
const docSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  settings: z.object({
    theme: z.enum(['light', 'dark']).nullable().default(null),
    level: z.enum(['all', 'mid', 'senior']).default('all'),
    lastView: z.string().nullable().default(null),
  }).prefault({}),
  seen: z.array(z.string()).default([]),
  lastTopic: z.string().nullable().default(null),
  topicStatus: z.record(z.string(), mark).default({}),
  qaStatus: z.record(z.string(), mark).default({}),
});
export type UserDoc = z.infer<typeof docSchema>;

export const emptyDoc = (): UserDoc => docSchema.parse({ schemaVersion: SCHEMA_VERSION });

export const userData = createStore<UserDoc>(emptyDoc());
/** Set when stored data could not be read; shown once to the user. */
export const loadProblem = createStore<string | null>(null);

export const useUserData = <S>(selector: (d: UserDoc) => S) => useStore(userData, selector);
export const update = (fn: (d: UserDoc) => UserDoc) => userData.set(fn);

// ---------- Actions ----------

export const setLevel = (level: LevelFilter) => update((d) => ({ ...d, settings: { ...d.settings, level } }));
export const setTheme = (theme: 'light' | 'dark') => update((d) => ({ ...d, settings: { ...d.settings, theme } }));
export const setLastView = (lastView: string) =>
  userData.get().settings.lastView === lastView ? undefined : update((d) => ({ ...d, settings: { ...d.settings, lastView } }));

export function markSeen(topicId: string) {
  const d = userData.get();
  if (d.lastTopic === topicId && d.seen.includes(topicId)) return;
  update((x) => ({ ...x, lastTopic: topicId, seen: x.seen.includes(topicId) ? x.seen : [...x.seen, topicId] }));
}

/** Sets a mark; setting the same mark again clears it (toggle buttons). */
const toggle = (map: Record<string, Mark>, id: string, value: Mark) => {
  const next = { ...map };
  if (next[id] === value) delete next[id];
  else next[id] = value;
  return next;
};
export const toggleTopicMark = (id: string, value: Mark) => update((d) => ({ ...d, topicStatus: toggle(d.topicStatus, id, value) }));
export const toggleQaMark = (id: string, value: Mark) => update((d) => ({ ...d, qaStatus: toggle(d.qaStatus, id, value) }));
export const setQaMark = (id: string, value: Mark) => update((d) => ({ ...d, qaStatus: { ...d.qaStatus, [id]: value } }));
export const setTopicMark = (id: string, value: Mark) => update((d) => ({ ...d, topicStatus: { ...d.topicStatus, [id]: value } }));

// ---------- Persistence ----------

/**
 * Loads the stored document, then saves every change after `delay` ms of quiet.
 * Unreadable data never blocks start-up: the app starts empty and the raw value is kept under a backup key.
 */
export async function initUserData(adapter: StorageAdapter, { delay = 400, timeout = 2000 } = {}) {
  let raw: unknown;
  try {
    raw = await Promise.race([
      adapter.load(DOC_KEY),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
    ]);
  } catch {
    loadProblem.set(() => 'Nie udało się odczytać zapisanych postępów. Zmiany z tej sesji mogą nie zostać zapisane.');
  }
  if (raw !== undefined) {
    const parsed = docSchema.safeParse(raw);
    if (parsed.success) userData.set(() => parsed.data);
    else {
      await adapter.save(`${DOC_KEY}-unreadable-${Date.now()}`, raw).catch(() => {});
      loadProblem.set(() => 'Zapisane postępy były uszkodzone, więc zaczynasz od zera. Kopia starych danych została zachowana.');
    }
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const flush = () => {
    clearTimeout(timer);
    timer = undefined;
    adapter.save(DOC_KEY, userData.get()).catch(() => {
      loadProblem.set(() => 'Nie udało się zapisać postępów w tej przeglądarce.');
    });
  };
  const unsubscribe = userData.subscribe(() => {
    clearTimeout(timer);
    timer = setTimeout(flush, delay);
  });
  // Do not lose the last change when the tab is hidden or closed during the debounce.
  const onHide = () => { if (timer !== undefined) flush(); };
  addEventListener('pagehide', onHide);
  document.addEventListener('visibilitychange', onHide);
  return () => {
    unsubscribe();
    removeEventListener('pagehide', onHide);
    document.removeEventListener('visibilitychange', onHide);
  };
}
