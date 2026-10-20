---
title: Scope i domknięcia (closures)
level: mid
tags:
  - closure
  - scope
  - lexical scope
summary: Domknięcie to funkcja, która "pamięta" zmienne z miejsca, w którym została zdefiniowana, nawet gdy jest wywołana gdzie indziej.
sources:
  - title: "MDN: Closures"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
  - title: "javascript.info: Variable scope, closure"
    url: https://javascript.info/closure
---

## Wyjaśnienie

**Scope (zasięg)** określa, gdzie zmienna jest widoczna. JS ma zasięg **leksykalny**: decyduje miejsce zapisania kodu, a nie miejsce wywołania.

- `var`: zasięg funkcji.
- `let` / `const`: zasięg bloku `{ }`.

**Closure (domknięcie)**: funkcja wewnętrzna zachowuje dostęp do zmiennych funkcji zewnętrznej po jej zakończeniu. Każde wywołanie funkcji zewnętrznej tworzy nowe, niezależne domknięcie.

Zastosowania: prywatne zmienne, fabryki funkcji, `debounce`, memoizacja, event handlery, hooki w React (każdy render ma własne domknięcie z własnymi wartościami props i state).

## Analogia

Funkcja to podróżnik z plecakiem. Wychodząc z domu (funkcji zewnętrznej), pakuje do plecaka zmienne, których potrzebuje, i ma je przy sobie, gdziekolwiek pójdzie.

## Kod

```js
function createCounter() {
  let count = 0; // private, only reachable through the closure
  return {
    increment: () => ++count,
    get: () => count,
  };
}
const c = createCounter();
c.increment();
c.get(); // 1

// Classic interview trap: var vs let in loops
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3, 3, 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j)); // 0, 1, 2
```

## Częste błędy

- **Stale closure w React**: `setInterval` w `useEffect` z pustą tablicą zależności "widzi" wartość stanu z pierwszego renderu. Rozwiązanie: updater `setCount(c => c + 1)` lub poprawne zależności.
- Wycieki pamięci: domknięcie trzyma referencje do dużych obiektów, np. w nieusuniętych listenerach.

## Pytania

### Czym jest closure? Podaj praktyczny przykład. {#js-scope-closures-q1}

To funkcja razem z dostępem do zmiennych z zasięgu, w którym powstała. Przykład: `debounce` przechowuje `timeoutId` w domknięciu; fabryka `createCounter` ukrywa prywatny licznik.

### Dlaczego pętla z var i setTimeout wypisuje 3, 3, 3? {#js-scope-closures-q2}

`var` ma zasięg funkcji, więc wszystkie callbacki współdzielą jedną zmienną `i`, która po pętli ma wartość 3. `let` tworzy nowe wiązanie dla każdej iteracji.

### Co to jest stale closure w React? {#js-scope-closures-q3}

Callback (np. w `useEffect` lub `setInterval`) zamknął wartości z wcześniejszego renderu i nie widzi nowych. Naprawiasz to przez poprawne zależności, funkcję aktualizującą `setState(prev => ...)` lub `useRef`.

## Quiz

### Co wypisze `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))`? {#js-scope-closures-z1}

- [ ] 0, 1, 2
- [x] 3, 3, 3
- [ ] 2, 2, 2
- [ ] undefined x3

`var` ma zasięg funkcji, więc wszystkie callbacki widzą to samo `i`, które po pętli wynosi 3.
