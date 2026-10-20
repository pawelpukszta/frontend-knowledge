---
title: Jedna etykieta na pole
priority: medium
---

Kilka `<label>` dla jednego pola jest odczytywanych niespójnie przez różne czytniki. Dodatkowe informacje podłącz przez `aria-describedby`.

## Dlaczego to ważne

- Jeden czytnik przeczyta tylko pierwszą etykietę, inny połączy obie, a sterowanie głosem może nie rozpoznać żadnej z nich.
- `aria-describedby` jest ogłaszany po nazwie i roli, więc podpowiedź nie zagłusza etykiety.

## Jak sprawdzić

axe (`form-field-multiple-labels`).

## Kod

```html title="Źle"
<label for="pax">Liczba osób</label>
<input id="pax" type="number" min="1" max="6" />
<label for="pax">Maksymalnie 6 osób w pokoju</label>
```

```html title="Dobrze"
<label for="pax">Liczba osób</label>
<input id="pax" type="number" min="1" max="6" aria-describedby="pax-hint" />
<p id="pax-hint">Maksymalnie 6 osób w pokoju.</p>
```
