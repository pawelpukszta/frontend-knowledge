---
title: "CLS: Cumulative Layout Shift"
level: mid
tags:
  - CLS
  - layout shift
  - wymiary obrazów
  - fonty
summary: "Mierzy nieoczekiwane przesunięcia treści podczas życia strony. Najczęstsze przyczyny: obrazy bez wymiarów, wstrzykiwane banery i reklamy, podmiana fontów."
sources:
  - title: "web.dev: Cumulative Layout Shift (CLS)"
    url: https://web.dev/articles/cls
  - title: "web.dev: Optimize CLS"
    url: https://web.dev/articles/optimize-cls
---

## Wyjaśnienie

Wynik przesunięcia = **impact fraction** (jaka część viewportu się przesunęła) × **distance fraction** (o ile). Przesunięcia grupowane są w "okna sesji" (maks. 5 s, przerwy < 1 s), a CLS to największe okno.

Przesunięcia w ciągu 500 ms od interakcji użytkownika (np. rozwinięcie akordeonu po kliknięciu) **nie są liczone**.

Przyczyny i rozwiązania:

- **Obrazy, video, iframe bez wymiarów**: zawsze `width` i `height` lub `aspect-ratio`.
- **Dynamicznie wstrzykiwana treść** (banery cookies, reklamy, "polecane"): zarezerwuj miejsce (`min-height`), pokazuj jako overlay albo poniżej viewportu.
- **Fonty**: podmiana fontu zmienia wymiary tekstu. `font-display: optional` lub `swap` + dopasowanie metryk fontu zastępczego (`size-adjust`), preload fontu.
- **Animacje**: `transform` zamiast `top`/`height`.
- **Skeletony** o rozmiarze docelowej treści.
- Wsparcie **bfcache** (powrót Wstecz bez ponownego ładowania).

## Kod

```css
img, video { max-width: 100%; height: auto; } /* keep ratio from width/height attrs */
.ad-slot { min-height: 250px; }               /* reserve space before the ad loads */
.video-embed { aspect-ratio: 16 / 9; }

@font-face {
  font-family: 'Brand';
  src: url('/brand.woff2') format('woff2');
  font-display: swap;
}
```

## Pytania

### Co powoduje CLS i jak go naprawić? {#perf-cls-q1}

Elementy bez zarezerwowanego miejsca (obrazy bez wymiarów, reklamy, banery, treść doładowywana nad istniejącą), podmiana fontów i animacje właściwości layoutu. Rozwiązanie: wymiary lub `aspect-ratio`, rezerwacja miejsca, overlay zamiast wypychania treści, strategia ładowania fontów, animacje przez `transform`.

### Czy każde przesunięcie layoutu pogarsza CLS? {#perf-cls-q2}

Nie. Przesunięcia w ciągu 500 ms od interakcji użytkownika są uznawane za oczekiwane i pomijane. Liczą się nieoczekiwane zmiany.

## Quiz

### Jak zapobiec CLS przy obrazach? {#perf-cls-z1}

- [ ] Użyć loading="lazy"
- [x] Podać width i height lub aspect-ratio
- [ ] Użyć formatu WebP
- [ ] Dodać fetchpriority="high"

Przeglądarka rezerwuje miejsce na podstawie proporcji jeszcze przed pobraniem obrazu.
