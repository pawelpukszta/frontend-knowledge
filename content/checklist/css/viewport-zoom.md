---
title: Nie blokuj powiększania
priority: high
---

`user-scalable=no` i `maximum-scale=1` w meta viewport uniemożliwiają powiększanie, co narusza WCAG 1.4.4.

## Dlaczego to ważne

- Osoby słabowidzące powiększają szczegóły (cena, godziny lotu, drobny druk regulaminu); zablokowany zoom odcina je od treści.
- WCAG 1.4.4 (AA) wymaga możliwości powiększenia tekstu do 200%, a European Accessibility Act czyni to obowiązkiem dla e-commerce i usług turystycznych.
- Blokowanie zoomu zwykle maskuje inny problem (np. auto-zoom iOS na polach poniżej 16 px), który da się rozwiązać w CSS.

## Jak sprawdzić

Sprawdź meta viewport w kodzie; audyt dostępności Lighthouse zgłasza `user-scalable=no` i `maximum-scale` poniżej 5; przetestuj gest pinch na telefonie.

## Kod

```html title="Źle"
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
```

```html title="Dobrze"
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Częste błędy

- Wyłączanie zoomu, żeby uniknąć powiększania pól formularzy w iOS; poprawne rozwiązanie to `font-size: 1rem` w polach.
