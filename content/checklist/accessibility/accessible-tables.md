---
title: Semantyczne tabele danych
priority: medium
sources:
  - title: "W3C WAI: Tables Tutorial"
    url: https://www.w3.org/WAI/tutorials/tables/
---

Tabele danych mają `<caption>`, nagłówki `<th scope="col|row">` i nie są używane do układu strony.

## Dlaczego to ważne

- Przy przechodzeniu po komórkach czytnik ogłasza nagłówki kolumny i wiersza ("Lipiec, Kreta, 3499 zł"); bez `th` słychać same liczby.
- `<caption>` nazywa tabelę i pojawia się na liście tabel w czytniku, więc użytkownik wie, czy warto do niej wchodzić.
- Tabela użyta do układu strony każe czytnikowi ogłaszać "tabela, 3 kolumny" przy zwykłym tekście i psuje responsywność.

## Jak sprawdzić

Odczytaj tabelę czytnikiem ekranu (NVDA: Ctrl+Alt+strzałki); przy przechodzeniu po komórkach powinny być ogłaszane nagłówki.

## Kod

```html title="Dobrze"
<table>
  <caption>Ceny za osobę, 7 nocy, all inclusive</caption>
  <thead>
    <tr><th scope="col">Hotel</th><th scope="col">Lipiec</th><th scope="col">Sierpień</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Aldemar Knossos</th><td>4299 zł</td><td>4599 zł</td></tr>
    <tr><th scope="row">Stella Village</th><td>3499 zł</td><td>3799 zł</td></tr>
  </tbody>
</table>
```

## Częste błędy

- `display: block` lub `grid` na `<table>` w RWD bez sprawdzenia; część przeglądarek gubiła wtedy semantykę tabeli.
