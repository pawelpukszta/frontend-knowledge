---
title: srcset z deskryptorami szerokości
priority: high
---

`srcset` z wariantami (`400w`, `800w`, `1200w`) i zawsze z `sizes` odpowiadającym układowi. Deskryptory gęstości (`1x`, `2x`) tylko dla obrazów o stałym rozmiarze, np. logo.

## Dlaczego to ważne

- Bez `sizes` przeglądarka zakłada `100vw` i na desktopie pobierze największy wariant nawet do miniatury zajmującej jedną trzecią ekranu.
- Przeglądarka wybiera wariant, zanim zna CSS, więc `sizes` jest jedyną informacją o docelowej szerokości w chwili rozpoczęcia pobierania.
- Z deskryptorami `w` przeglądarka sama uwzględnia gęstość pikseli i może brać pod uwagę oszczędzanie danych.

## Jak sprawdzić

W DevTools sprawdź `currentSrc` obrazu przy różnych szerokościach okna i ustawieniach DPR w trybie urządzenia.

## Kod

```html title="Karta oferty w siatce 1/2/3 kolumny"
<img
  src="/img/oferta-kreta-800.webp"
  srcset="/img/oferta-kreta-400.webp 400w,
          /img/oferta-kreta-800.webp 800w,
          /img/oferta-kreta-1200.webp 1200w"
  sizes="(min-width: 1280px) 400px,
         (min-width: 768px) 50vw,
         100vw"
  alt="Kreta, hotel Aegean Blue, 7 nocy all inclusive"
  width="1200" height="800" loading="lazy" />
```

## Częste błędy

- `sizes="100vw"` skopiowane do każdego obrazu niezależnie od układu.
- Mieszanie deskryptorów `w` i `x` w jednym `srcset`.
