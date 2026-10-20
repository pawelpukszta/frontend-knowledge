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
  - title: "MDN: Number.isNaN()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
  - title: "MDN Glossary: Falsy"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
  - title: "MDN: parseInt()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
  - title: "GeeksforGeeks: JavaScript Interview Questions"
    url: https://www.geeksforgeeks.org/javascript/javascript-interview-questions/
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

### Czym różni się == od === i czym jest koercja typów? {#js-equality-q3}

`===` porównuje typ i wartość bez żadnej konwersji. `==` najpierw sprowadza obie strony do wspólnego typu (to jest koercja), dlatego `'1' == 1` daje `true`. Koercja działa też poza porównaniami. Operator `+` z choćby jednym stringiem skleja tekst, a `-`, `*` i `/` zawsze zamieniają operandy na liczby. Działania wykonują się od lewej do prawej:

```js
3 + 2 + '7';  // '57': first 3 + 2 = 5, then '5' + '7'
'7' + 3 + 2;  // '732': a string from the start, so everything is concatenated
'7' - 2;      // 5: minus always converts to numbers
[] == false;  // true: both sides end up as 0
```

W praktyce używaj `===` i konwertuj jawnie (`Number(x)`, `String(x)`), żeby wynik nie zależał od reguł koercji.

### Jakie wartości są falsy? {#js-equality-q4}

Jest ich osiem: `false`, `0`, `-0`, `0n`, `''` (pusty string), `null`, `undefined` i `NaN`. Ciekawostka: `document.all` to jedyny obiekt traktowany jak falsy. Wszystko inne jest truthy, także `'0'`, `'false'`, `[]` i `{}`. Typowa pułapka w React: `{count && <Badge />}` przy `count === 0` wyrenderuje na stronie `0`. Bezpieczniej napisać `{count > 0 && <Badge />}`.

### Czym różni się isNaN od Number.isNaN? {#js-equality-q5}

Globalne `isNaN` najpierw zamienia argument na liczbę, a dopiero potem sprawdza, czy wyszło `NaN`. Dlatego `isNaN('abc')` i `isNaN(undefined)` dają `true`, choć to nie są wartości `NaN`. `Number.isNaN` niczego nie konwertuje i zwraca `true` tylko dla prawdziwego `NaN`. Porównanie `x === NaN` nie zadziała nigdy, bo `NaN` nie jest równe samemu sobie.

```js
isNaN('abc');        // true: 'abc' is coerced to NaN first
Number.isNaN('abc'); // false: a string is not NaN
Number.isNaN(NaN);   // true
NaN === NaN;         // false
Object.is(NaN, NaN); // true
```

### Jak zamienić string na liczbę i czym różni się Number od parseInt? {#js-equality-q6}

`Number(str)` (lub skrót `+str`) wymaga, żeby cały string był liczbą, inaczej zwraca `NaN`. `parseInt(str, 10)` czyta cyfry od początku i zatrzymuje się na pierwszym niepasującym znaku. Do ułamków służy `parseFloat`. Zawsze podawaj `parseInt` podstawę (`10`): bez niej string zaczynający się od `0x` zostanie odczytany jako liczba szesnastkowa.

```js
Number('15px');       // NaN: the whole string must be numeric
parseInt('15px', 10); // 15: parsing stops at 'p'
Number('');           // 0: an empty string becomes zero
parseInt('', 10);     // NaN
parseInt('1e3', 10);  // 1, while Number('1e3') is 1000
parseInt(0.0000005);  // 5: the number is first turned into '5e-7'
```

Do walidacji pola formularza lepszy jest `Number`, bo nie przepuści `'15px'`. Pusty string da jednak `0`, więc sprawdź go osobno.
