---
title: Linki w tekście odróżnialne nie tylko kolorem
priority: medium
sources:
  - title: "W3C Understanding 1.4.1: Use of Color"
    url: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
---

Link w akapicie ma podkreślenie (lub kontrast 3:1 względem otaczającego tekstu plus dodatkowy wskaźnik przy hover i focus). Sam kolor nie wystarczy osobom z zaburzeniami widzenia barw. WCAG 1.4.1 (A).

## Dlaczego to ważne

- Ok. 8% mężczyzn ma zaburzenia rozpoznawania barw; niebieski link w ciemnoszarym tekście może dla nich wyglądać identycznie jak reszta zdania.
- Wariant bez podkreślenia wymaga jednocześnie kontrastu 4,5:1 z tłem, 3:1 z tekstem i dodatkowego sygnału przy hover i focus; to trudne do utrzymania w całym design systemie.
- Podkreślenie jest powszechnie rozpoznawalne i działa również w trybie wysokiego kontrastu oraz na wydrukach.

## Jak sprawdzić

Podgląd strony w emulacji achromatopsji (DevTools, Rendering, Emulate vision deficiencies); axe (`link-in-text-block`).

## Kod

```css
/* Links inside running text stay underlined */
.prose a {
  color: #0b57d0;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}
.prose a:hover { text-decoration-thickness: 2px; }
.prose a:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
```

## Częste błędy

- `a { text-decoration: none; }` w globalnym resecie bez przywrócenia podkreślenia w treści artykułów i regulaminów.
