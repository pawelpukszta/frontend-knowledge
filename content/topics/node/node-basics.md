---
title: "Node.js: czym jest i jak działa"
level: mid
added: 2026-10-20
tags:
  - Node.js
  - V8
  - libuv
  - non-blocking I/O
  - event loop
summary: Node.js to środowisko uruchomieniowe JavaScriptu poza przeglądarką, zbudowane na V8 i libuv. Obsługuje wiele połączeń jednym wątkiem dzięki nieblokującemu I/O.
sources:
  - title: "Node.js: Introduction to Node.js"
    url: https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
  - title: "Node.js: The Node.js Event Loop"
    url: https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
  - title: "Node.js: Don't Block the Event Loop"
    url: https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop
---

## Wyjaśnienie

- **V8**: silnik JS z Chrome, kompiluje JS do kodu maszynowego.
- **libuv**: biblioteka C obsługująca event loop i asynchroniczne I/O (sieć, pliki, timery) oraz pulę wątków dla operacji, które nie mają nieblokującego API systemu.
- **Jeden wątek JS**: kod aplikacji wykonuje się w jednym wątku. Operacje I/O nie blokują go; wynik wraca jako callback lub Promise.
- Świetny do **I/O-bound** (API, proxy, BFF, SSR, real-time). Słabszy do **CPU-bound** (obliczenia blokują wszystkie requesty) - wtedy `worker_threads` lub osobny serwis.
- Brak DOM i `window`; są za to moduły `fs`, `http`, `path`, `crypto`, `stream`, globalny `fetch`, `process`.
- Fazy event loop w Node: timers → pending callbacks → poll (I/O) → check (`setImmediate`) → close callbacks; `process.nextTick` i Promise wykonują się między fazami.
- Wersje **LTS** (parzyste) używa się na produkcji.

W pracy front-endowca Node to: narzędzia (Vite, ESLint, testy), SSR (Next.js), BFF, skrypty.

## Pytania

### Jak Node.js obsługuje wiele requestów jednym wątkiem? {#node-basics-q1}

Operacje I/O są delegowane do systemu operacyjnego lub puli wątków libuv i nie blokują wątku JS. Gdy się zakończą, callback trafia do kolejki event loop. Wątek JS zajmuje się tylko krótką logiką, więc przez jeden proces może przechodzić tysiące współbieżnych połączeń.

### Kiedy Node.js nie jest dobrym wyborem? {#node-basics-q2}

Przy zadaniach CPU-bound (przetwarzanie obrazów, złożone obliczenia) wykonywanych w wątku głównym: blokują obsługę wszystkich requestów. Rozwiązania: `worker_threads`, kolejki zadań i osobne serwisy.

## Quiz

### Do jakich zadań Node.js pasuje najlepiej? {#node-basics-z1}

- [x] I/O-bound: API, proxy, BFF, SSR
- [ ] Długie obliczenia CPU w wątku głównym
- [ ] Renderowanie grafiki 3D
- [ ] Wyłącznie skrypty jednorazowe

Nieblokujące I/O pozwala obsłużyć wiele połączeń jednym wątkiem.
