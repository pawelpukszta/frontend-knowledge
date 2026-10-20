---
title: picture z fallbackiem img
priority: high
sources:
  - title: "MDN: The picture element"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture
---

`<picture>` z elementami `<source type="image/avif">` i `<source type="image/webp">` (lub `media` dla innego kadru), a jako ostatnie dziecko zawsze `<img>` z `alt`, wymiarami i źródłem zapasowym.

## Dlaczego to ważne

- `<img>` jest tym, co faktycznie się renderuje: to on niesie `alt`, `width`/`height`, `loading` i `fetchpriority`; `<source>` tylko podmienia plik.
- Bez `<img>` w środku `<picture>` nic się nie wyświetli, nawet w przeglądarce obsługującej wszystkie formaty.
- Przeglądarka wybiera pierwsze pasujące źródło, więc kolejność AVIF, WebP, JPEG decyduje o tym, ile bajtów zostanie pobranych.

## Jak sprawdzić

Przegląd znaczników `<picture>`; w konsoli `$0.currentSrc` na zaznaczonym `<img>` pokazuje, które źródło zostało wybrane.

## Kod

```html title="Formaty i art direction"
<picture>
  <!-- Mobile: tighter square crop -->
  <source media="(max-width: 640px)" type="image/avif"
          srcset="/img/hotel-mobile-600.avif 600w, /img/hotel-mobile-900.avif 900w"
          sizes="100vw" width="900" height="900" />
  <!-- Desktop: wide crop -->
  <source type="image/avif"
          srcset="/img/hotel-1200.avif 1200w, /img/hotel-1800.avif 1800w"
          sizes="(max-width: 1280px) 100vw, 1280px" />
  <source type="image/webp"
          srcset="/img/hotel-1200.webp 1200w, /img/hotel-1800.webp 1800w"
          sizes="(max-width: 1280px) 100vw, 1280px" />
  <img src="/img/hotel-1200.jpg" alt="Hotel nad zatoką z prywatną plażą"
       width="1800" height="1012" />
</picture>
```

## Częste błędy

- Stawianie `alt` na `<picture>` lub `<source>`; działa tylko na `<img>`.
- Brak `type` w `<source>`, przez co przeglądarka może wybrać format, którego nie obsługuje.
