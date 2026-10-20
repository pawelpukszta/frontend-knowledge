---
title: Favicony dla wszystkich urządzeń
priority: medium
sources:
  - title: "Google Search Central: Define a favicon to show in search results"
    url: https://developers.google.com/search/docs/appearance/favicon-in-search
---

Minimum: `favicon.ico` lub SVG, `apple-touch-icon` 180x180 i ikony 192 i 512 px w Web App Manifest (najlepiej także wersja `maskable`).

## Dlaczego to ważne

- Favicona wyróżnia kartę wśród kilkunastu otwartych i pojawia się w zakładkach, historii oraz przy wynikach Google; jej brak wygląda nieprofesjonalnie.
- Google wymaga favicony kwadratowej, co najmniej 8x8 px, i zaleca rozmiar większy niż 48x48 px, żeby dobrze wyglądała na różnych powierzchniach.
- Bez `apple-touch-icon` iOS przy dodaniu do ekranu początkowego pokaże zastępczą ikonę zamiast logo.
- Favicona SVG może reagować na `prefers-color-scheme`, więc logo pozostaje widoczne na ciemnym pasku kart.

## Jak sprawdzić

Przegląd head i manifestu; DevTools, Application, Manifest (podgląd ikon); test dodania do ekranu głównego.

## Kod

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"> <!-- 180x180 -->
<link rel="manifest" href="/manifest.webmanifest">
```

```xml title="icon.svg"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    path { fill: #0b57d0; }
    @media (prefers-color-scheme: dark) { path { fill: #8ab4f8; } }
  </style>
  <path d="M16 2 30 16 16 30 2 16z"/>
</svg>
```

## Częste błędy

- Favicona zablokowana w robots.txt lub dostępna tylko po zalogowaniu: Google jej nie pobierze.
