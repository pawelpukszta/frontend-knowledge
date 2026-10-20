---
title: Nagłówki zawierają tekst
priority: medium
---

Pusty nagłówek (np. tylko ikona lub obraz bez `alt`) pojawia się w nawigacji czytnika jako "nagłówek poziom 2" bez treści.

## Dlaczego to ważne

- Użytkownik skaczący po nagłówkach trafia na pustą pozycję i traci orientację w strukturze strony.
- Puste nagłówki często zostają po CMS-ie lub warunkowym renderowaniu, gdy brakuje danych.

## Jak sprawdzić

axe (`empty-heading`) lub HeadingsMap; szukaj pozycji bez tekstu.

## Kod

```html title="Źle"
<h2><svg aria-hidden="true"><!-- sun icon --></svg></h2>
<h3></h3>
```

```html title="Dobrze"
<h2><svg aria-hidden="true"><!-- sun icon --></svg> Pogoda na Krecie</h2>
<!-- Logo heading: the image alt provides the text -->
<h2><img src="/img/partner-logo.svg" alt="Oferty partnera: Biuro Słońce" /></h2>
<!-- In JSX render the heading only when there is text: {offer.title && <h3>{offer.title}</h3>} -->
```
