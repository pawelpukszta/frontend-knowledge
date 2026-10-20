import { useSyncExternalStore } from 'react';

/** A tiny external store: state outside React, components subscribe with useStore. */
export function createStore<T>(initial: T) {
  let state = initial;
  const subs = new Set<() => void>();
  return {
    get: () => state,
    set(update: (s: T) => T) {
      state = update(state);
      subs.forEach((f) => f());
    },
    subscribe(f: () => void) {
      subs.add(f);
      return () => { subs.delete(f); };
    },
  };
}
export type Store<T> = ReturnType<typeof createStore<T>>;

/** Selector must return a primitive or a reference taken from the state, so renders stay stable. */
export function useStore<T, S>(store: Store<T>, selector: (s: T) => S): S {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()), () => selector(store.get()));
}
