---
title: Map, Set, WeakMap, WeakSet
level: mid
tags:
  - Map
  - Set
  - WeakMap
  - kolekcje
summary: Map to słownik z dowolnymi kluczami, Set to zbiór unikalnych wartości. Wersje Weak nie blokują garbage collectora.
sources:
  - title: "MDN: Map"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  - title: "MDN: Set"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
  - title: "MDN: WeakMap"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
---

## Wyjaśnienie

- **`Map`**: klucze dowolnego typu (także obiekty), zachowuje kolejność wstawiania, ma `size`, jest szybszy przy częstym dodawaniu i usuwaniu. Lepszy od zwykłego obiektu jako słownik.
- **`Set`**: unikalne wartości. Szybkie `has()`. Typowy trik: `[...new Set(arr)]` usuwa duplikaty. ES2025 dodał metody zbiorów: `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`.
- **`WeakMap` / `WeakSet`**: klucze muszą być obiektami i są trzymane "słabo": gdy obiekt nie ma innych referencji, GC może go usunąć razem z wpisem. Nie da się ich iterować. Zastosowanie: cache lub metadane przypięte do obiektów/elementów DOM bez wycieków pamięci.

## Kod

```js
const visits = new Map();
visits.set(userObj, 3);             // object as a key
visits.get(userObj);                // 3

const tags = new Set(['react', 'ts', 'react']);
tags.size;                          // 2

const a = new Set([1, 2, 3]);
a.intersection(new Set([2, 3, 4])); // Set {2, 3} (ES2025)

const cache = new WeakMap();        // entries disappear with their keys
function getMeta(el) {
  if (!cache.has(el)) cache.set(el, computeMeta(el));
  return cache.get(el);
}
```

## Pytania

### Kiedy Map zamiast zwykłego obiektu? {#js-collections-q1}

Gdy klucze nie są stringami, gdy często dodajesz/usuwasz wpisy, gdy potrzebujesz `size` i gwarantowanej kolejności, oraz gdy klucze pochodzą od użytkownika (brak ryzyka kolizji z `__proto__`).

### Do czego służy WeakMap? {#js-collections-q2}

Do przechowywania danych powiązanych z obiektem bez blokowania jego usunięcia z pamięci. Gdy obiekt przestaje być używany, wpis znika automatycznie.
