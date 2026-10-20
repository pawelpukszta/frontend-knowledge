---
title: Canonical na każdej stronie
priority: high
sources:
  - title: "Google: How to specify a canonical URL"
    url: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
---

Każda indeksowalna strona ma `<link rel="canonical">` z pełnym, preferowanym adresem, zwykle wskazującym na samą siebie.

## Dlaczego to ważne

- Ta sama treść bywa dostępna pod wieloma adresami (parametry UTM, sortowanie, filtry, wielkość liter, ukośnik na końcu); bez canonical Google sam wybiera wersję, często nie tę, którą chcesz.
- Canonical scala sygnały (linki, popularność) z duplikatów w jeden adres, zamiast rozpraszać je na warianty.
- Ogranicza marnowanie budżetu indeksowania na kopie stron w dużych serwisach, np. listach ofert z filtrami.

## Jak sprawdzić

Crawler (np. Screaming Frog): brakujące, niespójne i wskazujące na przekierowanie canonicale; w Search Console Inspekcja adresu URL pokazuje canonical wybrany przez Google.

## Kod

```html
<!-- On https://example.pl/wakacje/grecja?utm_source=newsletter&sort=price -->
<link rel="canonical" href="https://example.pl/wakacje/grecja" />
```

```tsx title="Next.js App Router"
// app/wakacje/[country]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  return { alternates: { canonical: `https://example.pl/wakacje/${country}` } };
}
```

## Częste błędy

- Canonical na wszystkich stronach paginacji wskazujący stronę 1.
- Względny adres lub adres z parametrami śledzącymi w canonical.
