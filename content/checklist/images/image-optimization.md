---
title: Optymalizacja wszystkich obrazów
priority: high
---

Każdy obraz przechodzi przez pipeline: właściwy format, wymiary dopasowane do wyświetlania, kompresja, usunięte metadane. Najlepiej automatycznie (CDN obrazów, `next/image`, sharp w buildzie), a nie ręcznie.

## Dlaczego to ważne

- Ręczna optymalizacja przestaje działać z pierwszym zdjęciem wgranym przez redakcję prosto z aparatu (6000 px, 8 MB); automat działa na każdym uploadzie.
- Metadane EXIF potrafią zawierać współrzędne GPS, model aparatu i datę; ich usunięcie zmniejsza plik i chroni prywatność autorów.
- Spójny pipeline daje przewidywalne LCP i wagę stron, co ułatwia utrzymanie budżetów wydajności.

## Jak sprawdzić

Lighthouse (sekcja obrazów), rozmiary w Network; sprawdź, czy obraz wgrany przez CMS trafia na stronę już przetworzony.

## Kod

```ts title="next.config.ts (Next.js 16)"
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first, WebP fallback via Accept header
    qualities: [60, 75],                   // required allowlist since Next.js 16
    deviceSizes: [640, 828, 1080, 1280, 1920],
    remotePatterns: [new URL('https://cdn.partner.example/hotels/**')],
    minimumCacheTTL: 60 * 60 * 24 * 30,    // 30 days
  },
};

export default nextConfig;
```

## Częste błędy

- Optymalizacja obrazów w repozytorium, ale nie tych z CMS i zewnętrznych API, które stanowią większość.
