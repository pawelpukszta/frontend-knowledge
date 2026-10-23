import { describe, expect, it } from 'vitest';
import { indexedDbAdapter, memoryAdapter, tinyStoreAdapter, type StorageAdapter, type TinyStore } from './storage';

let n = 0;
/** Mimics tiny.store: JSON values, null for a key that was never set. */
const fakeTinyStore = (): TinyStore => {
  const file = new Map<string, string>();
  return {
    get: async (key) => (file.has(key) ? JSON.parse(file.get(key)!) : null),
    set: async (key, value) => { file.set(key, JSON.stringify(value)); return true; },
  };
};
// Each factory call returns two adapters over the same backing storage, like two app launches.
const impls: [string, () => [StorageAdapter, StorageAdapter]][] = [
  ['memory', () => { const a = memoryAdapter(); return [a, a]; }],
  ['IndexedDB', () => { const name = `test-${++n}`; return [indexedDbAdapter(name), indexedDbAdapter(name)]; }],
  ['tiny.store', () => { const s = fakeTinyStore(); return [tinyStoreAdapter(s), tinyStoreAdapter(s)]; }],
];

describe.each(impls)('%s adapter contract', (_name, make) => {
  it('returns undefined for a key that was never saved', async () => {
    const [a] = make();
    expect(await a.load('doc')).toBeUndefined();
  });

  it('round-trips a document and overwrites on save', async () => {
    const [a, b] = make();
    await a.save('doc', { schemaVersion: 1, list: ['x'], nested: { k: true } });
    await a.save('doc', { schemaVersion: 1, list: ['y'] });
    expect(await b.load('doc')).toEqual({ schemaVersion: 1, list: ['y'] });
  });

  it('keeps keys independent and isolates stored values from later mutation', async () => {
    const [a] = make();
    const value = { list: [1] };
    await a.save('one', value);
    await a.save('two', 'text');
    value.list.push(2);
    expect(await a.load('one')).toEqual({ list: [1] });
    expect(await a.load('two')).toBe('text');
  });
});

it('tiny.store adapter rejects when the file could not be written', async () => {
  const a = tinyStoreAdapter({ get: async () => null, set: async () => false });
  await expect(a.save('doc', {})).rejects.toThrow(/could not save "doc"/);
});
