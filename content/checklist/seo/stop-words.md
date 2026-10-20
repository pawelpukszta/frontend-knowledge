---
title: Bez zbędnych słów w slugach
priority: low
---

Spójniki i przyimki ("i", "w", "na", "the", "and") zwykle można pominąć w nowych adresach. Nie zmieniaj istniejących URL bez planu przekierowań.

## Dlaczego to ważne

- Krótszy slug jest czytelniejszy i łatwiejszy do zapamiętania: `/co-zabrac-wakacje-gory` zamiast `/co-warto-zabrac-ze-soba-na-wakacje-w-gory`.
- Wyszukiwarki rozumieją zapytania bez spójników, więc ich usunięcie nie szkodzi trafności; słowa zmieniające sens ("bez", "z" w "wakacje-z-psem") zostaw.
- Zmiana istniejących adresów tylko dla estetyki to ryzyko: utrata sygnałów, łańcuchy przekierowań, zepsute linki zewnętrzne.

## Jak sprawdzić

Przegląd slugów nowych treści.

## Kod

```ts title="lib/slug-words.ts"
// Conjunctions and prepositions usually safe to drop from new slugs.
// Meaning-changing words like "bez" (without) or "z" (with) are kept on purpose.
const STOP_WORDS = new Set(["i", "oraz", "w", "we", "na", "do", "o", "the", "and", "of", "in"]);

export function trimStopWords(slug: string): string {
  const parts = slug.split("-").filter((word) => !STOP_WORDS.has(word));
  return parts.length >= 2 ? parts.join("-") : slug; // never collapse to one word
}

trimStopWords("co-zabrac-na-wakacje-w-gory"); // "co-zabrac-wakacje-gory"
```

## Częste błędy

- Hurtowe skracanie slugów istniejących artykułów bez przekierowań.
