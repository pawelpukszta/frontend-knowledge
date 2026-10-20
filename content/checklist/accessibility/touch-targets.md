---
title: Odpowiedni rozmiar celów dotykowych
priority: medium
sources:
  - title: "W3C Understanding 2.5.8: Target Size (Minimum)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
---

Cele co najmniej 24x24 CSS px lub z odstępem, który mieści okrąg o średnicy 24 px (WCAG 2.2 SC 2.5.8, AA); zalecane 44x44 (Apple, WCAG 2.5.5 AAA) lub 48x48 dp (Material). Linki w tekście są wyłączone z wymogu.

## Dlaczego to ważne

- Osoby z drżeniem rąk, artretyzmem lub obsługujące telefon jedną ręką w ruchu nie trafią w ikonę 16 px; pomyłka "Usuń" zamiast "Edytuj" w koszyku kosztuje nerwy i konwersję.
- Kryterium 2.5.8 jest nowe w WCAG 2.2 i obowiązuje na poziomie AA, czyli w zakresie European Accessibility Act.
- Wyjątki: linki w zdaniu, niestylowane kontrolki natywne, elementy, których rozmiar jest niezbędny lub wymagany prawnie (np. pinezki na mapie).

## Jak sprawdzić

Zmierz element (z paddingiem) w DevTools w widoku mobilnym; axe (`target-size`); przetestuj kciukiem na prawdziwym telefonie.

## Kod

```css
/* Icon button: 20 px icon, 44 px hit area */
.icon-btn {
  inline-size: 2.75rem;
  block-size: 2.75rem;
  display: inline-grid;
  place-items: center;
  padding: 0;
}
/* Small filter chips get a larger hit area via padding */
.filter-chip { padding: 0.75rem 1rem; min-block-size: 2.75rem; }
/* Keep space between adjacent targets */
.toolbar { display: flex; gap: 0.5rem; }
```

## Częste błędy

- Zwiększenie samej ikony SVG zamiast obszaru klikalnego przycisku.
- Kontrolki karuzeli lub zamykania modala 16x16 px tuż przy krawędzi ekranu.
