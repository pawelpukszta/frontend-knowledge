---
title: Ogranicz zbędne parametry URL
priority: medium
---

Parametry sortowania, filtrów i śledzenia tworzą tysiące wariantów adresów. Używaj canonical, nie linkuj wewnętrznie do adresów z UTM i ogranicz kombinacje filtrów dostępne dla robotów.

## Dlaczego to ważne

- Kilka filtrów z kilkoma wartościami i kilka sortowań to tysiące kombinacji; robot marnuje na nie budżet zamiast odwiedzać nowe oferty.
- Wewnętrzne linki z `?utm_source=` tworzą duplikaty i psują analitykę: wizyta z własnego banera liczy się jako nowa kampania.
- Narzędzie "Parametry URL" w Search Console wycofano w 2022 roku; kontrola leży po stronie serwisu: canonical, robots.txt, sposób linkowania.

## Jak sprawdzić

Raport URL z parametrami w crawlerze i statystyki indeksowania w Search Console.

## Kod

```ts title="Canonical tylko z dozwolonymi parametrami"
const INDEXABLE_PARAMS = new Set(["page"]); // filters, sort and utm are dropped

export function canonicalFor(rawUrl: string): string {
  const url = new URL(rawUrl);
  for (const key of [...url.searchParams.keys()]) {
    if (!INDEXABLE_PARAMS.has(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort(); // stable order: ?a=1&b=2 equals ?b=2&a=1
  url.hash = "";
  return url.toString();
}

canonicalFor("https://example.pl/wakacje/grecja?sort=cena&utm_source=fb&page=2");
// "https://example.pl/wakacje/grecja?page=2"
```

## Częste błędy

- Wartości filtrów w różnej kolejności (`?a=1&b=2` i `?b=2&a=1`) tworzące kolejne duplikaty.
- Identyfikator sesji lub koszyka w parametrze adresu.
