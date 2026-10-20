---
title: Intl do formatowania walut, liczb i dat
priority: medium
---

`Intl.NumberFormat` (np. `{ style: 'currency', currency: 'PLN' }`) i `Intl.DateTimeFormat` znają separatory, kolejność, symbole walut i nazwy miesięcy dla każdego języka. Ręczne sklejanie `price + ' zł'` czy `toFixed(2)` prowadzi do błędów.

## Dlaczego to ważne

- Ta sama kwota wygląda różnie: `12 499,99 zł` po polsku, `12.499,99 €` po niemiecku, `€12,499.99` po angielsku; pomylenie przecinka z kropką potrafi zmienić odczytaną cenę tysiąckrotnie.
- Polskie reguły CLDR nie grupują liczb czterocyfrowych (`2499 zł`, ale `12 499 zł`), a separatorem jest twarda spacja; ręczny formatter prawie zawsze robi to źle albo łamie cenę na dwie linie.
- `Intl.DateTimeFormat` z jawną strefą `timeZone: 'Europe/Warsaw'` nie przesuwa daty o dzień, gdy serwer renderuje w UTC, a użytkownik jest w innej strefie; brak strefy to też częsta przyczyna błędów hydracji.

## Jak sprawdzić

Przejrzyj ceny i daty w każdej wersji językowej; dodaj test jednostkowy formatterów dla `pl-PL`, `de-DE` i `en-GB` (w wynikach są twarde spacje U+00A0).

## Kod

```ts title="src/lib/format.ts"
const pln = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
pln.format(2499.99);  // "2499,99 zł"   (Polish does not group 4-digit numbers)
pln.format(12499.99); // "12 499,99 zł" (non-breaking spaces)

new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(12499.99); // "12.499,99 €"
new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(12499.99); // "€12,499.99"

// Create formatters once and reuse them; constructing them on every render is costly
export const formatDeparture = new Intl.DateTimeFormat('pl-PL', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Warsaw',
}).format;
formatDeparture(new Date('2026-07-15T08:00:00Z')); // "środa, 15 lipca"

// Keep amounts in minor units (grosze) to avoid floating point errors
export const formatPrice = (grosze: number) => pln.format(grosze / 100);
```

## Częste błędy

- `toLocaleString()` bez podanego locale: wynik zależy od ustawień przeglądarki i różni się między SSR a klientem.
- Przechowywanie cen jako sformatowanych tekstów zamiast liczby (najlepiej w groszach) i kodu waluty.
