---
title: Poprawne wartości atrybutu role
priority: medium
---

Wartość `role` musi być istniejącą, nieabstrakcyjną rolą WAI-ARIA. Nieznana rola (np. literówka `buton`) lub abstrakcyjna (`widget`, `input`, `landmark`) jest ignorowana.

## Dlaczego to ważne

- `div role="buton"` zostaje dla czytnika zwykłym kontenerem, mimo że wygląda i działa jak przycisk; użytkownik nie wie, że może go aktywować.
- Role abstrakcyjne służą tylko do budowy taksonomii w specyfikacji; autorzy nie mogą ich używać.
- axe przypisuje regułę do WCAG 4.1.2 (A).

## Jak sprawdzić

axe (`aria-roles`).

## Kod

```html title="Źle"
<div role="buton" tabindex="0">Rezerwuj</div>
<section role="landmark">...</section>
```

```html title="Dobrze"
<button type="button">Rezerwuj</button>
<!-- A section with an accessible name becomes a "region" landmark -->
<section aria-labelledby="deals-title">
  <h2 id="deals-title">Okazje tygodnia</h2>
</section>
```

## Częste błędy

- Dodawanie roli, którą element już ma (`<button role="button">`, `<nav role="navigation">`); to nie błąd, ale zbędny szum.
