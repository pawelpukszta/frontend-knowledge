---
title: Jednostki względne
priority: high
---

`rem` dla fontów (szanuje ustawienia użytkownika), `%`, `fr`, `vw`, `dvh`, `clamp()` dla układu. Stałe piksele utrudniają skalowanie.

## Dlaczego to ważne

- Użytkownik, który ustawił w przeglądarce większą czcionkę domyślną, nie zobaczy zmiany, jeśli rozmiary są w `px`; w `rem` tekst rośnie zgodnie z jego wyborem.
- `100vh` na telefonach nie uwzględnia paska adresu i ucina dolny przycisk "Rezerwuj"; `100dvh` lub `100svh` liczą realną wysokość.
- `clamp()` daje płynną typografię bez kilku breakpointów, ale część w `rem` jest konieczna, żeby tekst dalej reagował na zoom (WCAG 1.4.4).

## Jak sprawdzić

Zmień domyślny rozmiar czcionki przeglądarki (np. 20 px) i powiększ stronę do 200%; sprawdź, czy układ się nie łamie.

## Kod

```css title="Źle"
h1 { font-size: 32px; }
.hero { height: 100vh; }
.title { font-size: 4vw; } /* ignores user font size and zoom */
```

```css title="Dobrze"
h1 { font-size: clamp(1.75rem, 1.2rem + 2vw, 2.75rem); }
.hero { min-block-size: 100dvh; }
.container { inline-size: min(100% - 2rem, 75rem); margin-inline: auto; }
```

## Częste błędy

- Ustawienie `html { font-size: 62.5% }`, które nadpisuje preferencje użytkownika i komplikuje obliczenia.
