---
title: Logiczna kolejność focusu
priority: high
sources:
  - title: "W3C Understanding 2.4.3: Focus Order"
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
  - title: "MDN: reading-flow"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/reading-flow
---

Kolejność Tab odpowiada wizualnemu układowi i kolejności czytania. Problemy powoduje `tabindex` > 0 oraz zmiana kolejności przez CSS (`order`, `flex-direction: row-reverse`, grid).

## Dlaczego to ważne

- Focus skaczący z nagłówka do stopki i z powrotem dezorientuje osoby widzące korzystające z klawiatury, które śledzą go wzrokiem.
- `tabindex="1"` wyciąga element przed wszystkie inne na stronie; w dużej aplikacji kolejność szybko staje się niemożliwa do utrzymania.
- Właściwość CSS `reading-flow` pozwala dopasować kolejność do układu flex/grid, ale według MDN ma ograniczone wsparcie, więc podstawą pozostaje poprawna kolejność w DOM.

## Jak sprawdzić

Przejdź Tabem i porównaj z kolejnością wizualną; w Chrome DevTools pomaga też widok Accessibility tree.

## Kod

```html title="Źle"
<input tabindex="3" placeholder="Dokąd?" />
<input tabindex="1" placeholder="Kiedy?" />
<style>.search-form { display: flex; flex-direction: row-reverse; }</style>
```

```html title="Dobrze"
<!-- DOM order matches visual order; no positive tabindex -->
<form class="search-form">
  <label for="dest">Dokąd?</label><input id="dest" />
  <label for="date">Kiedy?</label><input id="date" type="date" />
  <button>Szukaj</button>
</form>
```
