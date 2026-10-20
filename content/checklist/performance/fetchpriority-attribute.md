---
title: fetchpriority dla krytycznych zasobów
priority: medium
sources:
  - title: "web.dev: Fetch Priority API"
    url: https://web.dev/articles/fetch-priority
---

`fetchpriority="high"` na obrazie LCP (lub jego preloadzie), `low` na mniej ważnych zasobach, np. kolejnych slajdach karuzeli, obrazach w zwiniętym menu czy skryptach, które mogą poczekać.

## Dlaczego to ważne

- Domyślnie obrazy startują z niskim priorytetem, a przeglądarka podnosi go dopiero po wyliczeniu layoutu; `fetchpriority="high"` pozwala pobrać obraz LCP od razu.
- W case study Google Flights dodanie `fetchpriority="high"` do obrazu tła skróciło LCP z 2,6 s do 1,9 s.
- Obniżenie priorytetu niewidocznych slajdów zwalnia pasmo dla obrazu, który użytkownik faktycznie widzi.

## Jak sprawdzić

Kolumna Priority w Network (pokazuje priorytet początkowy i końcowy), insight o wykrywalności żądania LCP w Lighthouse.

## Kod

```html
<!-- LCP image: discovered in HTML, fetched with high priority -->
<img src="/img/hero-santorini-1200.avif" alt="Widok na kalderę z tarasu hotelu"
     width="1200" height="675" fetchpriority="high">

<!-- Hidden carousel slides: lower priority, still eager so swipe is smooth -->
<img src="/img/slide-2.avif" alt="Basen hotelowy" width="1200" height="675" fetchpriority="low">
<img src="/img/slide-3.avif" alt="Pokój z widokiem na morze" width="1200" height="675" fetchpriority="low">
```

## Częste błędy

- `fetchpriority="high"` na kilku obrazach naraz: wysoki priorytet dla wszystkiego to brak priorytetów.
