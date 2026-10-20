---
title: Dane strukturalne JSON-LD
priority: high
---

JSON-LD (zalecany przez Google format) opisuje typ treści: organizację, produkt, ofertę, wydarzenie, artykuł. Umożliwia rich results i lepsze zrozumienie strony, także przez systemy AI. Dane muszą odpowiadać treści widocznej na stronie.

## Dlaczego to ważne

- Rich results (cena i dostępność, oceny, ścieżka nawigacyjna, wideo) wyróżniają wynik w SERP i zwykle zwiększają CTR bez zmiany pozycji.
- JSON-LD jest oddzielony od HTML, więc łatwo generować go z tych samych danych co widok i testować w CI; microdata wymaga przeplatania atrybutów z markupem.
- Dane niezgodne z treścią lub wprowadzające w błąd mogą skończyć się ręcznym działaniem Google i utratą rich results w całym serwisie.
- Część typów nie daje już rich results w Google (FAQ od maja 2026, HowTo, pole wyszukiwania w linkach do podstron), więc priorytetem są typy z aktualnej galerii Search Central.

## Jak sprawdzić

Rich Results Test, Schema Markup Validator, raporty ulepszeń w Search Console.

## Kod

```tsx title="components/JsonLd.tsx"
import type { Thing, WithContext } from "schema-dts";

export function JsonLd({ data }: { data: WithContext<Thing> }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so a value like "</script>" cannot break out of the tag (XSS)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// Usage: <JsonLd data={{ "@context": "https://schema.org", "@type": "TravelAgency", name: "Example Podróże" }} />
```

## Częste błędy

- Oznaczanie treści niewidocznych dla użytkownika, np. ocen, których nie ma na stronie.
- Sklejanie JSON-LD ze stringów w szablonie zamiast serializacji obiektu.
