---
title: Strona zastępcza offline
priority: low
---

Zamiast błędu przeglądarki użytkownik bez sieci widzi własną stronę z informacją, co się stało, przyciskiem ponowienia i np. zapisanymi wcześniej danymi rezerwacji.

## Dlaczego to ważne

- Utrata zasięgu w podróży (lotnisko, pociąg, roaming) jest typowa; własna strona utrzymuje użytkownika w serwisie zamiast zostawiać go z komunikatem przeglądarki.
- Strona offline może pokazać to, co najważniejsze w danej chwili: numer rezerwacji, adres hotelu, telefon do rezydenta, zapisane wcześniej w cache.
- To mały koszt wdrożenia przy już istniejącym Service Workerze: jedna strona w precache i jeden fallback dla nawigacji.

## Jak sprawdzić

Tryb Offline w Network w DevTools i nawigacja do strony, której nie ma w cache; sprawdzenie w Application → Cache Storage, czy `/offline.html` jest zapisana.

## Kod

```js title="sw.js: fallback dla nawigacji"
const CACHE = 'offline-v3';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL)));
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE);
      return cache.match(OFFLINE_URL);
    }),
  );
});
```

## Częste błędy

- Strona offline odwołująca się do CSS, fontów lub obrazów, których nie ma w cache: wyświetli się bez stylów.
