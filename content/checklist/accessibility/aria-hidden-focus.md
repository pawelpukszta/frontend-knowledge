---
title: Brak elementów fokusowalnych w kontenerach aria-hidden
priority: medium
sources:
  - title: "MDN: inert"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
---

Element ukryty przed czytnikiem, ale osiągalny Tabem, tworzy "pusty" focus: użytkownik ląduje na czymś, czego czytnik nie ogłasza. Użyj `inert` zamiast samego `aria-hidden`.

## Dlaczego to ważne

- Użytkownik czytnika słyszy ciszę lub "pusto", choć focus stoi na linku w zamkniętym menu; dezorientuje to bardziej niż brak elementu.
- Typowe źródła: zamknięte menu mobilne, slajdy karuzeli poza ekranem i tło modala ukryte tylko przez `aria-hidden`.
- `inert` (Baseline od 2023) jednocześnie usuwa poddrzewo z drzewa dostępności i z kolejności Tab oraz blokuje kliknięcia.

## Jak sprawdzić

axe (`aria-hidden-focus`) i przejście Tabem przez stronę przy zamkniętych menu i panelach.

## Kod

```html title="Źle"
<nav id="mobile-menu" class="is-closed" aria-hidden="true">
  <a href="/oferty">Oferty</a>
  <a href="/last-minute">Last minute</a>
</nav>
```

```html title="Dobrze"
<nav id="mobile-menu" class="is-closed" inert>
  <a href="/oferty">Oferty</a>
  <a href="/last-minute">Last minute</a>
</nav>
<!-- Or remove it entirely while closed: hidden or display: none -->
```

## Częste błędy

- `tabindex="-1"` na samym kontenerze z `aria-hidden`; nie usuwa jego potomków z kolejności Tab.
