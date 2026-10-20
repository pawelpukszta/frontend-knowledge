---
title: Elementy poleceń ARIA mają nazwę
priority: medium
---

Elementy z rolą `button`, `link` lub `menuitem` muszą mieć dostępną nazwę z treści lub atrybutów ARIA.

## Dlaczego to ważne

- Własny `div role="button"` z ikoną dodaną przez CSS ma pustą treść, więc czytnik ogłosi "przycisk" i nic więcej.
- `menuitem` bez nazwy uniemożliwia wybór akcji z menu typu "Więcej" (Edytuj, Anuluj, Udostępnij).
- axe przypisuje regułę do WCAG 4.1.2 (A); bez nazwy nie zadziała też sterowanie głosem.

## Jak sprawdzić

axe (`aria-command-name`) lub Computed name w panelu Accessibility.

## Kod

```html title="Źle"
<div role="button" tabindex="0" class="icon-share"></div>
<ul role="menu">
  <li role="menuitem"><svg aria-hidden="true">...</svg></li>
</ul>
```

```html title="Dobrze"
<div role="button" tabindex="0" class="icon-share" aria-label="Udostępnij ofertę"></div>
<ul role="menu" aria-label="Akcje rezerwacji">
  <li role="menuitem"><svg aria-hidden="true">...</svg> Anuluj rezerwację</li>
</ul>
```

## Częste błędy

- Pozostawienie `div role="button"` tam, gdzie wystarczy `<button>`, który daje focus, Enter i Spację bez dodatkowego kodu.
