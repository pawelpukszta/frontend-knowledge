---
title: CSS containment
priority: medium
sources:
  - title: "web.dev: content-visibility"
    url: https://web.dev/articles/content-visibility
---

`contain: layout paint` lub `content-visibility: auto` ograniczają zasięg przeliczeń i pozwalają pominąć renderowanie sekcji poza ekranem.

## Dlaczego to ważne

- Na długiej stronie (opis hotelu, opinie, mapa, FAQ) `content-visibility: auto` pozwala przeglądarce pominąć layout i paint sekcji poza ekranem, co skraca pierwsze renderowanie.
- `contain` daje gwarancję, że zmiany wewnątrz widgetu (np. licznik w koszyku) nie wymuszą przeliczenia reszty strony.
- Treść ukryta przez `content-visibility: auto` nadal jest w DOM, więc działa wyszukiwanie na stronie i jest dostępna dla czytników ekranu, w przeciwieństwie do `display: none`.

## Jak sprawdzić

Profil renderowania w DevTools Performance przed i po zmianie (czas Rendering i Layout); sprawdź, czy pasek przewijania nie "skacze".

## Kod

```css
.hotel-section {
  content-visibility: auto;
  /* Placeholder size; "auto" remembers the real size after first render */
  contain-intrinsic-size: auto 600px;
}
.cart-widget {
  contain: layout paint; /* internal changes stay inside */
}
```

## Częste błędy

- `content-visibility: auto` na sekcji widocznej od razu (np. z elementem LCP), co opóźnia jej renderowanie.
