import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'kbfe:theme';
const systemDark = () => matchMedia('(prefers-color-scheme: dark)').matches;

function readSaved(): Theme | null {
  try {
    const t = localStorage.getItem(KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch { return null; }
}

/** Theme: system preference until the user picks one. index.html applies the saved choice before first paint. */
export function useTheme() {
  const [saved, setSaved] = useState<Theme | null>(readSaved);
  const [system, setSystem] = useState<Theme>(() => (systemDark() ? 'dark' : 'light'));

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = () => setSystem(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (saved) document.documentElement.dataset.theme = saved;
    else delete document.documentElement.dataset.theme;
  }, [saved]);

  const theme = saved ?? system;
  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch { /* storage unavailable: choice lasts for this session */ }
    setSaved(next);
  }, [theme]);
  return { theme, toggle };
}
