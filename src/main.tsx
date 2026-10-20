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
import { App } from './App';
import { installCopyButtons } from './lib/copy';
import { indexedDbAdapter, memoryAdapter } from './lib/storage';
import { initUserData, userData } from './lib/userData';

installCopyButtons();
await initUserData('indexedDB' in window ? indexedDbAdapter() : memoryAdapter());

// Opening the app without a deep link returns to the last view.
const last = userData.get().settings.lastView;
if (last && (location.hash === '' || location.hash === '#/')) history.replaceState(null, '', last);

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
