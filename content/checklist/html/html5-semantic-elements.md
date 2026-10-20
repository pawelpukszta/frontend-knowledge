---
title: Semantyczne elementy HTML5
priority: high
---

`header`, `nav`, `main`, `article`, `section`, `aside`, `footer`, `button`, `figure`, `time` zamiast samych `div` i `span`. Dają dostępność, SEO i czytelny kod.

## Dlaczego to ważne

- Czytnik ekranu ogłasza role ("nawigacja", "przycisk", "artykuł"); `div` z `onclick` jest dla niego zwykłym tekstem, niedostępnym z klawiatury.
- Natywne elementy dają zachowanie za darmo: `button` reaguje na Enter i Spację, `details` się rozwija, `dialog` zarządza focusem.
- Wyszukiwarki i tryby czytania (np. Safari Reader) łatwiej znajdują treść główną w `main` i `article`, a `time datetime` podaje datę w formacie maszynowym.

## Jak sprawdzić

Przegląd DOM głównych szablonów; drzewo dostępności w DevTools (Elements, Accessibility).

## Kod

```html title="Źle"
<div class="header"><div class="menu">...</div></div>
<div class="offer">
  <div class="title">Hotel Aegean Blue</div>
  <span>12.05.2027</span>
  <div class="btn" onclick="book()">Rezerwuj</div>
</div>
```

```html title="Dobrze"
<header><nav aria-label="Główna">...</nav></header>
<main>
  <article class="offer">
    <h2>Hotel Aegean Blue</h2>
    <p>Wylot: <time datetime="2027-05-12">12 maja 2027</time></p>
    <button type="button" onclick="book()">Rezerwuj</button>
  </article>
</main>
```

## Częste błędy

- `section` jako zamiennik `div` bez nagłówka.
- `button` do zmiany strony i `a` bez `href` do akcji: link prowadzi, przycisk działa.
