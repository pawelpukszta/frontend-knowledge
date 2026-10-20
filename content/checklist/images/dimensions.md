---
title: Atrybuty width i height na obrazach
priority: high
sources:
  - title: "web.dev: Optimize Cumulative Layout Shift"
    url: https://web.dev/articles/optimize-cls
---

Każdy `<img>` ma `width` i `height` (proporcje naturalne); przeglądarka rezerwuje miejsce, zanim obraz się pobierze, co zapobiega CLS. W CSS `height: auto` zachowuje responsywność.

## Dlaczego to ważne

- Obraz bez wymiarów ma na początku wysokość 0; po pobraniu przesuwa tekst i przyciski w dół, a użytkownik klika nie w ten element, w który celował.
- CLS powyżej 0,1 (75. percentyl) to słaby wynik Core Web Vitals; obrazy bez wymiarów są jedną z najczęstszych przyczyn.
- Przeglądarki wyliczają z atrybutów domyślny `aspect-ratio`, więc działają one także przy płynnej szerokości z CSS.

## Jak sprawdzić

Lighthouse (obrazy bez jawnych wymiarów), panel Performance z zaznaczonymi przesunięciami układu; nagranie z throttlingiem sieci.

## Kod

```html title="Źle"
<img src="/img/oferta-kreta-800.webp" alt="Kreta, hotel Aegean Blue" class="offer-photo" />
```

```html title="Dobrze"
<img src="/img/oferta-kreta-800.webp" alt="Kreta, hotel Aegean Blue"
     width="800" height="533" class="offer-photo" />
<style>
  .offer-photo { width: 100%; height: auto; }
  /* Background images and embeds have no attributes: reserve space in CSS */
  .map-embed { aspect-ratio: 16 / 9; }
</style>
```

## Częste błędy

- Ustawienie w CSS `height` na sztywno bez `height: auto`, co zniekształca obraz przy zmianie szerokości.
- Wymiary niezgodne z proporcjami pliku; przesunięcie i tak wystąpi, choć mniejsze.
