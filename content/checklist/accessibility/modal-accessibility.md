---
title: Modal obsługiwany klawiaturą
priority: high
sources:
  - title: "W3C APG: Dialog (Modal) Pattern"
    url: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
  - title: "MDN: dialog element"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
---

Po otwarciu focus trafia do środka, Tab nie wychodzi poza modal, Escape zamyka, a po zamknięciu focus wraca na element, który go otworzył. Natywny `<dialog>` z `showModal()` realizuje większość z tego automatycznie: przenosi focus, czyni resztę strony `inert` i obsługuje Escape.

## Dlaczego to ważne

- Bez blokady tła Tab "ucieka" pod modal; użytkownik klawiatury klika w elementy, których nie widzi, a czytnik czyta treść strony zamiast okna.
- Brak powrotu focusu po zamknięciu wyrzuca użytkownika na początek dokumentu; na długiej liście ofert musi przejść kilkadziesiąt elementów, żeby wrócić do miejsca, w którym był.
- Własny modal na `div` wymaga ręcznie `role="dialog"`, `aria-modal`, pułapki focusu, blokady tła i obsługi Escape; każdy z tych elementów to częste źródło regresji.
- WCAG 2.1.2 No Keyboard Trap (A) wymaga, by dało się z modala wyjść klawiaturą, a 2.4.3 Focus Order (A) logicznej kolejności focusu.

## Jak sprawdzić

Otwórz i zamknij modal wyłącznie klawiaturą (Enter, Tab, Shift+Tab, Escape); z czytnikiem ekranu sprawdź, czy tło nie jest odczytywane.

## Kod

```html
<button type="button" id="open-date">Zmień termin</button>

<dialog id="date-dialog" aria-labelledby="date-title">
  <h2 id="date-title">Zmień termin wyjazdu</h2>
  <form method="dialog">
    <label>Nowa data <input type="date" name="date" autofocus></label>
    <button value="cancel">Anuluj</button>
    <button value="confirm">Zapisz</button>
  </form>
</dialog>
```

```js
const dialog = document.getElementById("date-dialog");
const opener = document.getElementById("open-date");

// showModal(): focus moves inside, the rest of the page becomes inert, Esc closes
opener.addEventListener("click", () => dialog.showModal());

// Return focus to the trigger after any close (Esc, form submit or close())
dialog.addEventListener("close", () => opener.focus());
```

## Częste błędy

- `dialog.show()` zamiast `showModal()`: okno jest niemodalne, tło pozostaje aktywne, a Escape go nie zamyka.
- Brak widocznego przycisku zamknięcia; nie każdy wie o Escape, a na telefonie bez klawiatury go nie ma.
