---
title: "Event loop: call stack, microtasks, macrotasks"
level: mid
tags:
  - event loop
  - microtask
  - macrotask
  - call stack
  - requestAnimationFrame
summary: "JavaScript działa w jednym wątku. Event loop pobiera zadania z kolejek, gdy stos wywołań jest pusty: najpierw wszystkie mikrozadania, potem jedno makrozadanie i ewentualnie renderowanie."
flow:
  - Call stack pusty
  - Wszystkie microtasks
  - Render (rAF, style, layout, paint)
  - Jeden macrotask
  - Wszystkie microtasks
sources:
  - title: "MDN: JavaScript execution model"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model
  - title: "MDN: Using microtasks"
    url: https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
  - title: "Jake Archibald: In The Loop (JSConf.Asia, video)"
    url: https://www.youtube.com/watch?v=cCOL7MC4Pl0
  - title: "Philip Roberts: What the heck is the event loop anyway? (video)"
    url: https://www.youtube.com/watch?v=8aGhZQkoFbQ
  - title: "javascript.info: Event loop"
    url: https://javascript.info/event-loop
---

## Wyjaśnienie

- **Call stack**: aktualnie wykonywane funkcje. Dopóki nie jest pusty, nic innego się nie wykona (także renderowanie).
- **Web APIs**: timery, sieć, zdarzenia działają poza silnikiem JS i po zakończeniu kolejkują callbacki.
- **Task queue (macrotasks)**: `setTimeout`, `setInterval`, zdarzenia użytkownika, `MessageChannel`, I/O.
- **Microtask queue**: `Promise.then/catch/finally`, `await` (kontynuacja), `queueMicrotask`, `MutationObserver`.
- **Rendering**: `requestAnimationFrame` → style → layout → paint, zwykle co ok. 16,7 ms (60 Hz), gdy jest co odświeżyć.

Jedna iteracja pętli:

1. Wykonaj **jedno** makrozadanie.
2. Wykonaj **wszystkie** mikrozadania (także te dodane w trakcie).
3. Jeśli pora, wyrenderuj klatkę (rAF, style, layout, paint).
4. Powtórz.

Konsekwencje: długie zadanie (> 50 ms, "long task") blokuje interakcje i render, pogarszając **INP**. Dziel pracę (`scheduler.yield()`, `setTimeout`), przenoś ją do Web Workera. Nieskończona pętla mikrozadań zamrozi stronę.

## Kod

```js
console.log('1 sync');
setTimeout(() => console.log('4 macrotask'), 0);
Promise.resolve().then(() => console.log('3 microtask'));
queueMicrotask(() => console.log('3b microtask'));
console.log('2 sync');
// Output: 1 sync, 2 sync, 3 microtask, 3b microtask, 4 macrotask

async function run() {
  console.log('A');
  await null;          // the rest of the function becomes a microtask
  console.log('C');
}
run();
console.log('B');      // A, B, C
```

## Pytania

### Wyjaśnij event loop. {#dom-event-loop-q1}

JS ma jeden wątek i stos wywołań. Operacje asynchroniczne wykonują się w Web APIs i po zakończeniu kolejkują callbacki. Gdy stos jest pusty, event loop wykonuje wszystkie mikrozadania (Promise), następnie przeglądarka może wyrenderować klatkę, a potem pobierane jest kolejne makrozadanie (np. setTimeout, zdarzenie).

### Co wykona się pierwsze: setTimeout(fn, 0) czy Promise.resolve().then(fn)? {#dom-event-loop-q2}

Callback Promise. To mikrozadanie, a kolejka mikrozadań jest opróżniana w całości przed kolejnym makrozadaniem, takim jak `setTimeout`.

### Czym jest long task i dlaczego jest szkodliwy? {#dom-event-loop-q3}

Zadanie na wątku głównym trwające dłużej niż 50 ms. Przez ten czas przeglądarka nie obsłuży kliknięć ani nie wyrenderuje klatki, co pogarsza INP i płynność. Rozwiązania: dzielenie pracy (`scheduler.yield`), Web Workers, mniej JS.

## Quiz

### Kolejność logów: `setTimeout(()=>log('A')); Promise.resolve().then(()=>log('B')); log('C')` {#dom-event-loop-z1}

- [ ] A, B, C
- [x] C, B, A
- [ ] C, A, B
- [ ] B, C, A

Najpierw kod synchroniczny, potem mikrozadania (Promise), na końcu makrozadanie (setTimeout).
