// PWA: the service worker precaches the app and all content for offline use. A new deploy waits until the
// reader chooses to reload. The tinyjs desktop app loads from file://, where service workers do not exist.
import { createStore } from './store';

/** Set when a new version is installed and waiting; calling it reloads into that version. */
export const updateReady = createStore<(() => void) | null>(null);

export async function installPwa() {
  if (location.protocol === 'file:' || !('serviceWorker' in navigator)) return;
  // Imported here so tests, which never register a worker, do not load the virtual module.
  const { registerSW } = await import('virtual:pwa-register');
  const update = registerSW({ onNeedRefresh: () => updateReady.set(() => () => void update(true)) });
  // Ask the browser not to evict saved progress under storage pressure (Android, iOS). It may refuse.
  void navigator.storage?.persist?.();
}
