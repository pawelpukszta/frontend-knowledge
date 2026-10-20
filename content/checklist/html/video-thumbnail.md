---
title: Miniatura wideo (poster)
priority: medium
---

Atrybut `poster` pokazuje obraz przed odtworzeniem, zapobiega pustemu prostokątowi i pomaga przy LCP.

## Dlaczego to ważne

- Bez `poster` przeglądarka pokazuje czarny prostokąt lub czeka na pierwszą klatkę z pobranego wideo; użytkownik nie wie, co obejrzy.
- Obraz `poster` może być elementem LCP; lekki plik AVIF lub WebP w wymiarach odtwarzacza przyspiesza ten pomiar, a `preload="none"` oszczędza transfer wideo.
- Atrybuty `width` i `height` na `video` rezerwują proporcje i zapobiegają przesunięciom układu (CLS).

## Jak sprawdzić

Przegląd elementów `<video>`; w panelu Performance lub Lighthouse sprawdź, czy poster jest elementem LCP i jak szybko się ładuje.

## Kod

```html
<!-- If the poster is the LCP element, start fetching it early -->
<link rel="preload" as="image" href="/img/aegean-blue-poster.avif" fetchpriority="high">

<video controls preload="none" width="1280" height="720"
       poster="/img/aegean-blue-poster.avif">
  <source src="/video/aegean-blue.mp4" type="video/mp4">
</video>
```

## Częste błędy

- Poster jako ciężki JPG w rozdzielczości 4K przy odtwarzaczu szerokim na 640 px.
