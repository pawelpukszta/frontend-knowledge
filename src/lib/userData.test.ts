import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryAdapter, type StorageAdapter } from './storage';
import { emptyDoc, initUserData, loadProblem, setLevel, toggleQaMark, userData } from './userData';

let stop: (() => void) | undefined;
beforeEach(() => {
  userData.set(() => emptyDoc());
  loadProblem.set(() => null);
});
afterEach(() => { stop?.(); stop = undefined; vi.useRealTimers(); });

describe('user data', () => {
  it('starts empty without a message when nothing is stored', async () => {
    stop = await initUserData(memoryAdapter());
    expect(userData.get()).toEqual(emptyDoc());
    expect(loadProblem.get()).toBeNull();
  });

  it('loads a stored document and fills fields added later', async () => {
    const a = memoryAdapter();
    await a.save('userData', { schemaVersion: 1, qaStatus: { 'js-this-q1': 'known' } });
    stop = await initUserData(a);
    expect(userData.get().qaStatus).toEqual({ 'js-this-q1': 'known' });
    expect(userData.get().settings.level).toBe('all');
  });

  it('starts empty on corrupt data, keeps a backup and tells the user', async () => {
    const a = memoryAdapter();
    const saved: string[] = [];
    const spy: StorageAdapter = { load: a.load, save: async (k, v) => { saved.push(k); await a.save(k, v); } };
    await a.save('userData', { schemaVersion: 1, qaStatus: 'broken' });
    stop = await initUserData(spy);
    expect(userData.get()).toEqual(emptyDoc());
    expect(loadProblem.get()).toMatch(/uszkodzone/);
    expect(saved.some((k) => k.startsWith('userData-unreadable-'))).toBe(true);
  });

  it('does not block start-up when storage never answers', async () => {
    const hanging: StorageAdapter = { load: () => new Promise(() => {}), save: async () => {} };
    stop = await initUserData(hanging, { timeout: 10 });
    expect(userData.get()).toEqual(emptyDoc());
    expect(loadProblem.get()).not.toBeNull();
  });

  it('debounces saves: many quick changes, one write with the final state', async () => {
    const a = memoryAdapter();
    const save = vi.spyOn(a, 'save');
    stop = await initUserData(a, { delay: 300 });
    vi.useFakeTimers();
    toggleQaMark('q1', 'review');
    setLevel('senior');
    toggleQaMark('q1', 'known');
    expect(save).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(300);
    expect(save).toHaveBeenCalledTimes(1);
    expect(await a.load('userData')).toMatchObject({ qaStatus: { q1: 'known' }, settings: { level: 'senior' } });
  });

  it('toggling the same mark twice clears it', () => {
    toggleQaMark('q1', 'known');
    toggleQaMark('q1', 'known');
    expect(userData.get().qaStatus).toEqual({});
  });
});
