---
title: Debounce i throttle
level: mid
added: 2026-10-20
tags:
  - debounce
  - throttle
  - performance
  - events
summary: Debounce wykonuje funkcję dopiero po chwili ciszy. Throttle wykonuje ją najwyżej raz na określony czas.
sources:
  - title: "MDN Glossary: Debounce"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Debounce
  - title: "MDN Glossary: Throttle"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Throttle
---

## Wyjaśnienie

- **Debounce**: czeka, aż zdarzenia przestaną napływać przez X ms, i dopiero wtedy wywołuje funkcję. Typowo: wyszukiwarka z podpowiedziami, walidacja pola, zapis szkicu.
- **Throttle**: wywołuje funkcję maksymalnie raz na X ms, niezależnie od liczby zdarzeń. Typowo: `scroll`, `resize`, `mousemove`, śledzenie pozycji.

Oba opierają się na **domknięciu** (przechowują timer lub czas ostatniego wywołania). W React debounce wartości daje hook `useDeferredValue` (inny mechanizm: priorytet renderu, nie czas) lub własny `useDebounce`.

## Analogia

Debounce to winda: czeka, aż przez kilka sekund nikt nie wejdzie, i dopiero rusza. Throttle to autobus kursujący co 10 minut: odjeżdża regularnie, bez względu na to, ilu ludzi przyszło.

## Kod

```ts
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function throttle<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

const onSearch = debounce((q: string) => fetchSuggestions(q), 300);
```

## Częste błędy

- Tworzenie nowej funkcji debounce przy każdym renderze komponentu: timer się resetuje i debounce nie działa. Trzymaj ją w `useMemo`/`useRef` albo debounce'uj wartość, nie funkcję.

## Pytania

### Różnica między debounce a throttle? {#js-debounce-throttle-q1}

Debounce opóźnia wywołanie do momentu, aż zdarzenia ucichną (wykonuje się raz na końcu serii). Throttle ogranicza częstotliwość: wykonuje się regularnie, najwyżej raz na interwał.

### Napisz debounce. {#js-debounce-throttle-q2}

Funkcja zwracająca wrapper, który w domknięciu trzyma `timer`: przy każdym wywołaniu robi `clearTimeout(timer)` i ustawia nowy `setTimeout` z oryginalną funkcją.

## Quiz

### Wpisujesz tekst w wyszukiwarkę i chcesz wysłać request dopiero po 300 ms bez pisania. Czego użyjesz? {#js-debounce-throttle-z1}

- [x] Debounce
- [ ] Throttle
- [ ] requestAnimationFrame
- [ ] Promise.race

Debounce czeka na "ciszę" po serii zdarzeń.
