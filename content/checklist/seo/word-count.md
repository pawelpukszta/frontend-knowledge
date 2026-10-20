---
title: Bez "cienkich" treści na kluczowych stronach
priority: medium
---

Strony z kilkoma zdaniami unikalnej treści rzadko odpowiadają na potrzeby użytkownika. Liczy się kompletność odpowiedzi, a nie sztywna liczba słów; orientacyjnie strony poniżej ok. 200 słów treści głównej warto przejrzeć.

## Dlaczego to ważne

- "Cienkie" strony (np. opis hotelu skopiowany od touroperatora plus galeria) nie wnoszą nic ponad setki identycznych kopii i mają małe szanse na indeksację.
- Duża liczba słabych stron rozmywa ocenę jakości całego serwisu i marnuje budżet indeksowania.
- Google nie ma minimalnej liczby słów; tekst rozdmuchany do 2000 słów "pod SEO" jest równie zły jak zbyt krótki.

## Jak sprawdzić

Crawler z ekstrakcją liczby słów treści głównej (bez menu i stopki); listę krótkich stron porównaj z ruchem i z wynikami konkurencji.

## Kod

```js title="Liczba słów treści głównej (konsola lub Playwright)"
// Count words in the main content only, excluding navigation and boilerplate
const main = document.querySelector('main')?.cloneNode(true);
main?.querySelectorAll('nav, aside, footer, [data-boilerplate]').forEach((el) => el.remove());
const words = (main?.textContent ?? '').trim().split(/\s+/).filter(Boolean).length;
console.log(`${location.pathname}: ${words} words`, words < 200 ? 'REVIEW' : 'OK');
```

## Częste błędy

- Dopisywanie ogólników tylko po to, by przekroczyć próg słów.
- Indeksowanie tysięcy stron tagów i filtrów z samą listą ofert; lepiej je scalić albo oznaczyć `noindex`.
