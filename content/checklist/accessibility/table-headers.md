---
title: Poprawne nagłówki tabel danych
priority: medium
---

Każda tabela danych ma komórki `<th>` określające kolumny lub wiersze, a złożone tabele używają `scope` lub `headers`.

## Dlaczego to ważne

- Bez `th` czytnik przy każdej komórce mówi tylko wartość; użytkownik musi pamiętać, co oznacza czwarta kolumna.
- Pogrubienie `<td><b>` wygląda jak nagłówek, ale nie tworzy żadnej relacji w drzewie dostępności.

## Jak sprawdzić

Odczyt czytnikiem ekranu, axe; w DevTools (Accessibility) nagłówki mają rolę `columnheader` lub `rowheader`.

## Kod

```html title="Źle"
<tr><td><b>Pokój</b></td><td><b>Cena</b></td></tr>
<tr><td>Standard</td><td>3499 zł</td></tr>
```

```html title="Dobrze"
<tr><th scope="col">Pokój</th><th scope="col">Cena za osobę</th></tr>
<tr><th scope="row">Standard</th><td>3499 zł</td></tr>
<tr><th scope="row">Z widokiem na morze</th><td>3899 zł</td></tr>
```
