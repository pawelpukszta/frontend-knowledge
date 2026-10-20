---
title: Kod synchroniczny vs asynchroniczny i callback hell
level: mid
tags:
  - synchroniczny
  - asynchroniczny
  - callback
  - callback hell
  - non-blocking
summary: Kod synchroniczny wykonuje się linia po linii i blokuje wątek do końca operacji. Asynchroniczny zleca operację (sieć, timer, plik) i dostaje wynik później, więc nie blokuje. Zagnieżdżone callbacki prowadzą do callback hell, który rozwiązują Promise i async/await.
sources:
  - title: "MDN: Introducing asynchronous JavaScript"
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing
  - title: "javascript.info: Introduction: callbacks"
    url: https://javascript.info/callbacks
  - title: "Node.js: JavaScript Asynchronous Programming and Callbacks"
    url: https://nodejs.org/en/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks
  - title: "MDN: Using promises"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
---

## Wyjaśnienie

JavaScript ma **jeden wątek wykonania**. Gdyby czekał synchronicznie na odpowiedź z serwera, strona "zamarzłaby": żadnych kliknięć ani renderowania.

- **Synchroniczny**: kolejne instrukcje czekają na zakończenie poprzednich. Przykłady: obliczenia, `JSON.parse`, pętle, `localStorage`.
- **Asynchroniczny**: operacja jest delegowana do przeglądarki lub systemu (Web APIs, libuv), a JS wykonuje dalszy kod. Wynik wraca przez callback, Promise lub zdarzenie, kiedy stos wywołań jest pusty (event loop).
- Uwaga: asynchroniczność w JS to **współbieżność**, nie równoległość. Twój kod JS dalej działa w jednym wątku; równolegle pracuje przeglądarka (sieć, timery). Prawdziwą równoległość dla JS dają Web Workers.

**Ewolucja stylów asynchronicznych:**

1. **Callbacki**: funkcja przekazana do wywołania po zakończeniu operacji (konwencja Node.js: `(err, result) => {}`).
2. **Promise** (ES2015): obiekt z przyszłym wynikiem, łańcuchowanie `.then()`, jeden `.catch()` na błędy.
3. **async/await** (ES2017): kod asynchroniczny zapisany jak synchroniczny, błędy przez `try/catch`.

**Callback hell ("piramida zagłady")**: głęboko zagnieżdżone callbacki, w których każda operacja zależy od poprzedniej. Problemy: słaba czytelność, obsługa błędów powtarzana na każdym poziomie, trudne równoległe wykonanie i anulowanie. Rozwiązania: Promise i async/await, wydzielanie nazwanych funkcji, modularyzacja, `util.promisify` w Node.js.

## Kod

```js
// Callback hell
getUser(id, (err, user) => {
  if (err) return handle(err);
  getBookings(user.id, (err, bookings) => {
    if (err) return handle(err);
    getOffer(bookings[0].offerId, (err, offer) => {
      if (err) return handle(err);
      render(user, offer);
    });
  });
});

// Same flow with async/await: flat, one error handler
async function showFirstBooking(id) {
  try {
    const user = await getUser(id);
    const bookings = await getBookings(user.id);
    const offer = await getOffer(bookings[0].offerId);
    render(user, offer);
  } catch (err) {
    handle(err);
  }
}

// Order of execution
console.log('A');
setTimeout(() => console.log('C'), 0); // async: runs later
console.log('B');                      // A, B, C
```

## Częste błędy

- Myślenie, że `setTimeout(fn, 0)` wykona się "natychmiast". Wykona się dopiero po bieżącym kodzie i mikrozadaniach.
- Mieszanie callbacków i Promise w jednym przepływie: błędy "uciekają" poza `catch`.
- Ciężkie obliczenia synchroniczne na wątku głównym: blokują UI niezależnie od tego, ile `async` dopiszesz.

## Pytania

### Jaka jest różnica między kodem synchronicznym a asynchronicznym? {#js-sync-async-q1}

Synchroniczny wykonuje się sekwencyjnie i blokuje wątek, dopóki operacja się nie skończy. Asynchroniczny zleca operację (np. request, timer) środowisku i kontynuuje wykonanie; wynik obsługuje później callback, Promise lub `await`, gdy event loop zwolni stos. W JS to współbieżność na jednym wątku, a nie równoległe wykonywanie Twojego kodu.

### Czym jest callback hell i jak go uniknąć? {#js-sync-async-q2}

To głębokie zagnieżdżenie callbacków przy sekwencji zależnych operacji asynchronicznych, co daje nieczytelny kod i powtarzaną obsługę błędów. Unika się go przez Promise (łańcuch `.then`) i async/await, wydzielanie nazwanych funkcji oraz `Promise.all` dla operacji niezależnych.

### Czy async/await sprawia, że kod działa równolegle? {#js-sync-async-q3}

Nie. `await` tylko wstrzymuje bieżącą funkcję do rozstrzygnięcia Promise, nie tworzy nowego wątku. Niezależne operacje trzeba wystartować razem (`Promise.all`), a obliczenia CPU przenieść do Web Workera.

## Quiz

### Czym jest callback hell? {#js-sync-async-z1}

- [ ] Błędem wywołania callbacku dwa razy
- [x] Głębokim zagnieżdżeniem callbacków przy sekwencji operacji asynchronicznych
- [ ] Wyciekiem pamięci w event loop
- [ ] Nieobsłużonym odrzuceniem Promise

Rozwiązanie: Promise i async/await.
