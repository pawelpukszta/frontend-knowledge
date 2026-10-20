---
title: Etykiety powiązane z polami formularza
priority: critical
---

Każde pole ma widoczny `<label for>` (lub jest w nim zagnieżdżone). Placeholder nie zastępuje etykiety. Kliknięcie etykiety ustawia focus w polu. Komunikaty błędów i podpowiedzi podłącz przez `aria-describedby`.

## Dlaczego to ważne

- Pole bez etykiety czytnik ogłosi jako "edycja, tekst"; użytkownik nie wie, czy wpisać imię, e-mail czy kod rabatowy.
- Placeholder znika po wpisaniu pierwszego znaku, ma zwykle za niski kontrast i obciąża pamięć, zwłaszcza osób z niepełnosprawnościami poznawczymi.
- Klikalna etykieta powiększa obszar trafienia checkboxów i radio, co pomaga na telefonie i osobom z drżeniem rąk.

## Jak sprawdzić

Kliknij etykietę, sprawdź Computed name w DevTools (zakładka Accessibility), axe (`label`); przy błędzie walidacji czytnik powinien przeczytać etykietę i treść błędu.

## Kod

```html title="Dobrze"
<form novalidate>
  <label for="email">E-mail do potwierdzenia rezerwacji</label>
  <p id="email-hint">Wyślemy na niego vouchery i bilety.</p>
  <input id="email" name="email" type="email" autocomplete="email" required
         aria-invalid="true" aria-describedby="email-hint email-error" />
  <p id="email-error" class="field-error">Podaj adres w formacie nazwa@domena.pl.</p>

  <label><input type="checkbox" name="newsletter" /> Chcę dostawać oferty last minute</label>
</form>
```

## Częste błędy

- Etykieta jako `<span>` lub `<div>` obok pola, bez `for`; wizualnie wygląda dobrze, programowo nie istnieje.
- `aria-invalid="true"` ustawione od początku, zanim użytkownik cokolwiek wpisał.
