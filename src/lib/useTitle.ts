import { useEffect } from 'react';

export function useTitle(title?: string) {
  useEffect(() => { document.title = title ? `${title} · Baza wiedzy FE` : 'Baza wiedzy FE'; }, [title]);
}
