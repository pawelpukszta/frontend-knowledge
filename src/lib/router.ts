// Minimal hash router: `#/t/closures` style URLs that work from file://, GitHub Pages and a desktop shell.
import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'category'; id: string }
  | { name: 'topic'; id: string }
  | { name: 'search'; q: string }
  | { name: 'qa'; cat: string | null; status: QaFilter }
  | { name: 'review' }
  | { name: 'notFound' };

/** Status filter of the interview questions view. */
export type QaFilter = 'all' | 'new' | 'review' | 'known';
const QA_FILTERS: QaFilter[] = ['all', 'new', 'review', 'known'];

export function parseHash(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  const params = new URLSearchParams(query);
  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'k' && parts[1]) return { name: 'category', id: parts[1] };
  if (parts[0] === 't' && parts[1]) return { name: 'topic', id: parts[1] };
  if (parts[0] === 'szukaj') return { name: 'search', q: params.get('q') ?? '' };
  if (parts[0] === 'pytania') {
    const s = params.get('s') as QaFilter;
    return { name: 'qa', cat: params.get('k'), status: QA_FILTERS.includes(s) ? s : 'all' };
  }
  if (parts[0] === 'powtorka') return { name: 'review' };
  return { name: 'notFound' };
}

export const href = {
  home: () => '#/',
  category: (id: string) => `#/k/${id}`,
  topic: (id: string) => `#/t/${id}`,
  search: (q: string) => `#/szukaj?${new URLSearchParams({ q })}`,
  qa: (cat: string | null = null, status: QaFilter = 'all') => {
    const p = new URLSearchParams();
    if (cat) p.set('k', cat);
    if (status !== 'all') p.set('s', status);
    return `#/pytania${p.size ? `?${p}` : ''}`;
  },
  review: () => '#/powtorka',
};

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

/** The raw hash; components parse it with parseHash (cheap, no memo needed). */
export const useHash = () => useSyncExternalStore(subscribe, () => location.hash, () => '');

/** `replace` updates the URL without a new history entry (used while typing a search query). */
export function navigate(hash: string, { replace = false } = {}) {
  if (!replace) { location.hash = hash; return; }
  history.replaceState(history.state, '', hash);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

// The last page that was not a search, so leaving search returns there.
let lastPage = '#/';
const remember = () => { if (parseHash(location.hash).name !== 'search') lastPage = location.hash || '#/'; };
if (typeof window !== 'undefined') {
  remember();
  window.addEventListener('hashchange', remember);
}
export const lastPageHash = () => lastPage;
