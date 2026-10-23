---
title: Web Workers i Service Workers
level: senior
added: 2026-10-20
tags:
  - Web Worker
  - Service Worker
  - offline
  - PWA
  - wątki
summary: "Web Worker wykonuje ciężki JS w osobnym wątku, bez blokowania UI. Service Worker to proxy między stroną a siecią: cache, offline, push."
sources:
  - title: "MDN: Using Web Workers"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
  - title: "MDN: Service Worker API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
  - title: "Chrome: Workbox"
    url: https://developer.chrome.com/docs/workbox
---

## Wyjaśnienie

**Web Worker**:

- Osobny wątek, bez dostępu do DOM. Komunikacja przez `postMessage` (dane są kopiowane algorytmem structured clone lub przekazywane przez Transferable).
- Zastosowania: parsowanie dużych plików, kompresja obrazów, obliczenia, filtrowanie tysięcy rekordów. Biblioteka **Comlink** upraszcza API.

**Service Worker**:

- Działa w tle, niezależnie od karty, tylko przez HTTPS.
- Przechwytuje zapytania sieciowe (`fetch` event) i decyduje: sieć, cache, czy oba.
- Strategie: cache first (assety), network first (API), stale-while-revalidate.
- Umożliwia offline, powiadomienia push, background sync. Fundament PWA. Narzędzie: **Workbox**.
- Cykl życia: register → install → activate → fetch. Aktualizacja wymaga uwagi (stara wersja działa, dopóki są otwarte karty).

## Kod

```js
// main.js
const worker = new Worker(new URL('./filter.worker.js', import.meta.url), { type: 'module' });
worker.postMessage({ offers, query });
worker.onmessage = (e) => render(e.data);

// filter.worker.js
self.onmessage = ({ data }) => {
  const result = data.offers.filter((o) => o.title.includes(data.query));
  self.postMessage(result);
};
```

## Pytania

### Czym różni się Web Worker od Service Workera? {#dom-workers-q1}

Web Worker to wątek do obliczeń, powiązany z konkretną stroną, bez dostępu do DOM. Service Worker to skrypt działający jako proxy sieciowe dla całego originu: przechwytuje requesty, zarządza cache, umożliwia offline i push, działa nawet po zamknięciu strony.

### Kiedy użyjesz Web Workera? {#dom-workers-q2}

Gdy obliczenia na wątku głównym trwają na tyle długo, że blokują interakcje (long tasks): przetwarzanie dużych danych, obrazów, szyfrowanie, złożone wyszukiwanie.
