---
title: Poprawna składnia XML sitemap
priority: high
sources:
  - title: "sitemaps.org: Protocol"
    url: https://www.sitemaps.org/protocol.html
  - title: "Google: Build and submit a sitemap"
    url: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
---

Zgodność z protokołem sitemaps.org: maks. 50 000 adresów i 50 MB (bez kompresji) na plik, pełne adresy URL, kodowanie UTF-8, escapowane znaki specjalne (`&` jako `&amp;`), `lastmod` w formacie W3C Datetime.

## Dlaczego to ważne

- Błąd składni XML (np. nieescapowany `&` w adresie) sprawia, że Google nie odczyta pliku wcale, nie tylko jednej pozycji.
- Większy serwis musi dzielić mapę na pliki i spinać je indeksem map witryn; plik powyżej limitu zostanie odrzucony.
- Google ignoruje `priority` i `changefreq`, ale używa `lastmod`, jeśli jest konsekwentnie zgodny z rzeczywistością; data wdrożenia wpisana przy każdym adresie odbiera mu wartość.

## Jak sprawdzić

Raport map witryn w Search Console, `xmllint --noout sitemap.xml` w CI.

## Kod

```xml title="sitemap.xml"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.pl/wakacje/grecja/kreta</loc>
    <!-- Date of the last real content change, not of the deploy -->
    <lastmod>2026-09-28T14:30:00+02:00</lastmod>
  </url>
  <url>
    <!-- & must be escaped as &amp; -->
    <loc>https://example.pl/wycieczki/rodzina&amp;dzieci</loc>
  </url>
</urlset>
```

```xml title="sitemap-index.xml"
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://example.pl/sitemaps/oferty-1.xml</loc></sitemap>
  <sitemap><loc>https://example.pl/sitemaps/oferty-2.xml</loc></sitemap>
  <sitemap><loc>https://example.pl/sitemaps/hotele.xml</loc></sitemap>
</sitemapindex>
```

## Częste błędy

- Względne adresy (`/wakacje/kreta`) w `<loc>`.
- `lastmod` ustawiany na bieżącą datę przy każdym generowaniu.
