---
title: Nie przejmuj natywnego przewijania (scrolljacking)
priority: medium
---

Nie zmieniaj prędkości ani kierunku przewijania i nie zamieniaj kółka myszy w przeskoki między sekcjami. Takie nadpisywanie łamie oczekiwania użytkowników, utrudnia nawigację klawiaturą i czytnikami ekranu oraz psuje gesty na urządzeniach dotykowych.

## Dlaczego to ważne

- Użytkownik traci kontrolę: jeden ruch kółkiem przenosi go o cały ekran, więc nie przeczyta treści we własnym tempie; osoby z drżeniem rąk lub korzystające z trackballa trafiają w niewłaściwe sekcje.
- Przechwycone zdarzenie `wheel` z `preventDefault()` często psuje przewijanie Spacją, PageDown i komendami czytników ekranu, a stopka z danymi kontaktowymi bywa nieosiągalna.
- Nasłuchiwanie `wheel` lub `touchmove` z `passive: false` blokuje przewijanie realizowane przez kompozytor i powoduje szarpanie na słabszych urządzeniach.

## Jak sprawdzić

Przewiń stronę kółkiem, touchpadem, klawiaturą (Space, PageDown) i gestem na telefonie; zachowanie musi być natywne. W DevTools (Elements, zakładka Event Listeners) poszukaj handlerów `wheel` i `touchmove` wywołujących `preventDefault()`.

## Kod

```js title="Źle"
// Hijacks the wheel and jumps between full-screen sections
window.addEventListener("wheel", (e) => {
  e.preventDefault();
  goToSection(current + Math.sign(e.deltaY));
}, { passive: false });
```

```css title="Dobrze"
/* Native scrolling with gentle snapping; the user keeps full control */
.destinations {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
}
.destinations > li { flex: 0 0 min(80%, 22rem); scroll-snap-align: start; }
```

## Częste błędy

- `scroll-snap-type: y mandatory` na całej stronie; sekcja dłuższa niż ekran staje się częściowo nieosiągalna.
- Infinite scroll bez przycisku "Pokaż więcej" i bez dostępu do stopki.
