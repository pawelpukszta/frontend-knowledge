---
title: "Stringi: metody, wycinanie i Unicode"
level: mid
tags:
  - string
  - slice
  - replaceAll
  - Unicode
  - Intl
summary: Stringi w JS są niemutowalne, więc każda metoda zwraca nowy string. Długość i indeksy liczą jednostki UTF-16, a nie znaki widziane przez użytkownika, co ma znaczenie przy emoji i sortowaniu polskich nazw.
sources:
  - title: "MDN: String"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
  - title: "MDN: String.prototype.substr()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
  - title: "MDN: String.prototype.replaceAll()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
  - title: "MDN: Intl.Segmenter"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
  - title: "MDN: String.prototype.localeCompare()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
  - title: "GeeksforGeeks: JavaScript Interview Questions"
    url: https://www.geeksforgeeks.org/javascript/javascript-interview-questions/
---

## Wyjaśnienie

- **Niemutowalność**: `toUpperCase`, `replace`, `slice` i inne metody zwracają nowy string, a oryginał zostaje bez zmian. Zapis `str[0] = 'X'` po cichu nic nie robi (w strict mode rzuca `TypeError`).
- **Wyszukiwanie**: `includes`, `startsWith` i `endsWith` zwracają `boolean`, a `indexOf` i `lastIndexOf` pozycję albo `-1`. Wszystkie rozróżniają wielkość liter.
- **Wycinanie**: `slice(start, end)` liczy ujemne indeksy od końca, `substring(start, end)` traktuje je jak `0`, a `substr(start, length)` jest przestarzały. `at(-1)` zwraca ostatni znak.
- **Zamiana i podział**: `replace` (pierwsze wystąpienie), `replaceAll` (wszystkie), `split(separator)`, `trim`, `padStart` i `padEnd` (np. `'7'.padStart(2, '0')` daje `'07'`).
- **Unicode**: `length` i indeksy liczą jednostki UTF-16. Emoji może zajmować kilka jednostek, więc `'👍'.length` to `2`. Znaki widziane przez użytkownika (grafemy) policzysz przez `Intl.Segmenter`.
- **Porównywanie**: `===` sprawdza identyczność, a `localeCompare` i `Intl.Collator` porównują zgodnie z regułami języka (np. polskie "ł" po "l").

## Kod

```js
const city = 'Kraków';
city.slice(-3);               // 'ków'
city.substring(-3);           // 'Kraków': a negative index becomes 0
city.at(-1);                  // 'w'
'2026-10-20'.split('-');      // ['2026', '10', '20']
'a-b-c'.replace('-', '/');    // 'a/b-c'
'a-b-c'.replaceAll('-', '/'); // 'a/b/c'

const text = 'Hej 👋🏽';
text.length; // 8: UTF-16 code units
const graphemes = new Intl.Segmenter('pl', { granularity: 'grapheme' });
[...graphemes.segment(text)].length; // 5: what the user sees
```

## Częste błędy

- Oczekiwanie, że `replace('a', 'b')` zamieni wszystkie wystąpienia. Zamienia tylko pierwsze; użyj `replaceAll`.
- Odwracanie lub ucinanie tekstu przez `split('')`: psuje emoji i znaki złożone.
- Sortowanie polskich nazw przez `sort()` bez komparatora: "Łódź" ląduje za "Zakopane".
- `substr` w nowym kodzie: jest przestarzały, zamień go na `slice`.

## Pytania

### Czym różnią się slice, substring i substr? {#js-strings-q1}

Wszystkie zwracają fragment stringu, ale inaczej traktują argumenty. `slice(start, end)` bierze znaki od `start` do `end` (bez niego), a ujemne wartości liczy od końca. `substring(start, end)` zamienia ujemne wartości na `0`, a gdy `start > end`, zamienia argumenty miejscami. `substr(start, length)` przyjmuje długość zamiast końca i jest przestarzały, zostawiony tylko dla zgodności ze starym kodem. Na co dzień wystarczy `slice`.

