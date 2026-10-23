---
title: Scope i domknięcia (closures)
level: mid
added: 2026-10-20
tags:
  - closure
  - scope
  - lexical scope
summary: Domknięcie to funkcja, która "pamięta" zmienne z miejsca, w którym została zdefiniowana, nawet gdy jest wywołana gdzie indziej.
sources:
  - title: "MDN: Closures"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
  - title: "javascript.info: Variable scope, closure"
    url: https://javascript.info/closure
  - title: "MDN Glossary: Scope"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Scope
  - title: "MDN: Strict mode"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
  - title: "GeeksforGeeks: JavaScript Interview Questions"
    url: https://www.geeksforgeeks.org/javascript/javascript-interview-questions/
---

## Wyjaśnienie

**Scope (zasięg)** określa, gdzie zmienna jest widoczna. JS ma zasięg **leksykalny**: decyduje miejsce zapisania kodu, a nie miejsce wywołania.

- `var`: zasięg funkcji.
- `let` / `const`: zasięg bloku `{ }`.

**Closure (domknięcie)**: funkcja wewnętrzna zachowuje dostęp do zmiennych funkcji zewnętrznej po jej zakończeniu. Każde wywołanie funkcji zewnętrznej tworzy nowe, niezależne domknięcie.

Zastosowania: prywatne zmienne, fabryki funkcji, `debounce`, memoizacja, event handlery, hooki w React (każdy render ma własne domknięcie z własnymi wartościami props i state).

## Analogia

Funkcja to podróżnik z plecakiem. Wychodząc z domu (funkcji zewnętrznej), pakuje do plecaka zmienne, których potrzebuje, i ma je przy sobie, gdziekolwiek pójdzie.

## Kod

```js
function createCounter() {
  let count = 0; // private, only reachable through the closure
  return {
    increment: () => ++count,
    get: () => count,
  };
}
const c = createCounter();
c.increment();
c.get(); // 1

// Classic interview trap: var vs let in loops
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3, 3, 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j)); // 0, 1, 2
```

## Częste błędy

- **Stale closure w React**: `setInterval` w `useEffect` z pustą tablicą zależności "widzi" wartość stanu z pierwszego renderu. Rozwiązanie: updater `setCount(c => c + 1)` lub poprawne zależności.
- Wycieki pamięci: domknięcie trzyma referencje do dużych obiektów, np. w nieusuniętych listenerach.

## Pytania

### Czym jest closure? Podaj praktyczny przykład. {#js-scope-closures-q1}

To funkcja razem z dostępem do zmiennych z zasięgu, w którym powstała. Przykład: `debounce` przechowuje `timeoutId` w domknięciu; fabryka `createCounter` ukrywa prywatny licznik.

### Dlaczego pętla z var i setTimeout wypisuje 3, 3, 3? {#js-scope-closures-q2}

`var` ma zasięg funkcji, więc wszystkie callbacki współdzielą jedną zmienną `i`, która po pętli ma wartość 3. `let` tworzy nowe wiązanie dla każdej iteracji.

### Co to jest stale closure w React? {#js-scope-closures-q3}

Callback (np. w `useEffect` lub `setInterval`) zamknął wartości z wcześniejszego renderu i nie widzi nowych. Naprawiasz to przez poprawne zależności, funkcję aktualizującą `setState(prev => ...)` lub `useRef`.

### Jakie rodzaje zasięgu ma JavaScript i co znaczy, że zasięg jest leksykalny? {#js-scope-closures-q4}

Są cztery: globalny (kod zwykłego skryptu), modułu (każdy plik ES module ma własny), funkcji i bloku (`{ }` dla `let`, `const` i `class`; `var` ignoruje bloki). Zasięgi są zagnieżdżone: kod widzi zmienne swojego zasięgu i wszystkich zewnętrznych, ale nie odwrotnie.

Leksykalny znaczy, że widoczność zmiennych wynika z miejsca zapisania funkcji w kodzie, a nie z miejsca jej wywołania. Przeciwieństwem jest zasięg dynamiczny (np. zmienne `local` w Bashu), w którym funkcja widzi zmienne tego, kto ją wywołał. JavaScript go nie ma, ale podobnie "dynamicznie" działa `this`, co jest częstym źródłem pomyłek.

```js
const level = 'global';
function show() {
  console.log(level);
}
function run() {
  const level = 'local';
  show(); // 'global': show sees the scope where it was written
}
run();
```

### Czy domknięcia mogą powodować wycieki pamięci? {#js-scope-closures-q5}

Tak, pośrednio. Domknięcie trzyma referencje do zmiennych z zewnętrznego zasięgu. Dopóki sama funkcja jest osiągalna, garbage collector nie zwolni tych danych. Problem pojawia się, gdy funkcja żyje dłużej, niż powinna: listener, którego nikt nie usunął, `setInterval` bez `clearInterval`, wpis w globalnym cache albo subskrypcja bez wypisania się.

```js
function watchScroll() {
  const positions = []; // grows on every scroll event
  const onScroll = () => positions.push(window.scrollY);
  window.addEventListener('scroll', onScroll);
  // Without this cleanup, onScroll and positions stay in memory forever
  return () => window.removeEventListener('scroll', onScroll);
}
```

Rozwiązaniem jest sprzątanie: funkcja cleanup w `useEffect`, `clearInterval`, opcja `{ signal }` z `AbortController` w `addEventListener`. Wycieki znajdziesz w DevTools, w panelu Memory: porównaj heap snapshot przed akcją i po niej.

### Czym są zmienne globalne i dlaczego warto ich unikać? {#js-scope-closures-q6}

Zmienna globalna jest widoczna w całym programie. Powstaje przez deklarację na najwyższym poziomie zwykłego skryptu (`var` i deklaracje funkcji stają się wtedy właściwościami `window`, a `let` i `const` nie) albo przez przypisanie do niezadeklarowanej zmiennej poza strict mode. Problemy:

- kolizje nazw między skryptami i bibliotekami,
- każdy fragment kodu może zmienić wartość, więc trudno ustalić, kto ją zepsuł,
- testy zależą od stanu, który zostawił poprzedni test,
- dane żyją przez cały czas działania strony i nie są zwalniane.

W nowoczesnym kodzie problem w dużej mierze znika: zmienne na najwyższym poziomie modułu ES są widoczne tylko w tym pliku. Gdy naprawdę potrzebujesz obiektu globalnego, używaj jawnie `globalThis`.

### Czym jest strict mode i jak go włączyć? {#js-scope-closures-q7}

To bardziej rygorystyczny tryb języka, który zamienia ciche błędy na wyjątki. Włączasz go dyrektywą `'use strict';` na początku skryptu lub funkcji. Moduły ES i ciała klas są w strict mode automatycznie, więc w kodzie z `import` i `export` nie trzeba nic dopisywać. Najważniejsze zmiany:

- przypisanie do niezadeklarowanej zmiennej rzuca `ReferenceError` zamiast tworzyć zmienną globalną,
- `this` w funkcji wywołanej samodzielnie to `undefined`, a nie obiekt globalny,
- zapis do pola tylko do odczytu (np. w obiekcie po `Object.freeze`) rzuca `TypeError`,
- powtórzone nazwy parametrów, instrukcja `with` i stare literały ósemkowe (`015`) są błędem składni.

## Quiz

### Co wypisze `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))`? {#js-scope-closures-z1}

- [ ] 0, 1, 2
- [x] 3, 3, 3
- [ ] 2, 2, 2
- [ ] undefined x3

`var` ma zasięg funkcji, więc wszystkie callbacki widzą to samo `i`, które po pętli wynosi 3.
