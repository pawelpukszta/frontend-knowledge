---
title: Poprawna struktura listy definicji
priority: medium
---

`<dl>` zawiera tylko grupy `<dt>` i `<dd>` (ewentualnie owinięte w `<div>`, plus `script`/`template`). Inne dzieci psują semantykę.

## Dlaczego to ważne

- Czytnik ogłasza listę i liczbę elementów; obcy element w środku sprawia, że pary termin-opis są źle liczone lub w ogóle nie rozpoznane.
- `<dl>` dobrze pasuje do par klucz-wartość w kartach ofert (termin, wyżywienie, wylot), więc warto go używać poprawnie.

## Jak sprawdzić

axe (`definition-list`) lub Nu Html Checker.

## Kod

```html title="Źle"
<dl>
  <h4>Szczegóły</h4>
  <dt>Wylot</dt><dd>Katowice, 12.07.2027</dd>
  <span>Wyżywienie: all inclusive</span>
</dl>
```

```html title="Dobrze"
<h4>Szczegóły</h4>
<dl class="offer-details">
  <div><dt>Wylot</dt><dd>Katowice, 12.07.2027</dd></div>
  <div><dt>Wyżywienie</dt><dd>All inclusive</dd></div>
  <div><dt>Długość pobytu</dt><dd>7 nocy</dd></div>
</dl>
```