```js
const s = 'JavaScript';
s.slice(0, 4);     // 'Java'
s.slice(-6);       // 'Script'
s.substring(4, 0); // 'Java': arguments swapped
s.substring(-6);   // 'JavaScript': a negative index becomes 0
s.substr(4, 3);    // 'Scr': start and length (deprecated)
```

### Jak zamienić wszystkie wystąpienia fragmentu w stringu? {#js-strings-q2}

`replace` ze stringiem zamienia tylko pierwsze wystąpienie. Wszystkie zamienisz przez `replaceAll` albo przez `replace` z wyrażeniem regularnym z flagą `g`. `replaceAll` z wyrażeniem regularnym bez flagi `g` rzuca `TypeError`. Jeśli szukany tekst pochodzi od użytkownika, przekaż go jako string, bo w wyrażeniu regularnym znaki takie jak `.` czy `*` mają specjalne znaczenie. Gdy wyrażenie regularne jest jednak potrzebne, zabezpiecz tekst przez `RegExp.escape` (ES2025).

```js
const tags = 'react, vue, react';
tags.replace('react', 'solid');    // 'solid, vue, react'
tags.replaceAll('react', 'solid'); // 'solid, vue, solid'
tags.replace(/react/g, 'solid');   // the same result with a global regex
tags.replaceAll(/react/, 'solid'); // TypeError: the g flag is missing
```

### Jak odwrócić string i dlaczego split('').reverse() bywa błędne? {#js-strings-q3}

Klasyczna odpowiedź to `str.split('').reverse().join('')`. Działa dla zwykłych liter, ale `split('')` dzieli tekst na jednostki UTF-16, więc rozrywa emoji na połówki i oddziela akcenty zapisane jako osobny znak łączący. Spread `[...str]` dzieli na punkty kodowe i naprawia proste emoji, ale nadal psuje złożone (np. emoji z kolorem skóry). Dla tekstu od użytkowników dziel na grafemy przez `Intl.Segmenter`.

```js
'abc'.split('').reverse().join('');  // 'cba'
'ok👍'.split('').reverse().join(''); // broken: the emoji halves are swapped

const segmenter = new Intl.Segmenter('pl', { granularity: 'grapheme' });
const reverse = (str) =>
  [...segmenter.segment(str)].map((s) => s.segment).reverse().join('');
reverse('ok👍🏽'); // '👍🏽ko'
```

### Jak poprawnie porównywać i sortować stringi po polsku? {#js-strings-q4}

Operatory `<` i `>` oraz `sort()` bez komparatora porównują kody znaków, więc wielkie litery są przed małymi, a polskie litery lądują za "z". `localeCompare(other, 'pl')` porównuje zgodnie z regułami języka i zwraca liczbę ujemną, dodatnią lub `0` (nie zakładaj, że dokładnie `-1` lub `1`). Opcje pozwalają ignorować wielkość liter (`sensitivity: 'base'`) albo naturalnie sortować liczby w tekście (`numeric: true`). Przy sortowaniu dużych list utwórz raz `Intl.Collator` i użyj jego metody `compare`.

```js
['Zakopane', 'Łódź', 'Gdańsk'].sort();
// ['Gdańsk', 'Zakopane', 'Łódź']: code unit order

const collator = new Intl.Collator('pl', { numeric: true });
['Zakopane', 'Łódź', 'Gdańsk'].sort(collator.compare);
// ['Gdańsk', 'Łódź', 'Zakopane']
['pokój 10', 'pokój 2'].sort(collator.compare); // ['pokój 2', 'pokój 10']

'kraków'.localeCompare('KRAKÓW', 'pl', { sensitivity: 'base' }); // 0
```

## Quiz

### Wynik `'a-b-c'.replace('-', '+')` to: {#js-strings-z1}

- [ ] 'a+b+c'
- [x] 'a+b-c'
- [ ] 'a-b-c'
- [ ] TypeError

`replace` ze stringiem zamienia tylko pierwsze wystąpienie, a wszystkie zamienia `replaceAll`.

### Co zwróci `'👍'.length`? {#js-strings-z2}

- [ ] 1
- [x] 2
- [ ] 4
- [ ] undefined

`length` liczy jednostki UTF-16, a to emoji zajmuje dwie (parę surogatów).
