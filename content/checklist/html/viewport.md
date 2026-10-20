---
title: Meta viewport
priority: critical
sources:
  - title: "MDN: Viewport meta tag"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element
---

`<meta name="viewport" content="width=device-width, initial-scale=1">`. Bez niego telefony renderują stronę w szerokości ok. 980 px i pomniejszają.

## Dlaczego to ważne

- Bez meta viewport media queries dla telefonów nie zadziałają, a tekst jest mikroskopijny; użytkownik musi powiększać i przewijać w poziomie.
- Google indeksuje i ocenia strony w wersji mobilnej (mobile-first indexing), więc problem z widokiem mobilnym to problem z widocznością w wyszukiwarce.
- Nie dodawaj `maximum-scale=1` ani `user-scalable=no`: blokują powiększanie i łamią WCAG 1.4.4 (Safari na iOS od lat i tak je ignoruje).

## Jak sprawdzić

Źródło strony, test na telefonie lub w trybie urządzenia w DevTools; axe (`meta-viewport`) wykrywa blokadę zoomu.

## Kod

```html
<!-- Bad: blocks pinch zoom, fails WCAG 1.4.4 -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

<!-- Good -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Good: on-screen keyboard resizes the layout (Chromium, Firefox) -->
<meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content">
```

## Częste błędy

- Blokowanie zoomu, "żeby inputy nie powiększały strony na iOS"; lepiej ustawić `font-size` pól na co najmniej 16 px.
