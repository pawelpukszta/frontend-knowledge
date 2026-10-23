import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/400-italic.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/800.css';
import './styles/tokens.css';
import './styles/app.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { fetchContent, setContent } from './data';
import { installCopyButtons } from './lib/copy';
import { installPwa } from './lib/pwa';
import { indexedDbAdapter, memoryAdapter, tinyStoreAdapter, type TinyStore } from './lib/storage';
import { initUserData, userData } from './lib/userData';

declare global {
  /** Injected by the tinyjs desktop shell; absent in the browser and the PWA. */
  interface Window { tiny?: { store: TinyStore } }
}

const root = document.getElementById('root')!;
try {
  setContent(await fetchContent());
} catch (e) {
  root.textContent = 'Nie udało się wczytać treści. Sprawdź połączenie z internetem i odśwież stronę.';
  throw e;
}
installCopyButtons();
void installPwa();
const tiny = window.tiny;
await initUserData(tiny ? tinyStoreAdapter(tiny.store) : 'indexedDB' in window ? indexedDbAdapter() : memoryAdapter());

// Opening the app without a deep link returns to the last view.
const last = userData.get().settings.lastView;
if (last && (location.hash === '' || location.hash === '#/')) history.replaceState(null, '', last);

// Imported after setContent: some views build lookup tables from the content when their module loads.
const { App } = await import('./App');
createRoot(root).render(<StrictMode><App /></StrictMode>);
