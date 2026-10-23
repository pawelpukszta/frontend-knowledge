// Storage adapters: plain key-value I/O for the user data document. The store above them owns the data.

export interface StorageAdapter {
  /** Resolves to undefined when the key was never saved. */
  load(key: string): Promise<unknown>;
  save(key: string, value: unknown): Promise<void>;
}

export function memoryAdapter(): StorageAdapter {
  const data = new Map<string, unknown>();
  return {
    load: async (key) => structuredClone(data.get(key)),
    save: async (key, value) => { data.set(key, structuredClone(value)); },
  };
}

/** The part of the tinyjs page API (`window.tiny.store`) this app uses. */
export interface TinyStore {
  get(key: string): Promise<unknown>;
  /** Resolves false when the file could not be written. */
  set(key: string, value: unknown): Promise<boolean>;
}

/** tinyjs desktop: `store.json` in the app's data folder, written atomically (temp file + rename). */
export function tinyStoreAdapter(store: TinyStore): StorageAdapter {
  return {
    load: async (key) => (await store.get(key)) ?? undefined,
    save: async (key, value) => {
      if (!(await store.set(key, value))) throw new Error(`tiny.store: could not save "${key}"`);
    },
  };
}

const request = <T>(r: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  r.onsuccess = () => resolve(r.result);
  r.onerror = () => reject(r.error);
});

/** IndexedDB: one object store of key-value records. Survives reloads; the browser may evict it (no persist() yet). */
export function indexedDbAdapter(dbName = 'kbfe', storeName = 'kv'): StorageAdapter {
  let db: Promise<IDBDatabase> | undefined;
  const open = () => (db ??= new Promise((resolve, reject) => {
    const r = indexedDB.open(dbName, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(storeName);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  }));
  const tx = async (mode: IDBTransactionMode) => (await open()).transaction(storeName, mode).objectStore(storeName);
  return {
    load: async (key) => request((await tx('readonly')).get(key)),
    save: async (key, value) => { await request((await tx('readwrite')).put(value, key)); },
  };
}
