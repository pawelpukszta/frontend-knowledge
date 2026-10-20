---
title: Działa w orientacji pionowej i poziomej
priority: high
---

Nie blokuj orientacji ekranu, chyba że jest niezbędna (np. skanowanie czeku, wirtualne pianino). Treść i funkcje działają zarówno w pionie, jak i w poziomie. WCAG 1.3.4 (AA).

## Dlaczego to ważne

- Część osób ma tablet lub telefon zamontowany na stałe, np. na wózku; komunikat "obróć urządzenie" całkowicie odcina im dostęp do serwisu.
- Osoby słabowidzące często obracają telefon poziomo, żeby uzyskać większy tekst przy tej samej szerokości kolumny.
- Blokada przez CSS (ukrycie treści w `@media (orientation: landscape)`), `screen.orientation.lock()` czy pole `orientation` w manifeście PWA łamie kryterium tak samo.

## Jak sprawdzić

Obróć urządzenie lub przełącz orientację w trybie urządzenia w DevTools; przejrzyj manifest i wywołania `screen.orientation.lock()`.

## Kod

```css title="Źle"
/* Hides the whole booking app in landscape on phones */
@media (orientation: landscape) and (max-height: 500px) {
  .app { display: none; }
  .rotate-hint { display: block; }
}
```

```json title="manifest.webmanifest (Dobrze)"
{
  "name": "Wakacje: rezerwacje",
  "display": "standalone",
  "orientation": "any"
}
```

## Częste błędy

- Komunikat "obróć telefon" zamiast dopasowania układu do niskiego ekranu (np. mniejszy nagłówek, brak przyklejonego paska).
