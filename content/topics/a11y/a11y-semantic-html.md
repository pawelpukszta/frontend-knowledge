---
title: HTML semantyczny
level: mid
tags:
  - semantic HTML
  - button
  - nav
  - main
  - article
summary: Semantyczny HTML to znaczniki opisujące znaczenie treści, a nie tylko jej wygląd. Daje darmową dostępność, lepsze SEO i czytelniejszy kod.
sources:
  - title: "MDN Glossary: Semantics (in HTML)"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html
  - title: "MDN: HTML: A good basis for accessibility"
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML
  - title: "web.dev: Learn Accessibility"
    url: https://web.dev/learn/accessibility
---

## Wyjaśnienie

Przeglądarka buduje z DOM **drzewo dostępności (accessibility tree)**, z którego korzystają czytniki ekranu. Semantyczny element niesie w nim **rolę**, **nazwę** i **stan** bez żadnego dodatkowego kodu.

- `<button>`: fokusowalny, działa z Enter i Spacją, ogłaszany jako przycisk. `<div onClick>` nie ma żadnej z tych cech.
- `<a href>`: nawigacja (zmiana URL). `<button>`: akcja na stronie. Nie mieszaj.
- Struktura: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<section>` (z nagłówkiem), `<article>` (samodzielna treść, np. karta oferty).
- Formularze: `<form>`, `<label>`, `<fieldset>` + `<legend>` dla grup (np. radio), właściwe `type` inputów (`email`, `tel`, `date`) i `autocomplete`.
- Listy `<ul>/<ol>`, tabele danych `<table>` z `<th scope>` i `<caption>`.
- Natywne komponenty: `<dialog>`, `<details>/<summary>`, atrybut `popover`.

Zyski: dostępność "za darmo", SEO (wyszukiwarki rozumieją strukturę), obsługa klawiatury, mniej JS, łatwiejsze testy (Testing Library szuka po rolach).

## Kod

```html
<!-- Bad: div soup -->
<div class="btn" onclick="book()">Rezerwuj</div>

<!-- Good -->
<article class="offer">
  <h2>Kreta, Hersonissos</h2>
  <p>7 nocy, all inclusive</p>
  <button type="button" onclick="book()">Rezerwuj</button>
</article>

<details>
  <summary>Warunki anulacji</summary>
  <p>Bezpłatna anulacja do 30 dni przed wylotem.</p>
</details>
```

## Pytania

### Czym jest semantyczny HTML i dlaczego jest ważny? {#a11y-semantic-html-q1}

Używaniem znaczników zgodnie z ich znaczeniem (`button`, `nav`, `main`, `article`, `label`). Elementy te mają wbudowane role, obsługę klawiatury i stany, co daje dostępność dla czytników ekranu, lepsze SEO i mniej kodu JS.

### Kiedy <a>, a kiedy <button>? {#a11y-semantic-html-q2}

`<a href>` gdy przenosisz użytkownika w inne miejsce (zmiana URL, może być otwarty w nowej karcie). `<button>` gdy wykonujesz akcję na bieżącej stronie (otwarcie modala, wysłanie formularza, dodanie do koszyka).

## Quiz

### Który element wybierzesz do akcji "Dodaj do koszyka" na tej samej stronie? {#a11y-semantic-html-z1}

- [x] button
- [ ] a href="#"
- [ ] div z onClick
- [ ] span z role="link"

Akcja na stronie to przycisk; link służy do nawigacji.
