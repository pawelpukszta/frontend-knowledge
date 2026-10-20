---
title: Element meter ma dostępną nazwę
priority: medium
---

Wskaźniki z rolą `meter` (np. siła hasła, zapełnienie autokaru) potrzebują nazwy, żeby wartość miała kontekst. Natywny `<meter>` nazwij przez `<label>`.

## Dlaczego to ważne

- Czytnik ogłosi "miernik, 75%" bez kontekstu; użytkownik nie wie, czy to siła hasła, obłożenie hotelu czy kompletność profilu.
- `meter` to wartość w znanym zakresie, a `progressbar` to postęp zadania; pomylenie ról zmienia to, co słyszy użytkownik.
- axe przypisuje regułę do WCAG 1.1.1 (A): graficzny wskaźnik niosący informację potrzebuje tekstowej alternatywy.

## Jak sprawdzić

axe (`aria-meter-name`) lub Computed name w panelu Accessibility.

## Kod

```html title="Źle"
<div role="meter" aria-valuenow="3" aria-valuemin="0" aria-valuemax="4"></div>
```

```html title="Dobrze"
<span id="pwd-strength">Siła hasła</span>
<div role="meter" aria-labelledby="pwd-strength"
     aria-valuenow="3" aria-valuemin="0" aria-valuemax="4"
     aria-valuetext="dobre"></div>

<!-- Native alternative -->
<label for="seats">Zajęte miejsca w autokarze</label>
<meter id="seats" min="0" max="50" value="42">42 z 50</meter>
```

## Częste błędy

- Sam kolor paska (czerwony, żółty, zielony) bez `aria-valuetext` i bez widocznego opisu słownego.
