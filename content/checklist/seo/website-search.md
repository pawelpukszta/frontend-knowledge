---
title: Schema WebSite z SearchAction
priority: low
---

Historycznie `WebSite` z `potentialAction` typu `SearchAction` dawało pole wyszukiwania w wynikach (sitelinks search box). Google wycofało tę funkcję w listopadzie 2024, więc dziś to głównie opis witryny; sam `WebSite` z `name` i `alternateName` nadal pomaga Google wybrać nazwę witryny w wynikach.

## Dlaczego to ważne

- Nie wdrażaj `SearchAction` w nadziei na pole wyszukiwania w Google; istniejący znacznik nie szkodzi i może być rozumiany przez inne systemy.
- Google używa `WebSite` (`name`, `alternateName`, `url`) ze strony głównej do ustalenia nazwy witryny wyświetlanej przy wyniku; bez niego może pokazać samą domenę lub niechcianą nazwę.
- Znacznik umieszcza się na stronie głównej domeny, nie na każdej podstronie.

## Jak sprawdzić

Sprawdź JSON-LD strony głównej; porównaj nazwę witryny w wynikach z `name`.

## Kod

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Example Podróże",
  "alternateName": ["ExamplePodroze", "example.pl"],
  "url": "https://example.pl/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.pl/szukaj?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

## Częste błędy

- Różne wartości `name` w `WebSite`, `og:site_name` i `<title>` strony głównej.
