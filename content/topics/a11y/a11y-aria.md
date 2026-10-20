---
title: ARIA i pierwsza zasada ARIA
level: mid
tags:
  - ARIA
  - role
  - aria-label
  - aria-expanded
  - live regions
summary: "ARIA to atrybuty uzupełniające drzewo dostępności o role, nazwy i stany tam, gdzie HTML nie wystarcza. Pierwsza zasada: jeśli możesz użyć natywnego elementu HTML, nie używaj ARIA."
sources:
  - title: "MDN: ARIA"
    url: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
  - title: "W3C: Using ARIA (first rule of ARIA)"
    url: https://www.w3.org/TR/using-aria/#rule1
  - title: "W3C: WAI-ARIA Authoring Practices Guide"
    url: https://www.w3.org/WAI/ARIA/apg/
---

## Wyjaśnienie

ARIA **zmienia tylko to, co ogłasza czytnik ekranu**. Nie dodaje zachowania: `role="button"` nie sprawi, że `div` stanie się fokusowalny ani zareaguje na Enter.

Trzy grupy atrybutów:

- **Role**: `role="dialog"`, `tablist`, `tab`, `tabpanel`, `alert`, `status`.
- **Właściwości (properties)**: `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-controls`.
- **Stany (states)**: `aria-expanded`, `aria-pressed`, `aria-selected`, `aria-checked`, `aria-disabled`, `aria-invalid`, `aria-current="page"`.

Przydatne:

- **Live regions**: `aria-live="polite"` lub `role="status"` ogłasza dynamiczne zmiany (np. "Znaleziono 24 oferty"). `role="alert"` dla pilnych komunikatów.
- `aria-hidden="true"`: ukrywa dekoracje przed czytnikiem (np. ikony obok tekstu). Nigdy na elementach fokusowalnych.

"No ARIA is better than bad ARIA": błędne ARIA częściej szkodzi, niż pomaga. Złożone widgety (tabs, combobox, menu) buduj według wzorców **WAI-ARIA Authoring Practices** lub gotowych bibliotek (Radix UI, React Aria, Headless UI).

## Kod

```html
<!-- Disclosure button -->
<button aria-expanded="false" aria-controls="filters">Filtry</button>
<div id="filters" hidden>...</div>

<!-- Icon-only button needs an accessible name -->
<button aria-label="Dodaj do ulubionych">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Announce dynamic results -->
<p role="status">Znaleziono 24 oferty</p>
```

## Pytania

### Jaka jest pierwsza zasada ARIA? {#a11y-aria-q1}

Jeśli istnieje natywny element lub atrybut HTML z potrzebną semantyką i zachowaniem, użyj go zamiast dodawać role i atrybuty ARIA do innego elementu. Natywne elementy mają wbudowaną obsługę klawiatury, focusu i stanów.

### Czy role="button" wystarczy, żeby div był dostępnym przyciskiem? {#a11y-aria-q2}

Nie. ARIA zmienia tylko semantykę dla technologii asystujących. Trzeba dodać `tabindex="0"`, obsługę Enter i Spacji, style focusu, stan disabled. Prościej i pewniej użyć `<button>`.

### Do czego służy aria-live? {#a11y-aria-q3}

Oznacza region, którego zmiany czytnik ekranu ogłasza automatycznie, bez przenoszenia focusu. `polite` czeka na przerwę, `assertive` przerywa. Typowo: wyniki wyszukiwania, komunikaty formularza, powiadomienia.

## Quiz

### Jaka jest pierwsza zasada ARIA? {#a11y-aria-z1}

- [x] Jeśli istnieje natywny element HTML z potrzebną semantyką, użyj go zamiast ARIA
- [ ] Każdy element interaktywny musi mieć role
- [ ] aria-label zawsze nadpisuje treść
- [ ] ARIA dodaje obsługę klawiatury

Natywne elementy mają wbudowane zachowanie, ARIA zmienia tylko semantykę.
