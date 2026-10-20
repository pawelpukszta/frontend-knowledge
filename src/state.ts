import type { Level } from './data';
import { createStore, useStore } from './lib/store';

export type LevelFilter = Level | 'all';
export const prefs = createStore({ level: 'all' as LevelFilter });
export const useLevel = () => useStore(prefs, (s) => s.level);
export const setLevel = (level: LevelFilter) => prefs.set((s) => ({ ...s, level }));
export const levelOk = (filter: LevelFilter, level: Level) => filter === 'all' || filter === level;
