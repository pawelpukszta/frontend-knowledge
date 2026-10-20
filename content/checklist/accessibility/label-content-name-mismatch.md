---
title: Dostępna nazwa zawiera widoczną etykietę
priority: medium
sources:
  - title: "W3C Understanding 2.5.3: Label in Name"
    url: https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html
---

Jeśli przycisk pokazuje "Szukaj", to `aria-label` nie może brzmieć "Wyślij zapytanie". Najlepiej, by nazwa zaczynała się od widocznego tekstu. WCAG 2.5.3 (A).

## Dlaczego to ważne

- Użytkownicy sterowania głosem (Dragon, Voice Control w iOS i macOS) mówią to, co widzą: "kliknij Szukaj"; jeśli nazwa to "Wyślij zapytanie", polecenie nie zadziała.
- Niezgodność myli też osoby widzące korzystające z czytnika ekranu, które słyszą coś innego, niż mają na ekranie.
- Najprościej: nie dodawaj `aria-label` tam, gdzie wystarczy widoczny tekst.

## Jak sprawdzić

Porównaj widoczny tekst z Computed name w DevTools; axe (`label-content-name-mismatch`, reguła eksperymentalna).

## Kod

```html title="Źle"
<button aria-label="Wyślij zapytanie">Szukaj</button>
<a href="/kreta" aria-label="Przejdź do kategorii">Kreta</a>
```

```html title="Dobrze"
<button>Szukaj</button>
<!-- Extra context appended after the visible text keeps 2.5.3 satisfied -->
<a href="/kreta" aria-label="Kreta, 124 oferty">Kreta</a>
```
