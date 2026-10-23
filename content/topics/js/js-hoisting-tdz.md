---
title: Hoisting i Temporal Dead Zone
level: mid
added: 2026-10-20
tags:
  - hoisting
  - var
  - let
  - const
  - TDZ
summary: Deklaracje są "podnoszone" na początek zasięgu. var dostaje wartość undefined, a let/const są w Temporal Dead Zone aż do linii deklaracji.
sources:
  - title: "MDN: Hoisting"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
  - title: "MDN: let (Temporal Dead Zone)"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
---

## Wyjaśnienie

Zanim kod się wykona, silnik rejestruje deklaracje w danym zasięgu. To nazywamy **hoistingiem**.

- **`function` declaration**: podnoszona w całości, można ją wywołać przed deklaracją.
- **`var`**: deklaracja podniesiona, wartość `undefined` do momentu przypisania.
- **`let` / `const` / `class`**: też podniesione, ale do linii deklaracji są w **TDZ (Temporal Dead Zone)**. Dostęp rzuca `ReferenceError`.
- **Function expression / arrow function** przypisana do `const`: zachowuje się jak `const`.

## Kod

```js
sayHi();             // works - function declarations are hoisted
function sayHi() {}

console.log(a);      // undefined
var a = 1;

console.log(b);      // ReferenceError: Cannot access 'b' before initialization
let b = 2;
```

## Pytania

### Czym jest hoisting? {#js-hoisting-tdz-q1}

Rejestrowanie deklaracji na początku ich zasięgu przed wykonaniem kodu. Funkcje są dostępne od razu, `var` ma wartość `undefined`, a `let`/`const` są w TDZ do linii deklaracji.

### Co to jest Temporal Dead Zone? {#js-hoisting-tdz-q2}

Okres od początku bloku do linii deklaracji `let`/`const`/`class`, w którym zmienna istnieje, ale odwołanie do niej rzuca `ReferenceError`. Chroni przed używaniem niezainicjalizowanych zmiennych.

### Czym różnią się var, let i const? {#js-hoisting-tdz-q3}

`var` ma zasięg funkcji, jest podnoszony z wartością `undefined`, można go deklarować ponownie, a na najwyższym poziomie skryptu tworzy właściwość `window`. `let` i `const` mają zasięg bloku, są w TDZ do deklaracji i nie pozwalają na ponowną deklarację w tym samym zasięgu. `const` dodatkowo blokuje ponowne przypisanie (ale nie mutację obiektu). Domyślnie `const`, `let` gdy wartość się zmienia, `var` wcale.

### Co wypisze ten kod? {#js-hoisting-tdz-q4}

```js
function test() {
  console.log(a);     // ?
  console.log(foo()); // ?
  var a = 1;
  function foo() { return 2; }
}
test();
```
Wypisze `undefined`, a potem `2`. Deklaracja `var a` jest podniesiona na początek funkcji, ale przypisanie `= 1` zostaje na miejscu, więc w chwili logowania `a` ma wartość `undefined`. Deklaracja funkcji `foo` jest podniesiona w całości, więc można ją wywołać przed jej zapisem w kodzie.

## Quiz

### Dostęp do zmiennej `let` przed jej deklaracją powoduje: {#js-hoisting-tdz-z1}

- [ ] undefined
- [x] ReferenceError (TDZ)
- [ ] null
- [ ] Działa normalnie dzięki hoistingowi

`let` i `const` są w Temporal Dead Zone do linii deklaracji.

### Co wypisze `function t(){ console.log(a); var a = 1; } t()`? {#js-hoisting-tdz-z2}

- [x] undefined
- [ ] 1
- [ ] ReferenceError
- [ ] null

Deklaracja `var` jest podniesiona, przypisanie nie.
