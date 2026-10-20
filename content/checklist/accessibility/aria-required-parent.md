---
title: Role ARIA są w wymaganych rolach-rodzicach
priority: medium
---

Np. `tab` musi być w `tablist`, `option` w `listbox`, `listitem` w `list`, `menuitem` w `menu` lub `menubar`. Poza właściwym kontenerem rola traci sens.

## Dlaczego to ważne

- `role="tab"` poza `tablist` nie jest ogłaszany jako "karta 2 z 3", więc użytkownik nie wie, że jest w grupie zakładek i może używać strzałek.
- Błąd często wprowadza refaktoryzacja: komponent `Tab` wyniesiony poza `TabList` albo opakowany w element z własną rolą.
- axe przypisuje regułę do WCAG 1.3.1 (A).

## Jak sprawdzić

axe (`aria-required-parent`).

## Kod

```html title="Źle"
<div class="filters">
  <div role="option" aria-selected="true">All inclusive</div>
  <div role="option" aria-selected="false">Śniadania</div>
</div>
```

```html title="Dobrze"
<div role="listbox" aria-label="Wyżywienie" tabindex="0" aria-activedescendant="opt-ai">
  <div role="option" id="opt-ai" aria-selected="true">All inclusive</div>
  <div role="option" id="opt-bb" aria-selected="false">Śniadania</div>
</div>
```

## Częste błędy

- Natywny `<li>` w `<div>` zamiast w `<ul>` lub `<ol>`; axe zgłasza to osobną regułą `listitem`.
