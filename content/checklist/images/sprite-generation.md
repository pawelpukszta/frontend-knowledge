---
title: Sprite'y tam, gdzie mają sens
priority: low
---

Łączenie wielu małych ikon w jeden plik zmniejsza liczbę zapytań. W nowych projektach zwykle lepszy jest sprite SVG (`<symbol>` + `<use>`) lub komponenty ikon; przy HTTP/2 i HTTP/3 zysk z rastrowych sprite'ów jest mniejszy.

## Dlaczego to ważne

- Sprite SVG to jeden plik cache'owany raz dla całego serwisu, a każda ikona dziedziczy kolor przez `currentColor` i skaluje się bez utraty jakości.
- Rastrowe sprite'y z `background-position` są trudne w utrzymaniu (każda zmiana przesuwa współrzędne) i nie mają dostępnej nazwy.
- Przy HTTP/2 wiele małych plików nie jest już tak kosztowne jak przy HTTP/1.1, więc sprite ma sens głównie dla dużych zestawów ikon.

## Jak sprawdzić

Liczba zapytań o drobne ikony w Network (filtr Img i SVG); sprawdź, czy sprite jest cache'owany.

## Kod

```html title="Sprite SVG z symbol i use"
<!-- /icons/sprite.svg -->
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-plane" viewBox="0 0 24 24">
    <path fill="currentColor" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
  </symbol>
  <symbol id="icon-pool" viewBox="0 0 24 24"><!-- ... --></symbol>
</svg>

<!-- Usage: decorative icon next to visible text -->
<span class="feature">
  <svg class="icon" aria-hidden="true" width="20" height="20"><use href="/icons/sprite.svg#icon-plane" /></svg>
  Przelot w cenie
</span>
```

## Częste błędy

- Sprite z setkami ikon, z których strona używa trzech.
