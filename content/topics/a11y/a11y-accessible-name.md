---
title: "Accessible name: label, alt, aria-label"
level: mid
added: 2026-10-20
tags:
  - label
  - alt
  - accessible name
  - formularze
summary: "Każdy interaktywny element i ważny obraz potrzebuje dostępnej nazwy, którą czytnik ekranu ogłosi. Źródła: treść elementu, label, alt, aria-labelledby, aria-label."
sources:
  - title: "MDN Glossary: Accessible name"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name
  - title: "W3C WAI: Images tutorial (alt decision tree)"
    url: https://www.w3.org/WAI/tutorials/images/decision-tree/
  - title: "W3C WAI: Forms tutorial"
    url: https://www.w3.org/WAI/tutorials/forms/
---

## Wyjaśnienie

Kolejność ustalania nazwy (w uproszczeniu): `aria-labelledby` → `aria-label` → natywne źródło (`<label>`, `alt`, treść tekstowa przycisku lub linku, `<caption>`, `<legend>`) → `title` (ostateczność).

- **Inputy**: zawsze `<label for="id">` lub input wewnątrz `<label>`. Placeholder **nie zastępuje** labela (znika po wpisaniu, słaby kontrast).
- **Obrazy**: `alt` opisuje treść lub funkcję obrazu. Obraz dekoracyjny: `alt=""` (pusty, ale obecny).
- **Linki**: tekst mówi, dokąd prowadzi. "Kliknij tutaj" i "Więcej" poza kontekstem nic nie znaczą.
- **Błędy formularza**: powiąż komunikat przez `aria-describedby` i ustaw `aria-invalid="true"`.

## Kod

```html
<label for="email">E-mail</label>
<input id="email" type="email" autocomplete="email"
       aria-invalid="true" aria-describedby="email-error" />
<p id="email-error">Podaj poprawny adres e-mail.</p>

<img src="hotel.jpg" alt="Hotel Blue Sea z basenem przy plaży" />
<img src="wave.svg" alt="" />  <!-- decorative -->

<a href="/oferty/kreta">Zobacz oferty na Krecie</a>
```

## Pytania

### Czy placeholder może zastąpić label? {#a11y-accessible-name-q1}

Nie. Placeholder znika po rozpoczęciu pisania, zwykle ma za niski kontrast i nie zawsze jest ogłaszany jako nazwa pola. Pole potrzebuje widocznego `<label>` powiązanego przez `for`/`id`.

### Jak pisać tekst alternatywny? {#a11y-accessible-name-q2}

Opisać to, co obraz przekazuje w kontekście strony (treść lub funkcję), zwięźle. Obrazy czysto dekoracyjne dostają `alt=""`, żeby czytnik je pominął. Ikona w przycisku bez tekstu wymaga nazwy na przycisku (`aria-label`).

## Quiz

### Obraz czysto dekoracyjny powinien mieć: {#a11y-accessible-name-z1}

- [ ] Brak atrybutu alt
- [x] alt="" (pusty)
- [ ] alt="obraz"
- [ ] aria-label

Pusty alt mówi czytnikowi, żeby pominął obraz. Brak alt powoduje odczyt nazwy pliku.
