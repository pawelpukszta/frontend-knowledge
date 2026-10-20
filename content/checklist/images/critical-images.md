---
title: Priorytet dla krytycznych obrazów
priority: high
sources:
  - title: "web.dev: Optimize resource loading with the Fetch Priority API"
    url: https://web.dev/articles/fetch-priority
---

Obraz LCP w HTML (nie tylko w CSS lub JS), z `fetchpriority="high"`, bez lazy loadingu; w razie potrzeby `<link rel="preload" as="image">` z `imagesrcset` i `imagesizes`.

## Dlaczego to ważne

- Domyślnie przeglądarka pobiera obrazy z niskim priorytetem i podnosi go dopiero po wyliczeniu układu; `fetchpriority="high"` startuje pobieranie od razu i skraca LCP.
- Obraz ustawiony w CSS lub wstawiany przez JS jest odkrywany późno, po pobraniu stylów lub skryptów; to częsta przyczyna LCP powyżej 2,5 s.
- `fetchpriority` działa w Chrome, Edge, Safari 17.2+ i Firefox 132+, więc dotyczy praktycznie wszystkich użytkowników.

## Jak sprawdzić

Kolumna Priority w Network (obraz LCP powinien mieć High od początku), rozbicie LCP w panelu Performance (opóźnienie ładowania zasobu).

## Kod

```html title="Obraz hero"
<head>
  <!-- Needed only if the image is discovered late (CSS background, JS carousel) -->
  <link rel="preload" as="image" fetchpriority="high"
        imagesrcset="/img/hero-800.avif 800w, /img/hero-1600.avif 1600w"
        imagesizes="100vw" type="image/avif" />
</head>
<body>
  <img src="/img/hero-1600.avif"
       srcset="/img/hero-800.avif 800w, /img/hero-1600.avif 1600w" sizes="100vw"
       alt="Plaża Elafonisi o poranku" width="1600" height="900" fetchpriority="high" />
</body>
```

```tsx title="Next.js 16"
import Image from 'next/image';

export function Hero() {
  // `priority` is deprecated in Next.js 16; use fetchPriority (or preload when discovered late)
  return (
    <Image src="/img/hero-santorini.jpg" alt="Santorini o zachodzie słońca"
           width={1600} height={900} sizes="100vw" fetchPriority="high" loading="eager" />
  );
}
```

## Częste błędy

- `fetchpriority="high"` na kilku obrazach naraz; priorytet przestaje cokolwiek znaczyć.
- Karuzela hero, w której pierwszy slajd jest renderowany dopiero po hydratacji.
