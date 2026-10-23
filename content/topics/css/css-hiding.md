---
title: "Ukrywanie elementów: display, visibility, opacity, hidden, sr-only"
level: mid
added: 2026-10-20
tags:
  - display none
  - visibility hidden
  - opacity
  - hidden
  - aria-hidden
  - sr-only
summary: "display: none usuwa element z layoutu i drzewa dostępności. visibility: hidden ukrywa go, ale zostawia zajęte miejsce. opacity: 0 tylko czyni go przezroczystym: nadal zajmuje miejsce i reaguje na kliknięcia."
sources:
  - title: "MDN: visibility"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/visibility
  - title: "MDN: display"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/display
  - title: "MDN: The hidden global attribute"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden
  - title: "Scott O'Hara: Inclusively Hidden"
    url: https://www.scottohara.me/blog/2017/04/14/inclusively-hidden.html
---

## Wyjaśnienie

| Sposób | Zajmuje miejsce | Klikalny / fokusowalny | Czytnik ekranu | Animowalny |
|---|---|---|---|---|
| `display: none` | nie | nie | nie | nie (wprost; od niedawna z `transition-behavior: allow-discrete`) |
| atrybut `hidden` | nie (domyślnie `display: none`) | nie | nie | jak wyżej |
| `visibility: hidden` | **tak** | nie | nie | tak (przełączenie w trakcie przejścia) |
| `opacity: 0` | **tak** | **tak** | **tak** (nadal czytany) | tak, płynnie |
| `content-visibility: hidden` | zależy od rozmiaru | nie | nie | nie; zachowuje stan renderowania |
| klasa `.sr-only` / `.visually-hidden` | nie (wizualnie) | tak | **tak** | nie dotyczy |
| `aria-hidden="true"` | tak | tak (!) | nie | nie dotyczy |

W render tree: `display: none` nie trafia do niego w ogóle, `visibility: hidden` trafia (ma layout, nie jest malowany).

Praktyka:

- Ukrycie przed wszystkimi: `hidden` lub `display: none`.
- Ukrycie tylko wizualnie, np. etykieta dla czytnika ekranu: klasa `.visually-hidden`.
- Ukrycie tylko przed czytnikiem (ikony dekoracyjne): `aria-hidden="true"`, nigdy na elementach fokusowalnych.
- Animowane pojawianie się: `opacity` + `visibility`, żeby po ukryciu element nie przechwytywał kliknięć.

## Kod

```css
.visually-hidden {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* Fade that does not leave an invisible click target */
.toast { opacity: 1; visibility: visible; transition: opacity 0.2s, visibility 0.2s; }
.toast.is-hidden { opacity: 0; visibility: hidden; }
```

## Pytania

### Jaka jest różnica między display: none a visibility: hidden? {#css-hiding-q1}

`display: none` usuwa element z layoutu (nie zajmuje miejsca, nie ma go w render tree ani drzewie dostępności). `visibility: hidden` ukrywa element wizualnie, ale zachowuje jego miejsce w układzie; element nie reaguje na kliknięcia i nie jest czytany. Dodatkowo `visibility` można nadpisać w dziecku (`visible`), a `display: none` rodzica ukrywa całe poddrzewo.

### A opacity: 0? {#css-hiding-q2}

Element jest tylko przezroczysty: zajmuje miejsce, można go kliknąć i sfokusować, czytnik ekranu go odczyta. Dlatego przy animacjach ukrywania łączy się `opacity` z `visibility: hidden` lub usuwa element po animacji.

### Jak ukryć tekst wizualnie, ale zostawić go dla czytników ekranu? {#css-hiding-q3}

Klasą typu `.visually-hidden` (1 px, `clip-path`, `overflow: hidden`, pozycjonowanie absolutne). `display: none` i `visibility: hidden` ukryłyby go także przed technologiami asystującymi.

## Quiz

### Element z `visibility: hidden`: {#css-hiding-z1}

- [ ] Nie zajmuje miejsca w layoucie
- [x] Zajmuje miejsce, ale jest niewidoczny i nieklikalny
- [ ] Jest odczytywany przez czytniki ekranu
- [ ] Jest usuwany z DOM

`display: none` zwalnia miejsce, `visibility: hidden` je zachowuje.
