---
title: Elementy drzewa mają dostępne nazwy
priority: medium
---

Każdy `treeitem` (np. w drzewie kategorii lub plików) musi mieć opisową nazwę. Dla rozwijanych węzłów wskaż etykietę przez `aria-labelledby`, żeby nazwa nie obejmowała dzieci.

## Dlaczego to ważne

- Drzewo kierunków (kontynent, kraj, region) bez nazw jest dla czytnika serią "element drzewa, rozwinięty" bez treści.
- Nazwa liczona z zawartości węzła obejmuje też zagnieżdżoną grupę, więc "Europa" może zostać ogłoszona jako "Europa Grecja Hiszpania Włochy".
- To reguła "best practice" w axe; wspiera WCAG 4.1.2.

## Jak sprawdzić

axe (`aria-treeitem-name`) i nawigacja strzałkami po drzewie z czytnikiem ekranu.

## Kod

```html title="Źle"
<ul role="tree" aria-label="Kierunki">
  <li role="treeitem" aria-expanded="true">
    <span class="icon-folder"></span>
    <ul role="group">
      <li role="treeitem"><img src="flag-gr.svg" alt=""></li>
    </ul>
  </li>
</ul>
```

```html title="Dobrze"
<ul role="tree" aria-label="Kierunki">
  <li role="treeitem" aria-expanded="true" aria-labelledby="ti-eu">
    <span class="icon-folder" aria-hidden="true"></span>
    <span id="ti-eu">Europa</span>
    <ul role="group">
      <li role="treeitem"><img src="flag-gr.svg" alt=""> Grecja</li>
    </ul>
  </li>
</ul>
```

## Częste błędy

- Użycie wzorca `tree` do zwykłej nawigacji z linkami; zagnieżdżona lista `<ul>` w `<nav>` jest prostsza i lepiej wspierana.
