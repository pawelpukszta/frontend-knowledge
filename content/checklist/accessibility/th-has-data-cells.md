---
title: Nagłówki tabeli mają przypisane komórki danych
priority: medium
---

Każdy `<th>` powinien opisywać jakieś komórki danych; puste kolumny nagłówków dezorientują.

## Dlaczego to ważne

- Nagłówek bez danych (np. kolumna "Akcje" pusta we wszystkich wierszach) czytnik ogłasza przy każdej nawigacji, choć nic pod nim nie ma.
- Często to sygnał, że tabela jest użyta do układu albo zawiera martwą kolumnę po starej funkcji.

## Jak sprawdzić

axe (`th-has-data-cells`).

## Kod

```html title="Źle"
<tr><th scope="col">Termin</th><th scope="col">Cena</th><th scope="col">Uwagi</th></tr>
<tr><td>12.07</td><td>3499 zł</td></tr>
```

```html title="Dobrze"
<tr><th scope="col">Termin</th><th scope="col">Cena</th></tr>
<tr><td>12.07</td><td>3499 zł</td></tr>
```
