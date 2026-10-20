---
title: Brak treści migających częściej niż 3 razy na sekundę
priority: critical
sources:
  - title: W3C Understanding 2.3.1
    url: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
---

Treść nie może błyskać ani migotać więcej niż 3 razy w ciągu sekundy, chyba że błyski są małe i poniżej progów ogólnego oraz czerwonego błysku. To kryterium WCAG 2.3.1 (poziom A), którego naruszenie grozi realnym zagrożeniem zdrowia: napadem padaczki fotogennej.

## Dlaczego to ważne

- Padaczka fotogenna dotyczy ok. 3% osób chorych na padaczkę (dane Epilepsy Foundation); napad mogą wywołać już sekundy migotania, a strona nie daje "drugiego podejścia".
- W 1997 roku jeden odcinek anime "Pokemon" z szybko migającą czerwono-niebieską sceną sprawił, że kilkaset dzieci w Japonii trafiło do szpitala; nasycona czerwień jest szczególnie niebezpieczna.
- Przycisk pauzy nie rozwiązuje problemu: migotanie szkodzi, zanim użytkownik zdąży zareagować, dlatego kryterium obowiązuje także dla autoodtwarzanych wideo i reklam.

## Jak sprawdzić

Przejrzyj animacje, wideo, GIF-y i efekty "flash" przy promocjach; podejrzane materiały sprawdź analizatorem błysków (PEAT, Harding FPA). W kodzie szukaj animacji z cyklem krótszym niż ok. 333 ms, które zmieniają jasność lub kolor dużych obszarów.

## Kod

```css title="Źle"
/* "Last minute" badge flashes 5 times per second */
.badge-hot { animation: flash 200ms steps(1) infinite; }
@keyframes flash {
  50% { background: #ff0000; color: #ffffff; }
}
```

```css title="Dobrze"
/* Slow, subtle pulse: one cycle per 2 s, opacity only, stops after 3 runs */
.badge-hot { animation: pulse 2s ease-in-out 3; }
@keyframes pulse {
  50% { opacity: 0.7; }
}
@media (prefers-reduced-motion: reduce) {
  .badge-hot { animation: none; }
}
```

## Częste błędy

- Efekt stroboskopu w wideo hero lub banerze reklamowym; za treści osadzone z sieci reklamowych też odpowiadasz.
- Testowanie tylko na telefonie; na dużym monitorze ten sam błysk zajmuje znacznie większą część pola widzenia.
