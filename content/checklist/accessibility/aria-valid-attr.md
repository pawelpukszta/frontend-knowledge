---
title: Używaj tylko istniejących atrybutów ARIA
priority: high
---

Literówki typu `aria-lable` są ignorowane przez przeglądarkę, więc element zostaje bez nazwy lub stanu. Dozwolone są tylko atrybuty ze specyfikacji WAI-ARIA.

## Dlaczego to ważne

- Literówka nie daje błędu w konsoli ani w TypeScript: JSX akceptuje dowolny atrybut z myślnikiem, więc `aria-lable` przechodzi kompilację i często code review.
- Przycisk z `aria-lable="Zamknij"` jest dla czytnika bezimienny, choć autor jest przekonany, że go opisał.
- Tak samo nic nie robią atrybuty wymyślone (`aria-name`, `aria-tooltip`, `aria-text`), których nie ma w specyfikacji.

## Jak sprawdzić

axe (`aria-valid-attr`) w testach oraz eslint-plugin-jsx-a11y (reguła `aria-props`) już w edytorze.

## Kod

```html title="Źle"
<button aria-lable="Zamknij"><svg aria-hidden="true">...</svg></button>
<input id="pesel" aria-requierd="true" aria-describeby="pesel-hint">
```

```js title="eslint.config.js"
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      "jsx-a11y/aria-props": "error", // unknown aria-* names, e.g. aria-lable
      "jsx-a11y/aria-proptypes": "error", // invalid values, e.g. aria-hidden="yes"
    },
  },
];
```

## Częste błędy

- Poleganie wyłącznie na lincie JSX; atrybuty dodawane w szablonach CMS lub przez `setAttribute` wychwyci dopiero axe na wyrenderowanej stronie.
