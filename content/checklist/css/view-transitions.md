---
title: View Transitions API dla płynnych przejść
priority: low
sources:
  - title: "MDN: View Transition API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
---

Natywne animacje między stanami strony lub między stronami (MPA: `@view-transition`) bez bibliotek JS. Uszanuj `prefers-reduced-motion`.

## Dlaczego to ważne

- Płynne przejście z listy ofert do szczegółów (miniatura "przelatuje" w duże zdjęcie) pomaga zachować kontekst i daje wrażenie aplikacji natywnej.
- Przejścia między stronami w klasycznej aplikacji wielostronicowej działają z samym CSS, bez routera SPA i dodatkowego JS.
- API jest progresywnym ulepszeniem: przeglądarki bez wsparcia po prostu zmienią stronę bez animacji.

## Jak sprawdzić

Sprawdź przejścia w przeglądarce z obsługą API oraz z włączonym `prefers-reduced-motion` (DevTools: Rendering); panel Animations pozwala je spowolnić.

## Kod

```css title="Przejścia między stronami (MPA)"
@view-transition { navigation: auto; }

/* Same name on the list thumbnail and the detail hero image */
.offer-card__img { view-transition-name: var(--vt-name); }
.offer-hero__img { view-transition-name: var(--vt-name); }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none; }
}
```

```js title="Przejście w SPA"
// Feature-detect, then update the DOM inside the callback
function showOffer(offer) {
  if (!document.startViewTransition) return render(offer);
  document.startViewTransition(() => render(offer));
}
```

## Częste błędy

- Ta sama wartość `view-transition-name` na kilku elementach jednocześnie; przejście zostanie pominięte.
