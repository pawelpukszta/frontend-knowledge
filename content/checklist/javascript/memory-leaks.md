---
title: Brak wycieków pamięci
priority: high
---

Usuwaj listenery, czyść timery i subskrypcje (cleanup w `useEffect`, `AbortController`), nie trzymaj referencji do usuniętych elementów DOM.

## Dlaczego to ważne

- W SPA strona nie jest przeładowywana; każde wejście w szczegóły oferty bez sprzątania dokłada listenery i timery, aż karta przeglądarki zwalnia lub się zawiesza.
- Zapomniany `setInterval` z odpytywaniem cen nadal wysyła zapytania po opuszczeniu widoku, obciążając API i baterię.
- Odpowiedź `fetch` przychodząca po odmontowaniu komponentu może nadpisać stan nowego widoku starymi danymi.

## Jak sprawdzić

DevTools Memory: porównanie heap snapshotów po wielokrotnym wejściu i wyjściu z widoku (szukaj "Detached" elementów DOM); Performance monitor pokazuje liczbę listenerów i węzłów DOM.

## Kod

```tsx
useEffect(() => {
  const controller = new AbortController();
  const { signal } = controller;

  window.addEventListener("resize", onResize, { signal }); // removed on abort
  fetch(`/api/prices/${offerId}`, { signal })
    .then((r) => r.json())
    .then(setPrices)
    .catch((e) => { if (e.name !== "AbortError") reportError(e); });
  const timer = setInterval(refreshAvailability, 30_000);

  return () => {
    controller.abort();
    clearInterval(timer);
  };
}, [offerId]);
```

## Częste błędy

- Globalne cache (`Map`) trzymające elementy DOM lub duże obiekty bez limitu; rozważ `WeakMap`.
