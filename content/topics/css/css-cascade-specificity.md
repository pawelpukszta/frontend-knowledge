---
title: Kaskada, specyficzność i @layer
level: mid
added: 2026-10-20
tags:
  - cascade
  - specificity
  - "@layer"
  - "!important"
summary: "Gdy kilka reguł ustawia tę samą właściwość, wygrywa ta z wyższym priorytetem: najpierw pochodzenie i warstwa, potem specyficzność selektora, na końcu kolejność w kodzie."
sources:
  - title: "MDN: Specificity"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity
  - title: "MDN: @layer"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
  - title: "MDN: Introducing the CSS Cascade"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade
---

## Wyjaśnienie

Kolejność rozstrzygania (uproszczona):

1. **Pochodzenie i ważność**: style przeglądarki < style autora < `!important` (odwrotna kolejność dla important).
2. **Warstwy kaskady `@layer`**: reguły z późniejszej warstwy wygrywają niezależnie od specyficzności; style bez warstwy wygrywają z warstwowymi.
3. **Specyficzność**: `(id, klasy/atrybuty/pseudoklasy, elementy/pseudoelementy)`. `#nav .item a` = (1,1,1). Inline style jest silniejszy od każdego selektora.
4. **Kolejność w kodzie**: przy równej specyficzności wygrywa późniejsza reguła.

`:where()` ma specyficzność 0 (świetne dla stylów bazowych), `:is()` i `:not()` przyjmują specyficzność najsilniejszego argumentu.

## Kod

```css
@layer reset, base, components, utilities;

@layer base {
  :where(a) { color: var(--link); }       /* specificity 0, easy to override */
}
@layer components {
  .card .title { font-size: 1.25rem; }    /* (0,2,0) */
}
@layer utilities {
  .text-sm { font-size: 0.875rem; }       /* wins: later layer */
}
```

## Pytania

### Jak liczy się specyficzność selektora? {#css-cascade-specificity-q1}

Jako trójka (ID, klasy/atrybuty/pseudoklasy, elementy/pseudoelementy), porównywana od lewej. `#a .b p` = (1,1,1) wygrywa z `.a .b .c p` = (0,3,1). Selektor uniwersalny i `:where()` nie dodają nic.

### Do czego służy @layer? {#css-cascade-specificity-q2}

Do jawnego ustalenia kolejności grup stylów (reset, baza, komponenty, utility). Reguła z późniejszej warstwy wygrywa bez podbijania specyficzności i bez `!important`, co ułatwia integrację bibliotek i nadpisywanie stylów.

## Quiz

### Który selektor ma wyższą specyficzność? {#css-cascade-specificity-z1}

- [x] #menu a
- [ ] .nav .item .link
- [ ] div ul li a
- [ ] :where(#menu) a

(1,0,1) wygrywa z (0,3,0). `:where()` ma specyficzność 0.
