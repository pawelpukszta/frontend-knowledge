---
title: Pola select mają dostępną nazwę
priority: medium
---

`<select>` potrzebuje etykiety tak jak każde inne pole; pierwsza opcja "Wybierz" nie jest etykietą.

## Dlaczego to ważne

- Po wybraniu wartości opcja "Wybierz lotnisko" znika i czytnik ogłasza tylko "Katowice, lista rozwijana"; nie wiadomo, czy to wylot, czy przylot.
- Formularze wyszukiwarki ofert mają często kilka selectów obok siebie (wylot, wyżywienie, gwiazdki); bez etykiet są nie do odróżnienia.

## Jak sprawdzić

axe (`select-name`); Computed name w DevTools.

## Kod

```html title="Źle"
<select name="from">
  <option value="">Wybierz lotnisko wylotu</option>
  <option>Katowice</option>
</select>
```

```html title="Dobrze"
<label for="from">Lotnisko wylotu</label>
<select id="from" name="from">
  <option value="">Dowolne</option>
  <option value="KTW">Katowice</option>
  <option value="WAW">Warszawa Chopina</option>
</select>
```
