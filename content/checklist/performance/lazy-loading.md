---
title: Lazy loading treści poza ekranem
priority: high
sources:
  - title: "web.dev: Browser-level image lazy loading"
    url: https://web.dev/articles/browser-level-image-lazy-loading
---

Obrazy i iframe poniżej zgięcia mają `loading="lazy"`, a ciężkie komponenty ładują się, gdy są potrzebne. Obrazy lazy nadal muszą mieć `width` i `height`.

## Dlaczego to ważne

- Na długiej liście ofert użytkownik często ogląda tylko kilka pierwszych kart; bez lazy loadingu pobiera kilkadziesiąt zdjęć, których nigdy nie zobaczy.
- Mniej pobieranych zasobów na starcie to więcej pasma dla obrazu LCP i krytycznego CSS.
- Osadzone mapy i odtwarzacze wideo w iframe ważą często kilkaset KB JS; `loading="lazy"` odkłada je do czasu przewinięcia.

## Jak sprawdzić

Network przy przewijaniu: zasoby powinny pojawiać się stopniowo. Lighthouse 13 nie ma już osobnego audytu obrazów poza ekranem, więc sprawdzaj to ręcznie lub testem.

## Kod

```html
<!-- Below the fold: browser loads it shortly before it scrolls into view -->
<img src="/img/offers/kreta-hersonissos-400.avif" alt="Hotel Aqua Blue, Kreta"
     width="400" height="300" loading="lazy" decoding="async">

<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Wirtualny spacer po hotelu"
        width="560" height="315" loading="lazy" allowfullscreen></iframe>
```

## Częste błędy

- Własna implementacja lazy loadingu w JS z `data-src`, gdy natywny atrybut wystarcza i działa także bez JS.
