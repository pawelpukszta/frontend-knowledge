---
title: Spójna konwencja nazewnictwa
priority: medium
---

BEM, CUBE CSS, utility-first lub CSS Modules, byle jedna w projekcie. Przewidywalne nazwy ułatwiają pracę zespołu i refaktoryzację.

## Dlaczego to ważne

- Z nazwy `.offer-card__price--promo` od razu widać, do jakiego komponentu należy klasa i że to wariant; można ją bezpiecznie zmienić bez szukania użyć w całym projekcie.
- Mieszanie konwencji (`.offerCard`, `.offer_title`, `.btn-primary`) powoduje duplikaty stylów i konflikty nazw w dużych zespołach.
- Konwencję da się wymusić automatycznie regexem w linterze, więc nie zależy od pamięci recenzenta.

## Jak sprawdzić

Code review, Stylelint (`selector-class-pattern`) z regexem dopasowanym do konwencji.

## Kod

```css title="BEM"
.offer-card { display: grid; gap: var(--space-2); }
.offer-card__title { font-size: var(--text-lg); }
.offer-card__price { font-weight: 700; }
.offer-card__price--promo { color: var(--color-danger); }
```

```json title=".stylelintrc.json"
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
      { "message": "Use BEM: block__element--modifier" }
    ]
  }
}
```

## Częste błędy

- Nazwy opisujące wygląd zamiast roli (`.red-text`, `.left-box`), które kłamią po pierwszym redesignie.
