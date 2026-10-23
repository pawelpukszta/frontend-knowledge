---
title: "Critical Rendering Path: od HTML do pikseli"
level: mid
added: 2026-10-20
tags:
  - CRP
  - DOM
  - CSSOM
  - render tree
  - layout
  - paint
  - composite
summary: Przeglądarka parsuje HTML do DOM, CSS do CSSOM, łączy je w render tree, oblicza układ (layout), maluje piksele (paint) i składa warstwy (composite).
flow:
  - HTML → DOM
  - CSS → CSSOM
  - DOM + CSSOM = Render Tree
  - Layout
  - Paint
  - Composite
sources:
  - title: "MDN: Critical rendering path"
    url: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path
  - title: "web.dev: How browsers work"
    url: https://web.dev/articles/howbrowserswork
  - title: "web.dev: Understand the critical path"
    url: https://web.dev/learn/performance/understanding-the-critical-path
  - title: "Chrome: Inside look at modern web browser (part 3)"
    url: https://developer.chrome.com/blog/inside-browser-part3
---

## Wyjaśnienie

1. **Parsowanie HTML → DOM**: bajty → znaki → tokeny → węzły → drzewo DOM. Parser działa przyrostowo. Zwykły `<script>` **zatrzymuje** parsowanie. Preload scanner w tle wyszukuje zasoby do pobrania (obrazy, CSS, JS).
2. **Parsowanie CSS → CSSOM**: drzewo reguł stylów z kaskadą i dziedziczeniem. CSS jest **render-blocking**: przeglądarka nie wyrenderuje strony bez kompletnego CSSOM.
3. **Render tree**: połączenie DOM i CSSOM, tylko **widoczne** elementy z obliczonymi stylami. Elementy z `display: none` i `<head>` nie trafiają do render tree (`visibility: hidden` trafia, bo zajmuje miejsce).
4. **Layout (reflow)**: obliczenie geometrii: pozycji i rozmiarów każdego elementu względem viewportu.
5. **Paint**: zamiana na piksele: tekst, kolory, obramowania, cienie, obrazy. Odbywa się na warstwach.
6. **Composite**: składanie warstw w odpowiedniej kolejności (GPU). `transform` i `opacity` często wymagają tylko tego kroku.

**Optymalizacja CRP**: mniej zasobów krytycznych, mniejsze pliki, krótsza ścieżka (mniej round-tripów). Konkretnie: inline krytycznego CSS, `defer` dla skryptów, preload najważniejszego obrazu (LCP), unikanie `@import` w CSS.

## Analogia

Budowa domu: DOM to lista pomieszczeń, CSSOM to projekt wnętrz. Render tree to plan tylko tych pomieszczeń, które faktycznie budujesz. Layout to wymiarowanie ścian, paint to malowanie, a composite to złożenie gotowych prefabrykatów na miejscu.

## Pytania

### Opisz proces renderowania strony przez przeglądarkę. {#dom-crp-q1}

Parsowanie HTML do DOM i CSS do CSSOM, połączenie ich w render tree (tylko widoczne elementy ze stylami), layout (geometria), paint (piksele na warstwach) i composite (złożenie warstw na GPU). JavaScript może przerwać parsowanie i wymusić ponowne przeliczenie etapów.

### Dlaczego CSS blokuje renderowanie? {#dom-crp-q2}

Bez pełnego CSSOM przeglądarka nie zna stylów, więc wyrenderowanie strony groziłoby "mignięciem" niestylowanej treści (FOUC). Dlatego CSS w `<head>` blokuje pierwszy render, ale nie parsowanie HTML.

### Czym różni się display: none od visibility: hidden w kontekście render tree? {#dom-crp-q3}

`display: none` usuwa element z render tree (nie zajmuje miejsca, nie ma layoutu). `visibility: hidden` zostaje w render tree i zajmuje miejsce, tylko nie jest malowany.

## Quiz

### Prawidłowa kolejność etapów renderowania: {#dom-crp-z1}

- [ ] Layout → DOM → Paint → CSSOM
- [x] DOM + CSSOM → Render tree → Layout → Paint → Composite
- [ ] Paint → Layout → Render tree → Composite
- [ ] CSSOM → Paint → DOM → Layout

Najpierw budowane są drzewa, potem geometria, piksele i złożenie warstw.

### Element z `display: none`: {#dom-crp-z2}

- [x] Nie trafia do render tree
- [ ] Trafia do render tree, ale nie jest malowany
- [ ] Zajmuje miejsce w layoucie
- [ ] Jest usuwany z DOM

`visibility: hidden` zostaje w render tree; `display: none` nie.
