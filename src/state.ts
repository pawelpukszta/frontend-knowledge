import type { Level } from './data';
import { useUserData, type LevelFilter } from './lib/userData';

export { setLevel, type LevelFilter } from './lib/userData';
export const useLevel = () => useUserData((d) => d.settings.level);
export const levelOk = (filter: LevelFilter, level: Level) => filter === 'all' || filter === level;
