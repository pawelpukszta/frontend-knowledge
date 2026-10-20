---
title: Tekst alternatywny dla przycisków-obrazków
priority: critical
---

`<input type="image">` musi mieć `alt` opisujący akcję (np. "Szukaj"), bo to przycisk wysyłający formularz.

## Dlaczego to ważne

- Bez `alt` czytnik ogłasza nazwę pliku albo samo "przycisk"; użytkownik nie wie, czy wysyła wyszukiwanie, czy kasuje dane.
- Gdy obraz się nie wczyta, `alt` jest jedynym tekstem przycisku także dla osób widzących.
- Dziś zwykle lepszy jest `<button>` z ikoną SVG i tekstem: łatwiej go stylować i skalować.

## Jak sprawdzić

axe (`input-image-alt`); w DevTools sprawdź Computed name przycisku.

## Kod

```html title="Źle"
<input type="image" src="/icons/search.png" />
```

```html title="Dobrze"
<input type="image" src="/icons/search.png" alt="Szukaj ofert" />

<!-- Preferred modern alternative -->
<button type="submit">
  <svg aria-hidden="true" focusable="false"><!-- magnifier --></svg>
  <span class="visually-hidden">Szukaj ofert</span>
</button>
```

## Częste błędy

- `alt` opisujący wygląd ("lupa") zamiast akcji ("Szukaj").
