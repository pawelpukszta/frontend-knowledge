---
title: Płynne przewijanie do kotwic tylko bez reduced motion
priority: low
---

`scroll-behavior: smooth` jest przyjemne, ale powinno być wyłączone dla osób, które ograniczają ruch. Najprościej ustawić je wewnątrz `@media (prefers-reduced-motion: no-preference)`, a w JS dobierać `behavior` według tej samej preferencji.

## Dlaczego to ważne

- Płynny przejazd przez kilka ekranów treści to dokładnie ten ruch, który osoby z zaburzeniami przedsionkowymi wyłączają w systemie.
- Ustawienie w CSS działa też dla `scrollIntoView()` i `scrollTo()` wywołanych bez opcji `behavior`, więc jedna reguła kontroluje całą stronę; jawne `behavior: "smooth"` w JS ją omija.
- Długa animacja przewijania opóźnia dotarcie do treści i koliduje z użytkownikiem, który w tym czasie sam zaczyna przewijać.

## Jak sprawdzić

Kliknij link do kotwicy z emulacją reduced motion; przeskok powinien być natychmiastowy, a cel nie może chować się pod przyklejonym nagłówkiem.

## Kod

```css
/* Smooth scrolling only for users who did not ask for reduced motion */
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}

/* Keep the target visible below a sticky header */
:target { scroll-margin-top: 5rem; }
```

```js title="Przewijanie z JS"
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const form = document.getElementById("booking-form");

form?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
// scrollIntoView does not move focus: move it so Tab continues from the form
form?.focus({ preventScroll: true });
```

## Częste błędy

- `behavior: "smooth"` wpisane na sztywno w JS, które ignoruje preferencję użytkownika.
- Przewinięcie do sekcji bez przeniesienia focusu; kolejne naciśnięcie Tab wraca do miejsca sprzed skoku.
