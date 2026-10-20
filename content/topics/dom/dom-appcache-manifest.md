---
title: "Plik manifestu w HTML5: AppCache (przestarzały) i Web App Manifest"
level: mid
tags:
  - manifest
  - AppCache
  - application cache
  - PWA
  - Web App Manifest
  - offline
summary: '"Plik manifestu HTML5" to dawny Application Cache: lista plików do trzymania offline. Został usunięty z przeglądarek; zastąpiły go Service Workers. Dziś "manifest" oznacza zwykle Web App Manifest (manifest.json) dla PWA.'
sources:
  - title: "MDN: Web application manifest"
    url: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
  - title: "W3C: Web Application Manifest"
    url: https://www.w3.org/TR/appmanifest/
  - title: "web.dev: Preparing for AppCache removal"
    url: https://web.dev/articles/appcache-removal
  - title: "A List Apart: Application Cache is a Douchebag (Jake Archibald)"
    url: https://alistapart.com/article/application-cache-is-a-douchebag/
  - title: "MDN: Service Worker API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
---

## Wyjaśnienie

**Application Cache (AppCache)**, wprowadzony w HTML5:

- Atrybut `<html manifest="app.appcache">` wskazywał plik tekstowy z sekcjami **`CACHE`** (pliki do zapisania offline), **`NETWORK`** (zawsze z sieci) i **`FALLBACK`** (zamienniki, gdy brak sieci).
- Problemy: nieintuicyjne reguły aktualizacji (zmiana dowolnego pliku wymagała zmiany manifestu), strona zawsze ładowana najpierw z cache, trudne debugowanie. Jego wady szczegółowo opisał Jake Archibald w głośnym artykule na A List Apart (link w źródłach).
- **Usunięty**: Firefox od wersji 84 (grudzień 2020); Chrome wyłączył go w wersji 85 w bezpiecznych kontekstach, a całkowicie usunął w październiku 2021. Na rozmowie warto powiedzieć, że to technologia historyczna.

**Następcy:**

- **Service Worker + Cache API**: pełna, programowa kontrola nad cache i działaniem offline (strategie cache first, network first, stale-while-revalidate; Workbox).
- **Web App Manifest** (`<link rel="manifest" href="/manifest.webmanifest">`): plik JSON z nazwą aplikacji, ikonami, kolorami, `start_url` i trybem `display`. Pozwala zainstalować stronę jako aplikację (PWA). Nie służy do cache.

## Kod

```html
<!-- Legacy AppCache (removed from browsers) -->
<html manifest="offline.appcache">

<!-- offline.appcache
CACHE MANIFEST
# v12
CACHE:
/css/app.css
/js/app.js
NETWORK:
/api/
FALLBACK:
/ /offline.html
-->

<!-- Modern: Web App Manifest for installable PWA -->
<link rel="manifest" href="/manifest.webmanifest" />
```

```json title="manifest.webmanifest"
{
  "name": "Wakacje: moje rezerwacje",
  "short_name": "Rezerwacje",
  "start_url": "/moje-rezerwacje",
  "display": "standalone",
  "theme_color": "#2c56c9",
  "icons": [{ "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }]
}
```

## Pytania

### Czym jest plik manifestu w HTML5? {#dom-appcache-manifest-q1}

W oryginalnym HTML5 był to manifest Application Cache: plik z sekcjami `CACHE`, `NETWORK` i `FALLBACK`, wskazywany atrybutem `manifest` na `<html>`, który pozwalał działać stronie offline. AppCache jest przestarzały i usunięty z przeglądarek na rzecz Service Workerów. Dziś "manifest" to zwykle Web App Manifest (JSON), który opisuje instalowalną aplikację PWA.

### Czym różni się Web App Manifest od Service Workera? {#dom-appcache-manifest-q2}

Manifest to statyczny opis aplikacji (nazwa, ikony, kolory, tryb wyświetlania), potrzebny do instalacji PWA. Service Worker to skrypt, który przechwytuje zapytania sieciowe i zarządza cache, zapewniając działanie offline i powiadomienia push.

## Quiz

### Co zastąpiło HTML5 Application Cache (plik manifestu)? {#dom-appcache-manifest-z1}

- [ ] Web App Manifest
- [x] Service Worker z Cache API
- [ ] localStorage
- [ ] HTTP/2 Server Push

Web App Manifest opisuje instalowalną aplikację, ale to Service Worker odpowiada za cache i offline.
