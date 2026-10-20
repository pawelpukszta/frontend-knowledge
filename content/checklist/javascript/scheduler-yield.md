---
title: scheduler.yield() przy długich zadaniach
priority: medium
---

Zadania dłuższe niż 50 ms blokują interakcje. Dziel pracę i oddawaj kontrolę przeglądarce przez `await scheduler.yield()` (z fallbackiem na `setTimeout`).

## Dlaczego to ważne

- Podczas długiego zadania przeglądarka nie obsłuży kliknięcia ani nie narysuje klatki, co bezpośrednio pogarsza INP (próg dobrego wyniku 200 ms).
- `scheduler.yield()` wznawia kod z wyższym priorytetem niż `setTimeout`, więc praca nie trafia na koniec kolejki za innymi zadaniami.
- API nie jest Baseline (brak m.in. w Safari), dlatego fallback na `setTimeout` jest konieczny.

## Jak sprawdzić

DevTools Performance: zadania oznaczone czerwonym trójkątem (Long task); po zmianie powinny być podzielone na krótsze kawałki.

## Kod

```js
function yieldToMain() {
  if (globalThis.scheduler?.yield) return globalThis.scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function renderOffers(offers) {
  let deadline = performance.now() + 50;
  for (const offer of offers) {
    renderOffer(offer);
    if (performance.now() > deadline) {
      await yieldToMain(); // let the browser handle input and paint
      deadline = performance.now() + 50;
    }
  }
}
```

## Częste błędy

- Oddawanie kontroli po każdym elemencie przy tysiącach elementów; narzut wydłuża całą pracę, lepiej co ok. 50 ms.
