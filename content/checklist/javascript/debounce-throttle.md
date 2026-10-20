---
title: Debounce i throttle dla częstych zdarzeń
priority: high
---

`input`, `scroll`, `resize`, `mousemove` mogą odpalać się dziesiątki razy na sekundę. Debounce dla wyszukiwania, throttle (lub `requestAnimationFrame`) dla przewijania.

## Dlaczego to ważne

- Wyszukiwarka destynacji bez debounce wysyła zapytanie po każdej literze: "Bar", "Barc", "Barce"..., co obciąża API i może pokazać wyniki dla starszego zapytania.
- Ciężki handler `scroll` uruchamiany przy każdym zdarzeniu blokuje główny wątek i pogarsza płynność oraz INP.
- Dla wielu przypadków istnieją lepsze narzędzia niż throttle: `IntersectionObserver` do lazy loadingu, `ResizeObserver` do zmian rozmiaru.

## Jak sprawdzić

Licznik wywołań handlera lub liczba zapytań w Network podczas szybkiego pisania; kolejność odpowiedzi przy symulacji wolnej sieci.

## Kod

```ts
function debounce<A extends unknown[]>(fn: (...args: A) => void, ms = 300) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

let controller: AbortController | undefined;
const search = debounce(async (query: string) => {
  controller?.abort(); // cancel the stale request
  controller = new AbortController();
  const res = await fetch(`/api/destinations?q=${encodeURIComponent(query)}`, { signal: controller.signal });
  renderSuggestions(await res.json());
}, 300);

input.addEventListener("input", (e) => search((e.target as HTMLInputElement).value));
```

## Częste błędy

- Debounce tworzony wewnątrz komponentu React przy każdym renderze (nowa funkcja, nowy timer); trzymaj go w `useMemo` lub `useRef`.
