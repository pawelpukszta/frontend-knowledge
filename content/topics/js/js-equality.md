---
title: == vs === vs Object.is
level: mid
tags:
  - porównania
  - koercja
summary: === porównuje bez konwersji typów, == najpierw konwertuje (koercja). Object.is to === z poprawkami dla NaN i -0.
sources:
  - title: "MDN: Equality comparisons and sameness"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness
---

## Wyjaśnienie

- **`===` (strict equality)**: bez konwersji typów. Używaj domyślnie.
- **`==` (loose equality)**: konwertuje typy przed porównaniem, co daje nieintuicyjne wyniki (`'' == 0` to `true`). Jedyny popularny, akceptowany wyjątek: `x == null` łapie jednocześnie `null` i `undefined`.
- **`Object.is(a, b)`**: jak `===`, ale `Object.is(NaN, NaN)` to `true`, a `Object.is(0, -0)` to `false`. Tego algorytmu używa React do porównywania stanu i zależności hooków.

## Kod

```js
0 == '0';          // true (coercion)
0 === '0';         // false
null == undefined; // true
NaN === NaN;       // false
Object.is(NaN, NaN); // true
Object.is(0, -0);    // false
```

## Pytania

### Jakiego porównania używa React w useState i tablicy zależności? {#js-equality-q1}

`Object.is`. Dla obiektów oznacza to porównanie referencji, dlatego nowy obiekt tworzony przy każdym renderze zawsze będzie "inny".

### Kiedy == jest akceptowalne? {#js-equality-q2}

Praktycznie tylko `value == null`, jako skrót na sprawdzenie `null` lub `undefined`. Dziś często zastępuje się to operatorem `??` lub jawnym porównaniem.
