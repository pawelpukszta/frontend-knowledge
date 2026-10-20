---
title: Service Worker do cache i offline
priority: medium
---

Service Worker przechwytuje zapytania i serwuje zasoby z cache (cache first dla statycznych plików, stale-while-revalidate dla danych mniej krytycznych), przyspieszając kolejne wizyty i umożliwiając działanie offline.

## Dlaczego to ważne

- Powracający użytkownik dostaje powłokę aplikacji i zasoby statyczne z dysku, bez czekania na sieć, nawet przy słabym zasięgu.
- Strategie cache per typ zasobu dają kontrolę, której nie zapewnią same nagłówki HTTP, np. limit liczby obrazów w cache czy fallback przy błędzie.
- Źle skonfigurowany SW potrafi serwować starą wersję aplikacji tygodniami, więc wersjonowanie i strategia aktualizacji są tak samo ważne jak samo cache'owanie.

## Jak sprawdzić

DevTools → Application → Service Workers i Cache Storage; tryb Offline w Network; kolumna Size pokazuje "(ServiceWorker)" dla zasobów z cache.

## Kod

```js title="sw.js (Workbox)"
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST); // hashed build assets injected at build time

registerRoute(({ request }) => request.destination === 'image',
  new CacheFirst({ cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * 24 * 3600 })] }));

registerRoute(({ url }) => url.pathname.startsWith('/api/destinations'),
  new StaleWhileRevalidate({ cacheName: 'destinations' }));

registerRoute(({ request }) => request.mode === 'navigate',
  new NetworkFirst({ cacheName: 'pages', networkTimeoutSeconds: 3 }));
```

## Częste błędy

- Cache first dla HTML lub cen i dostępności: użytkownik widzi nieaktualną ofertę.
- Brak nagłówka `Cache-Control: no-cache` dla samego pliku `sw.js`, co opóźnia wdrażanie poprawek.
