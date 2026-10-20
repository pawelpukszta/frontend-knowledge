---
title: Właściwe typy pól
priority: high
sources:
  - title: "MDN: The input element"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input
---

`type="email"`, `tel`, `number`, `date`, `search` oraz `inputmode` i `autocomplete` wyświetlają odpowiednią klawiaturę mobilną i umożliwiają autouzupełnianie.

## Dlaczego to ważne

- Właściwa klawiatura przyspiesza wypełnianie na telefonie: `email` pokazuje "@", `tel` klawiaturę numeryczną, `inputmode="numeric"` same cyfry.
- `autocomplete` (np. `given-name`, `email`, `tel`, `postal-code`, `cc-number`) pozwala wypełnić formularz jednym dotknięciem i jest wymagane przez WCAG 1.3.5 (AA) dla danych o użytkowniku.
- `type="number"` nie nadaje się do kodu pocztowego, numeru karty ani telefonu: kod "00-950" nie jest liczbą, a pole dodaje strzałki i może zmieniać wartość przy przewijaniu.

## Jak sprawdzić

Wypełnij formularz na telefonie (iOS i Android) i sprawdź klawiatury oraz podpowiedzi autouzupełniania.

## Kod

```html
<label for="first-name">Imię</label>
<input id="first-name" name="firstName" autocomplete="given-name">

<label for="mail">E-mail</label>
<input id="mail" name="email" type="email" autocomplete="email">

<label for="phone">Telefon</label>
<input id="phone" name="phone" type="tel" autocomplete="tel">

<label for="zip">Kod pocztowy</label>
<input id="zip" name="zip" autocomplete="postal-code" pattern="\d{2}-\d{3}">

<label for="card">Numer karty</label>
<input id="card" name="card" inputmode="numeric" autocomplete="cc-number">

<label for="adults">Liczba dorosłych</label>
<input id="adults" name="adults" type="number" min="1" max="9" value="2">
```

## Częste błędy

- `autocomplete="off"` na polach danych osobowych "dla bezpieczeństwa": utrudnia życie i łamie WCAG 1.3.5.
