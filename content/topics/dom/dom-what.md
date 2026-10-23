---
title: Czym jest DOM (Document Object Model)
level: mid
added: 2026-10-20
tags:
  - DOM
  - Document Object Model
  - drzewo
  - węzły
  - API
summary: DOM to obiektowa reprezentacja dokumentu HTML w postaci drzewa węzłów. Przeglądarka buduje ją z HTML, a JavaScript może ją czytać i zmieniać.
sources:
  - title: "javascript.info: DOM tree"
    url: https://javascript.info/dom-nodes
  - title: "MDN: Document Object Model (DOM)"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
---

## Wyjaśnienie

**DOM = Document Object Model**:

- **Document**: dotyczy dokumentu (strony HTML, także XML/SVG).
- **Object**: każdy fragment dokumentu to obiekt z właściwościami i metodami.
- **Model**: struktura drzewa opisująca relacje (rodzic, dzieci, rodzeństwo).

Drzewo składa się z **węzłów (nodes)**: `Document`, `Element` (`<div>`), `Text`, `Comment`, atrybuty. Korzeniem jest `document`, a jego elementem głównym `<html>`.

DOM to **API niezależne od języka** (standard WHATWG), a nie część JavaScriptu. JS korzysta z niego przez `document.querySelector`, `element.append`, `classList`, `addEventListener` itd.

DOM ≠ kod źródłowy HTML: przeglądarka poprawia błędy (dodaje brakujące `<tbody>`), a skrypty mogą go zmieniać. W DevTools zakładka **Elements** pokazuje aktualny DOM, a "View Source" oryginalny HTML.

## Kod

```js
const list = document.querySelector('#offers');
const item = document.createElement('li');
item.textContent = 'Rzym, 7 nocy';        // safe: no HTML parsing
item.classList.add('offer');
list.append(item);

// Batch many insertions to avoid repeated layout work
const fragment = document.createDocumentFragment();
offers.forEach((o) => fragment.append(Object.assign(document.createElement('li'), { textContent: o.city })));
list.append(fragment);
```

## Pytania

### Co to jest DOM? {#dom-what-q1}

Document Object Model: reprezentacja dokumentu HTML jako drzewa obiektów (węzłów), którą przeglądarka tworzy podczas parsowania. Udostępnia API, przez które JavaScript czyta i modyfikuje strukturę, treść i style strony.

### Czym różni się DOM od HTML? {#dom-what-q2}

HTML to tekst źródłowy. DOM to żywa struktura w pamięci zbudowana z tego tekstu, poprawiona przez parser i zmieniana przez skrypty. Po zmianach z JS DOM może się znacznie różnić od pierwotnego HTML.

### textContent vs innerHTML? {#dom-what-q3}

`textContent` wstawia czysty tekst (bezpieczne, szybkie). `innerHTML` parsuje HTML, co przy danych od użytkownika grozi XSS.

## Quiz

### Co oznacza skrót DOM? {#dom-what-z1}

- [x] Document Object Model
- [ ] Data Object Management
- [ ] Document Oriented Markup
- [ ] Dynamic Object Model

Obiektowy model dokumentu: drzewo węzłów budowane z HTML.
