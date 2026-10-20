---
title: "Kopiowanie obiektów: shallow vs deep"
level: mid
tags:
  - spread
  - structuredClone
  - kopiowanie
  - immutability
summary: Spread i Object.assign robią płytką kopię (tylko pierwszy poziom). Do głębokiej kopii używaj structuredClone().
sources:
  - title: "MDN: structuredClone()"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
  - title: "MDN: Spread syntax"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  - title: "javascript.info: Object references and copying"
    url: https://javascript.info/object-copy
  - title: "MDN: JSON.stringify()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  - title: "GeeksforGeeks: JavaScript Interview Questions"
    url: https://www.geeksforgeeks.org/javascript/javascript-interview-questions/
---

## Wyjaśnienie

- **Płytka kopia (shallow copy)**: `{ ...obj }`, `[...arr]`, `Object.assign({}, obj)`, `arr.slice()`. Kopiuje tylko pierwszy poziom; zagnieżdżone obiekty nadal są współdzielone.
- **Głęboka kopia (deep copy)**: `structuredClone(obj)` (natywne, w przeglądarkach i Node 17+). Obsługuje `Date`, `Map`, `Set`, cykle. Nie kopiuje funkcji, klas (traci prototyp) ani elementów DOM.
- **`JSON.parse(JSON.stringify(obj))`**: stary trik. Gubi `undefined`, funkcje, `Date` zamienia na string, nie obsługuje `Map`, `Set` ani cykli.

W praktyce w React najczęściej robisz **płytką kopię tylko ścieżki, którą zmieniasz** (structural sharing). To tańsze niż głęboka kopia całego stanu i właśnie tak działa Immer w Redux Toolkit.

## Kod

```js
const state = { user: { name: 'Ala', tags: ['admin'] }, theme: 'dark' };

const shallow = { ...state };
shallow.user.name = 'Ola';
console.log(state.user.name); // 'Ola' - nested object is shared!

const deep = structuredClone(state);
deep.user.name = 'Ewa';
console.log(state.user.name); // 'Ola' - fully independent copy

// Immutable update of a nested path (structural sharing)
const next = { ...state, user: { ...state.user, name: 'Iga' } };
```

## Częste błędy

- Myślenie, że spread kopiuje głęboko.
- Używanie `JSON.parse(JSON.stringify())` na danych z datami lub `undefined`.
- Głębokie kopiowanie całego stanu przy każdej zmianie: niepotrzebny koszt i utrata referencji, które `memo` mógłby wykorzystać.

## Pytania

### Jak zrobić głęboką kopię obiektu w nowoczesnym JS? {#js-copying-q1}

`structuredClone(obj)`. Obsługuje zagnieżdżenia, `Date`, `Map`, `Set` i referencje cykliczne. Nie skopiuje funkcji ani instancji klas z prototypem. Alternatywą jest biblioteka (np. lodash `cloneDeep`).

### Co to jest structural sharing? {#js-copying-q2}

Przy niemutowalnej aktualizacji tworzysz nowe obiekty tylko na ścieżce zmiany, a niezmienione gałęzie współdzielisz. Dzięki temu porównanie referencji szybko mówi, co się zmieniło. Tak działają Redux, Immer i React state.

### Czym różni się płytka kopia od głębokiej? {#js-copying-q3}

Płytka kopia tworzy nowy obiekt tylko na pierwszym poziomie. Zagnieżdżone obiekty i tablice są w niej tymi samymi referencjami co w oryginale, więc ich zmiana jest widoczna w obu miejscach. Głęboka kopia kopiuje rekurencyjnie całą strukturę i daje w pełni niezależny obiekt.

```js
const trip = { city: 'Rzym', hotel: { stars: 4 } };

const shallow = { ...trip };
shallow.city = 'Ateny';  // trip.city stays 'Rzym'
shallow.hotel.stars = 5; // trip.hotel.stars is now 5 too

const deep = structuredClone(trip);
deep.hotel.stars = 3;    // trip is not affected
```

Płytka kopia wystarcza, gdy zmieniasz tylko pola pierwszego poziomu albo kopiujesz ścieżkę zmiany (jak w stanie React). Głębokiej używaj, gdy potrzebujesz niezależnej kopii do swobodnej edycji, np. szkicu formularza.

### Jak działa JSON.stringify i czego nie zapisze? {#js-copying-q4}

`JSON.stringify` zamienia wartość na tekst JSON, a `JSON.parse` odtwarza z niego dane, np. przy `fetch` albo `localStorage`. Nie wszystko przetrwa tę drogę. Pola z `undefined`, funkcjami i symbolami znikają (w tablicy zamieniają się na `null`). `NaN` i `Infinity` stają się `null`, a `Date` zamienia się w string ISO dzięki metodzie `toJSON`. `BigInt` i referencje cykliczne rzucają `TypeError`.

```js
const booking = {
  id: 7,
  note: undefined,        // dropped
  price: NaN,             // becomes null
  createdAt: new Date(0), // becomes an ISO string
  print() {},             // dropped
};
JSON.stringify(booking);
// '{"id":7,"price":null,"createdAt":"1970-01-01T00:00:00.000Z"}'

JSON.stringify(booking, ['id']);   // '{"id":7}': the array lists allowed keys
JSON.stringify({ a: 1 }, null, 2); // pretty print with a 2-space indent
JSON.stringify({ n: 10n });        // TypeError: BigInt cannot be serialized
```

Drugi argument (`replacer`) filtruje lub zmienia wartości, trzeci formatuje wynik. Przy odczycie `JSON.parse(text, reviver)` pozwala np. zamienić stringi z datami z powrotem na `Date`.

## Quiz

### Co zrobi `structuredClone` z polem będącym funkcją? {#js-copying-z1}

- [ ] Skopiuje referencję do funkcji
- [ ] Pominie pole bez błędu
- [x] Rzuci DataCloneError
- [ ] Zamieni funkcję na string

Funkcji nie da się sklonować algorytmem structured clone, więc wywołanie rzuca `DataCloneError`.
