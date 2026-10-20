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

## Quiz

### Co zrobi `structuredClone` z polem będącym funkcją? {#js-copying-z1}

- [ ] Skopiuje referencję do funkcji
- [ ] Pominie pole bez błędu
- [x] Rzuci DataCloneError
- [ ] Zamieni funkcję na string

Funkcji nie da się sklonować algorytmem structured clone, więc wywołanie rzuca `DataCloneError`.
