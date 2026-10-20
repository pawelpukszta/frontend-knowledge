// Minimal hash router: `#/t/closures` style URLs that work from file://, GitHub Pages and a desktop shell.
import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'category'; id: string }
  | { name: 'topic'; id: string }
  | { name: 'notFound' };

export function parseHash(hash: string): Route {
  const [path] = hash.replace(/^#/, '').split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'k' && parts[1]) return { name: 'category', id: parts[1] };
  if (parts[0] === 't' && parts[1]) return { name: 'topic', id: parts[1] };
  return { name: 'notFound' };
}

export const href = {
  home: () => '#/',
  category: (id: string) => `#/k/${id}`,
  topic: (id: string) => `#/t/${id}`,
};

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

/** The raw hash; components parse it with parseHash (cheap, no memo needed). */
export const useHash = () => useSyncExternalStore(subscribe, () => location.hash, () => '');

export const navigate = (hash: string) => { location.hash = hash; };
