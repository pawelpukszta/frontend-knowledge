---
title: Brak stron bez linków wychodzących
priority: medium
---

Strona bez linków wewnętrznych "zatrzymuje" użytkownika i robota. Dodaj powiązane treści, nawigację, CTA.

## Dlaczego to ważne

- Użytkownik na takiej stronie ma do wyboru tylko przycisk Wstecz lub zamknięcie karty; rosną odrzucenia, spada liczba odsłon ofert.
- Robot nie przechodzi dalej, więc sygnały z linków prowadzących do tej strony nie płyną do reszty serwisu.
- Typowe przypadki: landing kampanii bez nawigacji, strona podziękowania po rezerwacji, wygasła oferta bez propozycji alternatyw.

## Jak sprawdzić

Crawler: strony bez linków wychodzących (outlinks = 0).

## Kod

```html title="Wygasła oferta z dalszą ścieżką"
<main>
  <h1>Ta oferta nie jest już dostępna</h1>
  <p>Termin wyjazdu do hotelu Olimp minął. Zobacz podobne propozycje:</p>
  <ul>
    <li><a href="/oferty/kreta-hotel-aria">Kreta, Hotel Aria 4*, od 3 290 zł</a></li>
    <li><a href="/oferty/kreta-hotel-minos">Kreta, Hotel Minos 5*, od 4 150 zł</a></li>
  </ul>
  <a href="/wakacje/grecja/kreta">Wszystkie oferty na Krecie</a>
</main>
```

## Częste błędy

- Strona z linkami wyłącznie w elementach JS bez `href` (np. karuzela z `onClick`).
