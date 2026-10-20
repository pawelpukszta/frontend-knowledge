---
title: Mało zapytań HTTP
priority: high
---

Na starcie orientacyjnie poniżej 50 zapytań. Usuń zbędne skrypty i style, łącz drobne ikony w sprite SVG, nie ładuj zasobów dla niewidocznych elementów. HTTP/2 i HTTP/3 łagodzą, ale nie usuwają kosztu wielu zapytań.

## Dlaczego to ważne

- Każde zapytanie to nagłówki, priorytetyzacja, praca na wątku głównym i potencjalnie nowe połączenie do innej domeny (DNS, TCP, TLS).
- Duża liczba zapytań zwykle oznacza dużo skryptów firm trzecich, a te dokładają kolejne zapytania kaskadowo (tag ładuje tag).
- Przeglądarka ma ograniczoną przepustowość na starcie; drobne zapytania konkurują z obrazem LCP i krytycznym CSS.

## Jak sprawdzić

Licznik zapytań na dole zakładki Network (z wyłączonym cache) oraz grupowanie po domenie w WebPageTest.

## Kod

```html title="Sprite SVG zamiast osobnych plików ikon"
<!-- One inline sprite instead of 20 separate icon requests -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="icon-pool" viewBox="0 0 24 24"><path d="M2 18c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/></symbol>
  <symbol id="icon-wifi" viewBox="0 0 24 24"><path d="M2 9a15 15 0 0 1 20 0M5 13a10 10 0 0 1 14 0M9 17a4 4 0 0 1 6 0"/></symbol>
</svg>

<ul class="amenities">
  <li><svg class="icon" aria-hidden="true"><use href="#icon-pool"></use></svg> Basen</li>
  <li><svg class="icon" aria-hidden="true"><use href="#icon-wifi"></use></svg> Wi-Fi</li>
</ul>
```

## Częste błędy

- Sklejanie wszystkiego w jeden ogromny bundle "żeby było mniej zapytań": przy HTTP/2 lepiej działa kilka sensownie podzielonych plików, które cache'ują się niezależnie.
