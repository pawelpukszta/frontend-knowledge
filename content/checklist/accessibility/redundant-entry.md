---
title: Bez ponownego wpisywania tych samych danych
priority: high
sources:
  - title: "W3C Understanding 3.3.7: Redundant Entry"
    url: https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html
  - title: "MDN: HTML attribute: autocomplete"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
---

Dane podane wcześniej w tym samym procesie są uzupełniane automatycznie lub dostępne do wyboru (np. "adres dostawy taki sam jak rozliczeniowy"). WCAG 2.2 SC 3.3.7 (A).

## Dlaczego to ważne

- Każde dodatkowe pole to kolejna szansa na błąd i porzucenie koszyka; przepisywanie tych samych danych szczególnie męczy osoby z niepełnosprawnościami motorycznymi i poznawczymi.
- Poprawne wartości `autocomplete` pozwalają przeglądarce wypełnić dane jednym kliknięciem, także w kolejnych krokach.
- Wyjątki z WCAG: ponowne wpisanie jest dozwolone, gdy jest konieczne (np. gra pamięciowa), ze względów bezpieczeństwa lub gdy poprzednia wartość straciła ważność.

## Jak sprawdzić

Przejdź cały proces (np. rezerwacji) i wypisz pola, w które trzeba wpisać to samo drugi raz.

## Kod

```html title="Dobrze"
<fieldset>
  <legend>Dane osoby rezerwującej</legend>
  <label for="fn">Imię</label><input id="fn" autocomplete="given-name" />
  <label for="ln">Nazwisko</label><input id="ln" autocomplete="family-name" />
  <label for="tel">Telefon</label><input id="tel" type="tel" autocomplete="tel" />
</fieldset>
<fieldset>
  <legend>Uczestnik 1</legend>
  <label><input type="checkbox" id="same-as-booker" checked /> Uczestnik to osoba rezerwująca</label>
  <!-- Fields below are prefilled from the booker and hidden while the box is checked -->
</fieldset>
<fieldset>
  <legend>Adres do faktury</legend>
  <label for="street">Ulica i numer</label><input id="street" autocomplete="billing address-line1" />
  <label for="zip">Kod pocztowy</label><input id="zip" autocomplete="billing postal-code" />
</fieldset>
```

## Częste błędy

- Pytanie o e-mail na pierwszym kroku i ponownie przy płatności, bez podpowiedzi.
