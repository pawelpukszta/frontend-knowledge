---
title: Respektuj preferencję ograniczenia ruchu
priority: high
sources:
  - title: "W3C Understanding 2.3.3: Animation from Interactions"
    url: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
---

Użytkownicy z zaburzeniami przedsionkowymi (błędnika) włączają w systemie opcję "ogranicz ruch". Media query `prefers-reduced-motion: reduce` powinna wyłączać lub łagodzić duże animacje, paralaksę, autoodtwarzane efekty i animowane przejścia między widokami.

## Dlaczego to ważne

- Ruch na ekranie, zwłaszcza przesuwanie i skalowanie dużych obszarów, wywołuje u osób z zaburzeniami przedsionkowymi zawroty głowy, nudności i migrenę, które potrafią trwać godzinami po zamknięciu strony.
- Ustawienie istnieje w iOS, Androidzie, macOS i Windows, a przeglądarki przekazują je do CSS i JS, więc obsługa kosztuje kilka linii kodu.
- WCAG 2.3.3 (AAA) wymaga możliwości wyłączenia animacji wywołanych interakcją, a 2.2.2 (A) pauzy dla ruchu trwającego automatycznie dłużej niż 5 sekund.

## Jak sprawdzić

Włącz emulację `prefers-reduced-motion` w DevTools (Rendering) i sprawdź, czy duże animacje znikają; sprawdź też animacje sterowane z JS (Web Animations API, Motion, GSAP) i View Transitions.

## Kod

```css title="Ruch tylko na życzenie"
/* Motion is opt-in: only users without the preference get it */
@media (prefers-reduced-motion: no-preference) {
  .offer-card { transition: transform 300ms ease; }
  .offer-card:hover { transform: translateY(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

```ts title="Animacje w JS"
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function revealHero(el: HTMLElement) {
  if (reduceMotion.matches) return; // show the final state immediately
  el.animate(
    [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
    { duration: 400, easing: "ease-out" },
  );
}
```

## Częste błędy

- Ograniczenie ruchu nie oznacza usunięcia wszystkiego: płynna zmiana koloru lub przezroczystości jest zwykle bezpieczna; usuwaj przesunięcia, skalowanie, obroty i paralaksę.
- Obsługa preferencji tylko w CSS, z pominięciem bibliotek JS i autoodtwarzanego wideo w tle.
