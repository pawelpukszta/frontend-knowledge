---
title: Linter dla CSS i SCSS
priority: medium
sources:
  - title: Stylelint
    url: https://stylelint.io/
---

Stylelint wykrywa błędy, nieznane właściwości, duplikaty i pilnuje konwencji. Uruchamiaj go w edytorze i w CI.

## Dlaczego to ważne

- Literówka w nazwie właściwości (`colr`) jest przez przeglądarkę po cichu ignorowana; linter zgłasza ją od razu.
- Reguły typu `declaration-no-important` czy `selector-max-specificity` utrzymują jakość kodu bez zależności od czujności recenzenta.
- Stylelint od wersji 16 nie zajmuje się formatowaniem; łącz go z Prettierem, a sam linter skup na poprawności i konwencjach.

## Jak sprawdzić

`npx stylelint "**/*.{css,scss}"` w pipeline CI i w pre-commit (lint-staged); build powinien się wywracać na błędach.

## Kod

```json title="package.json"
{
  "scripts": {
    "lint:css": "stylelint \"src/**/*.{css,scss}\" --max-warnings 0"
  },
  "lint-staged": {
    "*.{css,scss}": "stylelint --fix"
  }
}
```

```json title=".stylelintrc.json"
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "declaration-no-important": true,
    "selector-max-id": 0,
    "color-named": "never"
  }
}
```

## Częste błędy

- Linter skonfigurowany tylko w edytorze jednej osoby, bez kroku w CI.
