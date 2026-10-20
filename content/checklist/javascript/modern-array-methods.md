---
title: Nowoczesne metody tablic i obiektów
priority: medium
---

`map`, `filter`, `find`, `some`, `Object.entries`, `Object.groupBy`, `at()`, `structuredClone` zamiast ręcznych pętli i bibliotek pomocniczych.

## Dlaczego to ważne

- Deklaratywne metody mówią, co kod robi (`filter`, `some`), zamiast jak; mniej zmiennych pomocniczych to mniej błędów indeksów.
- `structuredClone` poprawnie kopiuje głęboko obiekty z `Date`, `Map`, `Set` i cyklami, czego nie robi `JSON.parse(JSON.stringify())`.
- Wbudowane `Object.groupBy`, `toSorted` czy metody `Set` (Baseline 2024) pozwalają usunąć zależności od lodash i zmniejszyć bundle.

## Jak sprawdzić

Przegląd kodu; reguły z eslint-plugin-unicorn (np. `prefer-at`, `no-for-loop`) i sprawdzenie celu `browserslist`/`target` dla nowszych metod.

## Kod

```ts
const byCountry = Object.groupBy(offers, (o) => o.country); // { Grecja: [...], Hiszpania: [...] }
const last = offers.at(-1);
const hasLastMinute = offers.some((o) => o.tags.includes("last-minute"));
const draft = structuredClone(booking); // deep copy, keeps Date objects
const shared = new Set(myFavs).intersection(new Set(promoIds));
for (const [code, price] of Object.entries(pricesByCode)) {
  console.info(code, price);
}
```

## Częste błędy

- `forEach` z `async` callbackiem, który nie czeka na zakończenie operacji; użyj `for...of` z `await` lub `Promise.all`.
