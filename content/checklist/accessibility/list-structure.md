---
title: Listy zawierają tylko elementy listy
priority: medium
---

Bezpośrednimi dziećmi `<ul>`/`<ol>` mogą być tylko `<li>` (oraz `script`/`template`). Inaczej czytnik źle liczy elementy.

## Dlaczego to ważne

- Czytnik ogłasza "lista, 5 elementów"; `div` lub nagłówek wewnątrz `ul` sprawia, że liczba i nawigacja po elementach są błędne.
- To niepoprawny HTML, który różne przeglądarki i czytniki naprawiają na różne sposoby, więc zachowanie jest nieprzewidywalne.

## Jak sprawdzić

axe (`list`) lub Nu Html Checker.

## Kod

```html title="Źle"
<ul class="amenities">
  <h4>Udogodnienia</h4>
  <div class="item">Basen</div>
  <li>Wi-Fi</li>
</ul>
```

```html title="Dobrze"
<h4>Udogodnienia</h4>
<ul class="amenities">
  <li>Basen</li>
  <li>Wi-Fi</li>
</ul>
```
