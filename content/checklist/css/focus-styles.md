---
title: Widoczne style focusu
priority: high
sources:
  - title: "W3C Understanding 2.4.7: Focus Visible"
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
---

Nigdy `outline: none` bez zamiennika. `:focus-visible` z wyraźną obwódką (kontrast 3:1) pokazuje użytkownikom klawiatury, gdzie są.

## Dlaczego to ważne

- Osoby korzystające z klawiatury, switchy czy sterowania głosem bez widocznego focusu nie wiedzą, który element jest aktywny; formularz rezerwacji staje się nie do przejścia.
- To wymóg WCAG 2.4.7 (AA); WCAG 2.2 dodaje 2.4.11, focus nie może być całkowicie zasłonięty np. przez przyklejony nagłówek lub baner cookies.
- `:focus-visible` pokazuje obwódkę przy nawigacji klawiaturą, a nie po kliknięciu myszą, więc nie ma konfliktu z oczekiwaniami projektantów.

## Jak sprawdzić

Przejdź stronę Tabem w obu motywach; wyszukaj w kodzie `outline: none` i `outline: 0` bez zamiennika w `:focus-visible`.

## Kod

```css title="Źle"
button:focus { outline: none; }
```

```css title="Dobrze"
:focus-visible {
  outline: 3px solid var(--focus-ring, oklch(55% 0.2 255));
  outline-offset: 2px;
}
/* Keep focused elements clear of the sticky header (WCAG 2.4.11) */
html { scroll-padding-block-start: 5rem; }
/* Windows high contrast: transparent outline still renders */
.card-link:focus-visible { outline: 2px solid transparent; box-shadow: 0 0 0 3px var(--focus-ring); }
```

## Częste błędy

- Focus sygnalizowany tylko zmianą koloru tła o niskim kontraście.
