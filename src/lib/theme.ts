import { useEffect, useState } from 'react';
import { setTheme, useUserData } from './userData';

export type Theme = 'light' | 'dark';
const MIRROR_KEY = 'kbfe:theme';
const query = () => matchMedia('(prefers-color-scheme: dark)');

/**
 * Theme: system preference until the user picks one. The choice lives in user data and is mirrored to
 * localStorage only so index.html can apply it before first paint.
 */
export function useTheme() {
  const saved = useUserData((d) => d.settings.theme);
  const [system, setSystem] = useState<Theme>(() => (query().matches ? 'dark' : 'light'));

  useEffect(() => {
    const mq = query();
    const on = () => setSystem(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (saved) document.documentElement.dataset.theme = saved;
    else delete document.documentElement.dataset.theme;
    try {
      if (saved) localStorage.setItem(MIRROR_KEY, saved);
      else localStorage.removeItem(MIRROR_KEY);
    } catch { /* storage unavailable: only the first paint may flash */ }
  }, [saved]);

  const theme = saved ?? system;
  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}
