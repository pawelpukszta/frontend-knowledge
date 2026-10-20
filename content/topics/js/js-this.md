---
title: this, arrow functions, call/apply/bind
level: mid
tags:
  - this
  - arrow function
  - bind
summary: "Wartość this zależy od sposobu wywołania funkcji. Arrow function nie ma własnego this: bierze je z otaczającego zasięgu."
sources:
  - title: "MDN: this"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
  - title: "MDN: Arrow function expressions"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  - title: "MDN: setTimeout()"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
  - title: "GeeksforGeeks: JavaScript Interview Questions"
    url: https://www.geeksforgeeks.org/javascript/javascript-interview-questions/
---

## Wyjaśnienie

Reguły dla zwykłej funkcji (od najwyższego priorytetu):

1. `new Fn()`: `this` to nowy obiekt.
2. `fn.call(obj)` / `fn.apply(obj)` / `fn.bind(obj)`: `this` to `obj`.
3. `obj.fn()`: `this` to `obj` (obiekt przed kropką).
4. Samo `fn()`: `undefined` w strict mode (moduły ES są zawsze strict), w przeciwnym razie obiekt globalny.

**Arrow function** nie ma własnego `this`, `arguments` ani nie może być konstruktorem. `this` jest brane leksykalnie z miejsca definicji. Dlatego arrow functions świetnie nadają się na callbacki, ale nie na metody obiektu, które potrzebują `this`.

- `call(thisArg, a, b)`: wywołuje z argumentami po przecinku.
- `apply(thisArg, [a, b])`: wywołuje z tablicą argumentów.
- `bind(thisArg)`: zwraca nową funkcję na stałe powiązaną z `thisArg`.

## Kod

```js
const user = {
  name: 'Ala',
  regular() { return this.name; },
  arrow: () => this?.name, // lexical this from module scope: undefined
};
user.regular();       // 'Ala'
const fn = user.regular;
fn();                 // TypeError/undefined - lost context

const bound = user.regular.bind(user);
bound();              // 'Ala'
```

## Pytania

### Od czego zależy wartość this? {#js-this-q1}

Od sposobu wywołania: `new`, jawne `call/apply/bind`, wywołanie jako metoda obiektu albo samodzielne wywołanie. Arrow function ignoruje te reguły i dziedziczy `this` z otaczającego zasięgu.

### Różnica między call, apply i bind? {#js-this-q2}

`call` i `apply` wywołują funkcję od razu z podanym `this` (argumenty jako lista lub tablica). `bind` nie wywołuje, tylko zwraca nową funkcję z trwale ustawionym `this`.

### Co wypisze ten kod? {#js-this-q3}

```js
var myObject = {
  foo: 'bar',
  func: function () {
    var self = this;
    console.log('outer func: this.foo = ' + this.foo);
    console.log('outer func: self.foo = ' + self.foo);
    (function () {
      console.log('inner func: this.foo = ' + this.foo);
      console.log('inner func: self.foo = ' + self.foo);
    })();
  },
};
myObject.func();
```
`outer func: this.foo = bar`, `outer func: self.foo = bar`, `inner func: this.foo = undefined`, `inner func: self.foo = bar`. W metodzie `this` to `myObject`. Wewnętrzna IIFE jest wywołana samodzielnie, więc jej `this` to obiekt globalny (tryb nieścisły, `foo` nie istnieje, stąd `undefined`) albo `undefined` w strict mode (wtedy odczyt `this.foo` rzuci `TypeError`). `self` działa dzięki domknięciu. Nowoczesne rozwiązanie: arrow function zamiast IIFE, która przejmuje `this` z metody.

### Jaka jest wartość this w callbacku setTimeout i w handlerze zdarzenia DOM? {#js-this-q4}

Zwykła funkcja przekazana do `setTimeout` jest wywoływana samodzielnie, więc traci obiekt, z którego pochodziła. W przeglądarce jej `this` to `globalThis` (czyli `window`). W handlerze dodanym przez `addEventListener` zwykła funkcja dostaje jako `this` element, na którym wisi listener (to samo co `event.currentTarget`). Arrow function w obu przypadkach bierze `this` z otoczenia.

```js
const timer = {
  label: 'Oferta',
  startRegular() {
    setTimeout(function () { console.log(this === globalThis); }, 0); // true
  },
  startArrow() {
    setTimeout(() => console.log(this.label), 0); // 'Oferta'
  },
};

button.addEventListener('click', function () {
  console.log(this === button); // true: this is the element
});
button.addEventListener('click', (event) => {
  console.log(event.currentTarget === button); // true: clearer than this
});
```

W React handlery nie dostają elementu jako `this`, więc element zawsze bierz z `event.currentTarget`.
