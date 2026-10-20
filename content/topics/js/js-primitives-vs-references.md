---
title: Typy proste vs referencyjne
level: mid
tags:
  - typy
  - referencje
  - pamięć
  - mutacja
summary: Typy proste (string, number, boolean...) są kopiowane przez wartość. Obiekty, tablice i funkcje są przekazywane przez referencję, czyli "adres" do tego samego miejsca w pamięci.
sources:
  - title: "MDN: JavaScript data types and data structures"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures
  - title: "javascript.info: Object references and copying"
    url: https://javascript.info/object-copy
  - title: "React: Updating Objects in State"
    url: https://react.dev/learn/updating-objects-in-state
  - title: "ECMAScript Language Specification: Data Types and Values"
    url: https://tc39.es/ecma262/#sec-ecmascript-data-types-and-values
---

## Wyjaśnienie

JavaScript ma **7 typów prostych (primitives)**: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`. Wszystko inne to **obiekt** (w tym tablice, funkcje, `Date`, `Map`).

- **Typ prosty**: zmienna trzyma samą wartość. Przypisanie `b = a` tworzy niezależną kopię. Prymitywy są niemutowalne: `str.toUpperCase()` zwraca nowy string.
- **Typ referencyjny**: zmienna trzyma referencję do obiektu. `b = a` kopiuje referencję, więc obie zmienne wskazują **ten sam** obiekt. Zmiana przez `b` jest widoczna przez `a`.
- **Porównanie**: `===` dla obiektów sprawdza, czy to ta sama referencja, a nie czy zawartość jest taka sama.

Dlaczego to ważne w React: React porównuje props i state przez `Object.is`. Jeśli zmutujesz obiekt w stanie, referencja się nie zmieni i React nie zauważy zmiany. Dlatego aktualizujemy stan niemutowalnie (tworzymy nowy obiekt).

## Analogia

Typ prosty to kartka z zapisaną liczbą: kopiujesz kartkę i masz dwie niezależne. Obiekt to adres domu zapisany na kartce: skopiowanie kartki nie buduje drugiego domu, tylko daje dwa adresy tego samego budynku.

## Kod

```js title="Kopia wartości vs kopia referencji"
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 - primitives are copied by value

const user = { name: 'Ala' };
const admin = user;          // copies the reference, not the object
admin.name = 'Ola';
console.log(user.name);      // 'Ola' - same object in memory

console.log({ x: 1 } === { x: 1 }); // false - two different references

// Functions receive a copy of the reference
function rename(obj) { obj.name = 'Ewa'; }   // mutates the caller's object
function replace(obj) { obj = { name: 'X' }; } // rebinds local variable only
```

## Częste błędy

- Mutowanie stanu w React (`state.items.push(x)`) zamiast tworzenia nowej tablicy (`[...state.items, x]`).
- Przekonanie, że `const` oznacza niemutowalność. `const` blokuje tylko ponowne przypisanie zmiennej; obiekt nadal można zmieniać.
- Porównywanie obiektów przez `===` w celu sprawdzenia równości zawartości.

## Pytania

### Czym różnią się typy proste od referencyjnych? {#js-primitives-vs-references-q1}

Typy proste są przechowywane i kopiowane jako wartość, są niemutowalne. Obiekty są przekazywane przez referencję: przypisanie lub przekazanie do funkcji kopiuje referencję, więc mutacja jest widoczna we wszystkich miejscach, które wskazują na ten obiekt.

### Czy JavaScript przekazuje argumenty przez referencję? {#js-primitives-vs-references-q2}

Formalnie zawsze **przez wartość**, ale dla obiektów tą wartością jest referencja ("call by sharing"). Dlatego możesz zmutować obiekt w funkcji, ale przypisanie nowego obiektu do parametru nie zmieni zmiennej na zewnątrz.

### Dlaczego mutowanie stanu w React jest błędem? {#js-primitives-vs-references-q3}

React wykrywa zmiany przez porównanie referencji (`Object.is`). Mutacja zostawia tę samą referencję, więc React może pominąć re-render, a `memo`, `useMemo` i `useEffect` nie wykryją zmiany.

### Jakie typy danych ma JavaScript? {#js-primitives-vs-references-q4}

Siedem typów prostych: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`, oraz typ `object`. Tablice, funkcje, `Date`, `Map` to obiekty (tablica nie jest osobnym typem). Pułapki `typeof`: `typeof null === 'object'` (historyczny błąd), `typeof []` to `'object'` (użyj `Array.isArray`), `typeof function(){}` to `'function'`.

## Quiz

### Co wypisze `const a = {x:1}; const b = a; b.x = 2; console.log(a.x)`? {#js-primitives-vs-references-z1}

- [ ] 1
- [x] 2
- [ ] undefined
- [ ] TypeError

`b = a` kopiuje referencję, więc obie zmienne wskazują ten sam obiekt.
