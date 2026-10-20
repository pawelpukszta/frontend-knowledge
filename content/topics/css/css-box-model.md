---
title: Box model i box-sizing
level: mid
tags:
  - box model
  - box-sizing
  - margin collapse
summary: "Każdy element to prostokąt: content, padding, border, margin. box-sizing: border-box sprawia, że width obejmuje padding i border, co upraszcza layout."
sources:
  - title: "MDN: The box model"
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model
  - title: "MDN: Mastering margin collapsing"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing
---

## Wyjaśnienie

- `content-box` (domyślne): `width` to tylko treść; padding i border są dodawane.
- `border-box`: `width` obejmuje content + padding + border. Standard w resetach CSS.
- **Margin collapsing**: pionowe marginesy sąsiednich bloków łączą się (wygrywa większy). Nie dotyczy elementów flex i grid; dlatego do odstępów lepszy jest `gap`.
- Elementy `inline` ignorują `width`/`height` i pionowe marginesy; `inline-block` je respektuje.

## Kod

```css
*, *::before, *::after { box-sizing: border-box; }

.card {
  width: 300px;
  padding: 16px;
  border: 1px solid;
  /* with border-box the rendered width is 300px, not 334px */
}

.list { display: flex; flex-direction: column; gap: 12px; } /* no margin collapsing issues */
```

## Pytania

### Czym różni się content-box od border-box? {#css-box-model-q1}

W `content-box` szerokość dotyczy tylko treści, a padding i border ją powiększają. W `border-box` szerokość obejmuje treść, padding i border, więc element ma dokładnie zadaną szerokość.

### Czym jest margin collapsing? {#css-box-model-q2}

Łączeniem pionowych marginesów sąsiednich elementów blokowych (lub rodzica i pierwszego dziecka) w jeden, równy większemu z nich. Nie występuje w kontenerach flex i grid.

## Quiz

### Przy `box-sizing: border-box`, width: 200px, padding: 20px, border: 5px, rzeczywista szerokość to: {#css-box-model-z1}

- [x] 200px
- [ ] 250px
- [ ] 240px
- [ ] 210px

W border-box padding i border są wliczone w width.
