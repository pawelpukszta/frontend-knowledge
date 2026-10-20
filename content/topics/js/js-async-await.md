---
title: async/await, błędy i anulowanie
level: mid
tags:
  - async
  - await
  - try catch
  - AbortController
summary: async/await to czytelniejsza składnia na Promise. Błędy łapiesz przez try/catch, a requesty anulujesz przez AbortController.
sources:
  - title: "MDN: async function"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
  - title: "MDN: AbortController"
    url: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
  - title: "javascript.info: Async/await"
    url: https://javascript.info/async-await
---

## Wyjaśnienie

- Funkcja `async` **zawsze zwraca Promise**.
- `await` wstrzymuje tylko tę funkcję (nie cały wątek) do rozstrzygnięcia Promise. Reszta programu działa dalej.
- Błąd z odrzuconego Promise jest rzucany w miejscu `await`, więc łapiesz go `try/catch`.
- **`AbortController`** pozwala przerwać `fetch` (np. przy odmontowaniu komponentu lub nowym wyszukiwaniu). `AbortSignal.timeout(ms)` tworzy sygnał z timeoutem.
- **Top-level await** działa w modułach ES.

## Kod

```ts
async function loadOffers(query: string, signal?: AbortSignal) {
  try {
    const res = await fetch(`/api/offers?q=${encodeURIComponent(query)}`, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return null; // cancelled
    throw err;
  }
}

// In React: cancel the previous request when the query changes
useEffect(() => {
  const controller = new AbortController();
  loadOffers(query, controller.signal).then(setOffers);
  return () => controller.abort();
}, [query]);
```

## Częste błędy

- Sekwencyjne `await` dla niezależnych zadań (waterfall). Startuj je razem i czekaj przez `Promise.all`.
- `forEach(async ...)` nie czeka na wyniki. Użyj `for...of` (sekwencyjnie) lub `Promise.all(arr.map(...))` (równolegle).
- Race condition w wyszukiwarce: starszy request wraca później i nadpisuje nowszy wynik. Rozwiązanie: `AbortController` lub TanStack Query.

## Pytania

### Co zwraca funkcja async? {#js-async-await-q1}

Zawsze Promise. `return x` daje Promise spełniony wartością `x`, a `throw` daje Promise odrzucony.

### Czy await blokuje wątek główny? {#js-async-await-q2}

Nie. Wstrzymuje tylko bieżącą funkcję async; jej dalsza część wraca jako mikrozadanie po rozstrzygnięciu Promise. Event loop w tym czasie obsługuje inne zadania.

### Jak anulować request fetch? {#js-async-await-q3}

Przekazać `signal` z `AbortController` i wywołać `controller.abort()`. Promise odrzuci się z `AbortError`. W React robi się to w funkcji cleanup `useEffect`.
