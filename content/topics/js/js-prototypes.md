---
title: Prototypy i klasy
level: mid
tags:
  - prototype
  - class
  - dziedziczenie
summary: Dziedziczenie w JS opiera się na łańcuchu prototypów. Słowo class to wygodniejsza składnia na te same mechanizmy.
sources:
  - title: "MDN: Inheritance and the prototype chain"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
  - title: "MDN: Classes"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
---

## Wyjaśnienie

Każdy obiekt ma ukryte łącze `[[Prototype]]` do innego obiektu. Gdy właściwości nie ma na obiekcie, silnik szuka jej w prototypie, potem w prototypie prototypu, aż do `null`. To jest **prototype chain**.

`class` (ES6) to "cukier składniowy": metody klasy lądują na `ClassName.prototype`, a `extends` ustawia łańcuch prototypów. Nowsze elementy klas: pola prywatne `#field`, pola statyczne, bloki `static { }`.

W nowoczesnym React klasy spotkasz głównie w starszym kodzie (class components) i w Error Boundaries.

## Kod

```js
class Animal {
  #sound; // truly private field
  constructor(sound) { this.#sound = sound; }
  speak() { return this.#sound; }
}
class Dog extends Animal {
  constructor() { super('Hau'); }
}
const d = new Dog();
d.speak();                                         // 'Hau'
Object.getPrototypeOf(d) === Dog.prototype;        // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
```

## Pytania

### Czym jest łańcuch prototypów? {#js-prototypes-q1}

Mechanizm wyszukiwania właściwości: jeśli obiekt nie ma danej właściwości, JS szuka jej w jego prototypie i dalej w górę, aż do `Object.prototype` i `null`.

### Czy class w JS to "prawdziwe" klasy jak w Javie? {#js-prototypes-q2}

Nie. To składnia na prototypy. Pod spodem nadal działa dziedziczenie prototypowe, choć klasy dodają m.in. pola prywatne `#` i obowiązkowe `new`.

### Czy JavaScript wspiera dziedziczenie? Jeśli tak, to jak? {#js-prototypes-q3}

Tak, przez dziedziczenie prototypowe: obiekt deleguje wyszukiwanie brakujących właściwości do swojego prototypu (`Object.create(proto)`, `Object.setPrototypeOf`). Składnia `class ... extends` z ES2015 to wygodniejszy zapis tego samego mechanizmu, z `super()` do wywołania konstruktora i metod rodzica. W praktyce frontowej częściej wybiera się kompozycję niż głębokie hierarchie klas.
