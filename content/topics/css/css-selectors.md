---
title: "Selektory CSS: atrybutów, pseudoklasy, :has()"
level: mid
tags:
  - selektory
  - attribute selector
  - pseudoklasy
  - :has
  - :is
  - :where
  - kombinatory
summary: Selektor wskazuje elementy, do których stosuje się regułę. Selektor atrybutu dopasowuje elementy po obecności lub wartości atrybutu HTML, np. [type="email"] albo [href^="https"].
sources:
  - title: "MDN: Attribute selectors"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Attribute_selectors
  - title: "MDN: CSS selectors"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors
  - title: "MDN: :has()"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has
  - title: "W3C: Selectors Level 4"
    url: https://www.w3.org/TR/selectors-4/
---

## Wyjaśnienie

**Selektory atrybutów** (CSS 2.1 i CSS3):

| Selektor | Dopasowuje, gdy atrybut |
|---|---|
| `[disabled]` | istnieje |
| `[type="email"]` | ma dokładnie tę wartość |
| `[class~="card"]` | zawiera słowo z listy rozdzielonej spacjami |
| `[lang\|="pl"]` | równa się `pl` lub zaczyna od `pl-` |
| `[href^="https"]` | zaczyna się od |
| `[href$=".pdf"]` | kończy się na |
| `[data-city*="kre"]` | zawiera podciąg |
| `[data-city="Kreta" i]` | jak wyżej, bez rozróżniania wielkości liter |

Zastosowania: style oparte na stanie wyrażonym atrybutem (`[aria-expanded="true"]`, `[data-state="open"]`, `[aria-invalid="true"]`), typy inputów, ikony przy linkach do PDF. Stylowanie po atrybutach ARIA wymusza przy okazji poprawną dostępność.

**Pozostałe rodzaje selektorów:**

- Typ `button`, klasa `.card`, id `#main`, uniwersalny `*`.
- **Kombinatory**: potomek `a b`, dziecko `a > b`, następny brat `a + b`, każdy kolejny brat `a ~ b`.
- **Pseudoklasy** (stan): `:hover`, `:focus-visible`, `:checked`, `:disabled`, `:nth-child(2n)`, `:not()`, `:is()`, `:where()`, **`:has()`** ("selektor rodzica", np. karta, która zawiera zaznaczony checkbox).
- **Pseudoelementy** (część elementu): `::before`, `::after`, `::placeholder`, `::marker`, `::selection`.

Specyficzność: selektor atrybutu i pseudoklasa liczą się jak klasa (0,1,0).

## Kod

```css
input[type="email"] { background-image: url(mail.svg); }
a[href$=".pdf"]::after { content: " (PDF)"; }
button[aria-expanded="true"] .chevron { rotate: 180deg; }
[data-status="sold-out"] { opacity: 0.5; }

/* :has() - style the card that contains a checked checkbox */
.offer-card:has(input[type="checkbox"]:checked) { outline: 2px solid var(--accent); }

/* Form field with an invalid input */
.field:has(:user-invalid) label { color: var(--error); }
```

## Pytania

### Czym jest selektor atrybutu? {#css-selectors-q1}

Selektorem, który dopasowuje elementy na podstawie atrybutów HTML: samej obecności (`[disabled]`) lub wartości, także częściowej (`^=` początek, `$=` koniec, `*=` podciąg, `~=` słowo z listy, `|=` prefiks języka). Ma specyficzność klasy. Przydaje się do stylowania stanów wyrażonych atrybutami ARIA lub `data-*`.

### Czym różni się pseudoklasa od pseudoelementu? {#css-selectors-q2}

Pseudoklasa (`:hover`, `:checked`, `:has()`) opisuje stan lub relację całego elementu. Pseudoelement (`::before`, `::placeholder`) odnosi się do części elementu lub wirtualnego elementu, którego nie ma w DOM. W CSS3 pseudoelementy zapisuje się podwójnym dwukropkiem.

### Co daje :has()? {#css-selectors-q3}

Pozwala wybrać element na podstawie jego zawartości lub rodzeństwa, np. `.card:has(img)` lub `form:has(:invalid)`. To pierwszy praktyczny "selektor rodzica" w CSS, który eliminuje wiele przypadków przełączania klas z poziomu JS.

## Quiz

### Który selektor dopasuje linki kończące się na .pdf? {#css-selectors-z1}

- [ ] a[href^=".pdf"]
- [x] a[href$=".pdf"]
- [ ] a[href*=".pdf"i]
- [ ] a:has(.pdf)

`$=` oznacza "kończy się na", `^=` "zaczyna się od".
