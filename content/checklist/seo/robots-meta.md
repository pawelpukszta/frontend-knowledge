---
title: Poprawne dyrektywy robots
priority: high
sources:
  - title: "Google: Robots meta tag specifications"
    url: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
---

`<meta name="robots">` (lub nagłówek `X-Robots-Tag`, jedyna opcja dla PDF i innych plików) z wartościami takimi jak `noindex`, `nofollow`, `max-snippet`, `max-image-preview`. Przypadkowy `noindex` z wersji testowej to częsta przyczyna zniknięcia z Google.

## Dlaczego to ważne

- Jeden `noindex` przeniesiony ze stagingu na produkcję potrafi w kilka dni usunąć z wyników cały serwis i ruch z wyszukiwarki.
- Jeśli robots.txt blokuje adres, Googlebot nie zobaczy `noindex`; strona może zostać w indeksie jako sam URL znany z linków.
- `max-image-preview:large` pozwala pokazywać duże miniatury (np. w Discover), co zwiększa klikalność.

## Jak sprawdzić

Sprawdź meta robots i nagłówki (`curl -sI`) na produkcji po każdym wdrożeniu; w Search Console raport stron pokazuje adresy wykluczone przez `noindex`.

## Kod

```html
<!-- Indexable page: index and follow are the defaults, no need to write them -->
<meta name="robots" content="max-snippet:-1, max-image-preview:large">

<!-- Internal search results and cart -->
<meta name="robots" content="noindex, follow">
```

```ts title="next.config.ts: staging bez indeksowania"
import type { NextConfig } from 'next';

const isProd = process.env.APP_ENV === 'production';

const config: NextConfig = {
  async headers() {
    // Only non-production environments send noindex; production stays clean
    if (isProd) return [];
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

export default config;
```

## Częste błędy

- Blokada w robots.txt dodana razem z `noindex`, w nadziei na szybsze usunięcie z indeksu; efekt jest odwrotny.
- Sterowanie `noindex` przez `NODE_ENV`, który na stagingu też ma wartość `production`.
