---
title: Wszystko działa z klawiatury
priority: critical
sources:
  - title: "W3C Understanding 2.1.2: No Keyboard Trap"
    url: https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html
---

Każdą funkcję da się obsłużyć Tabem, Enterem, Spacją, strzałkami i Escape, bez pułapek klawiaturowych. Dotyczy także menu, sliderów i widgetów zewnętrznych (czat, mapa, płatności).

## Dlaczego to ważne

- Z klawiatury korzystają osoby niewidome, z niepełnosprawnościami ruchowymi, użytkownicy przełączników i sterowania głosem (które emuluje klawiaturę) oraz zaawansowani użytkownicy.
- Jeden niedostępny element na ścieżce zakupu (np. wybór daty w kalendarzu) blokuje całą rezerwację; to utracona sprzedaż, nie drobny defekt.
- To kryteria WCAG 2.1.1 Keyboard i 2.1.2 No Keyboard Trap (poziom A); z widżetu, do którego da się wejść, musi dać się wyjść klawiaturą.

## Jak sprawdzić

Odłóż mysz i przejdź kluczowe ścieżki (wyszukiwanie, koszyk, płatność); focus musi być widoczny, a każde okno dać się zamknąć Escape.

## Kod

```html title="Źle"
<div class="date-cell" onclick="selectDate('2027-07-12')">12</div>
<span class="dropdown-toggle" onmouseover="openMenu()">Kierunki</span>
```

```html title="Dobrze"
<button type="button" class="date-cell" onclick="selectDate('2027-07-12')"
        aria-label="12 lipca 2027, dostępne, od 3499 zł">12</button>
<button type="button" aria-expanded="false" aria-controls="menu-destinations">Kierunki</button>
<ul id="menu-destinations" hidden>...</ul>
```

## Częste błędy

- Obsługa tylko `mouseover`/`click` na `div`; nie dostaje focusu i nie reaguje na Enter ani Spację.
- Osadzony iframe (mapa, czat) łapiący focus bez możliwości wyjścia Tabem.
