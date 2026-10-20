---
title: Meta tagi Twitter Card (X)
priority: medium
---

`twitter:card` (zwykle `summary_large_image`) i opcjonalnie `twitter:site`. X korzysta z `og:title`, `og:description` i `og:image` jako zapasu, ale typ karty trzeba ustawić osobno.

## Dlaczego to ważne

- Bez `twitter:card` link na X może pokazać się jako mała karta albo bez dużego podglądu.
- Tagi `twitter:*` odczytują też inne narzędzia budujące podglądy linków, np. Slack i Discord.
- Nie trzeba dublować wszystkiego: wystarczy `twitter:card`, resztę X weźmie z Open Graph, co upraszcza utrzymanie.

## Jak sprawdzić

Wklej link do wersji roboczej posta na X lub użyj zewnętrznego podglądu kart (oficjalny Card Validator nie pokazuje już podglądu).

## Kod

```html
<!-- Minimal set: X falls back to og:title, og:description and og:image -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@exampletravel">
<meta property="og:title" content="Kreta all inclusive od 2499 zł">
<meta property="og:description" content="214 hoteli, wyloty z 9 miast.">
<meta property="og:image" content="https://example.pl/og/kreta-2027.jpg">
```

## Częste błędy

- Obraz karty w formacie, którego X nie obsługuje (np. SVG).
