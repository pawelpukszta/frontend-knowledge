---
title: Przyciski mają opisową nazwę
priority: critical
sources:
  - title: "W3C Understanding 4.1.2: Name, Role, Value"
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
---

Każdy `<button>` i element z `role="button"` ma nazwę z tekstu lub `aria-label`. Przycisk z samą ikoną bez nazwy jest dla czytnika "przyciskiem" bez celu.

## Dlaczego to ważne

- Ikony zamknięcia, serca czy kosza bez nazwy to najczęstszy błąd wykrywany przez audyty; czytnik ogłasza "przycisk" i użytkownik zgaduje.
- Nazwa musi mówić o akcji i obiekcie ("Usuń pokój 2"), gdy podobnych przycisków jest kilka na liście.
- To kryterium WCAG 4.1.2 Name, Role, Value (poziom A).

## Jak sprawdzić

axe (`button-name`), Computed name w DevTools (zakładka Accessibility).

## Kod

```html title="Źle"
<button class="icon-close"><svg><!-- x --></svg></button>
<div class="btn" onclick="removeRoom(2)"><svg><!-- trash --></svg></div>
```

```html title="Dobrze"
<button type="button" aria-label="Zamknij galerię zdjęć">
  <svg aria-hidden="true" focusable="false"><!-- x --></svg>
</button>
<button type="button" onclick="removeRoom(2)">
  <svg aria-hidden="true" focusable="false"><!-- trash --></svg>
  <span class="visually-hidden">Usuń pokój 2</span>
</button>
```

## Częste błędy

- `title` jako jedyne źródło nazwy; działa niespójnie i nie pojawia się na dotyku.
