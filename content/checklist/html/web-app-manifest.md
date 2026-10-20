---
title: Web App Manifest
priority: medium
sources:
  - title: "MDN: Web application manifest"
    url: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
---

`<link rel="manifest">` z nazwą, ikonami, `start_url`, `display` i kolorami pozwala zainstalować stronę jako aplikację.

## Dlaczego to ważne

- Manifest decyduje, jak strona wygląda po instalacji: nazwa pod ikoną, ekran startowy, kolor paska, tryb bez paska adresu (`standalone`).
- Bez pola `id` tożsamość aplikacji wynika ze `start_url`, więc jego późniejsza zmiana tworzy z punktu widzenia przeglądarki nową aplikację.
- `shortcuts` dodają skróty (np. "Moje rezerwacje") po przytrzymaniu ikony, a ikona `maskable` nie zostanie ucięta przez maskę systemu Android.

## Jak sprawdzić

DevTools → Application → Manifest (błędy, ostrzeżenia, podgląd ikon).

## Kod

```html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0b57d0">
```

```json title="manifest.webmanifest"
{
  "id": "/",
  "name": "Wakacje: rezerwacje i oferty",
  "short_name": "Wakacje",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0b57d0",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [{ "name": "Moje rezerwacje", "url": "/konto/rezerwacje" }]
}
```

## Częste błędy

- Ikona z logo przy samej krawędzi oznaczona jako `maskable`: system utnie jej fragmenty.
