---
title: Dostępna walidacja formularzy
priority: high
sources:
  - title: "W3C Understanding 3.3.1: Error Identification"
    url: https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html
---

Komunikaty błędów przy polach, powiązane przez `aria-describedby`, z `aria-invalid="true"`, opisujące, jak naprawić błąd. Nie tylko kolor. Podsumowanie błędów przy długich formularzach.

## Dlaczego to ważne

- Błąd oznaczony tylko czerwoną ramką nie dociera do czytnika ekranu ani do osób z zaburzeniami widzenia barw; WCAG 1.4.1 i 3.3.1 (A).
- Podpowiedź, jak naprawić błąd ("Podaj datę w formacie DD.MM.RRRR"), to WCAG 3.3.3 (AA) i mniej frustracji niż ogólne "Błędne dane".
- Podsumowanie błędów z linkami do pól oszczędza szukania przy długim formularzu, np. danych kilku podróżnych.
- Waliduj po opuszczeniu pola lub przy wysyłce, nie przy każdym znaku; komunikaty w trakcie pisania irytują i zagadują czytnik.

## Jak sprawdzić

Wyślij pusty i błędny formularz z czytnikiem ekranu: focus trafia do podsumowania lub pierwszego błędnego pola, a każdy błąd jest odczytywany razem z polem.

## Kod

```html
<form id="booking" novalidate>
  <div id="error-summary" tabindex="-1" hidden>
    <h2>Popraw błędy w formularzu</h2>
    <ul></ul>
  </div>
  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" autocomplete="email" required
         aria-describedby="email-error" data-error="Podaj e-mail w formacie jan@example.pl">
  <p id="email-error" class="field-error"></p>
  <button type="submit">Rezerwuj</button>
</form>
```

```js
const form = document.querySelector('#booking');
const summary = document.querySelector('#error-summary');

form.addEventListener('submit', (e) => {
  const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
  if (!invalid.length) return;
  e.preventDefault();
  summary.querySelector('ul').replaceChildren(...invalid.map((el) => {
    el.setAttribute('aria-invalid', 'true');
    document.getElementById(`${el.id}-error`).textContent = el.dataset.error;
    const li = document.createElement('li');
    li.innerHTML = `<a href="#${el.id}"></a>`;
    li.firstChild.textContent = el.dataset.error;
    return li;
  }));
  summary.hidden = false;
  summary.focus(); // screen reader reads the summary heading and the list
});
```

## Częste błędy

- Wyłączenie przycisku "Wyślij" do czasu poprawnego wypełnienia: użytkownik nie wie, co jest nie tak.
