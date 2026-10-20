import { useEffect, useRef, useState } from 'react';
import { href, lastPageHash, navigate } from '../lib/router';
import { Icon } from './Icon';

/**
 * Header search. Typing opens #/szukaj (one history entry, then replaced); Esc or clearing returns to the
 * page the search started from. Keyed by the page it returns to, so it empties when the user leaves search for another page.
 */
export function SearchBox({ query }: { query: string | null }) {
  const [value, setValue] = useState(query ?? '');
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<number>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName);
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const apply = (v: string) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const q = v.trim();
      if (q) navigate(href.search(q), { replace: query !== null });
      else if (query !== null) navigate(lastPageHash(), { replace: true });
    }, 150);
  };

  return (
    <label className="search">
      <span className="sr-only">Szukaj w bazie wiedzy</span>
      <Icon name="search" />
      <input
        ref={input} id="q" type="search" placeholder="Szukaj: closure, INP, flux..." autoComplete="off" value={value}
        onChange={(e) => { setValue(e.target.value); apply(e.target.value); }}
        onKeyDown={(e) => {
          if (e.key !== 'Escape') return;
          setValue('');
          window.clearTimeout(timer.current);
          if (query !== null) navigate(lastPageHash(), { replace: true });
          input.current?.blur();
        }}
      />
      <kbd>/</kbd>
    </label>
  );
}
