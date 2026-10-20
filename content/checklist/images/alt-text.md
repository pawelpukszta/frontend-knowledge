---
title: Sensowny tekst alternatywny
priority: critical
sources:
  - title: "W3C WAI: An alt Decision Tree"
    url: https://www.w3.org/WAI/tutorials/images/decision-tree/
---

Każdy `<img>` ma `alt`: opis treści lub funkcji dla obrazów informacyjnych, pusty `alt=""` dla dekoracyjnych. Brak atrybutu sprawia, że czytnik ekranu odczytuje nazwę pliku lub adres.

## Dlaczego to ważne

- Bez `alt` czytnik ekranu ogłosi np. "IMG_4821 kropka jpg, grafika"; osoba niewidoma nie dowie się, że zdjęcie pokazuje basen hotelu ani że ikona to przycisk "Szukaj".
- Obraz będący jedyną treścią linku lub przycisku bez `alt` daje kontrolkę bez nazwy; to błąd WCAG 1.1.1 (poziom A), wymaganego m.in. przez European Accessibility Act.
- Google używa `alt` do zrozumienia obrazu i jego kontekstu, więc dobry opis wspiera też wyszukiwanie grafik.
- Tekst alternatywny wyświetla się, gdy obraz się nie pobierze (słaby zasięg, zablokowane obrazy), więc treść nadal jest zrozumiała.

## Jak sprawdzić

axe lub Lighthouse (reguła `image-alt`), przegląd z czytnikiem ekranu (NVDA, VoiceOver); w DevTools panel Accessibility pokazuje obliczoną nazwę obrazu.

## Kod

```html title="Decyzja o alt w praktyce"
<!-- Informative: describe what matters in this context -->
<img src="/img/hotel-kreta-basen.webp" alt="Basen bez brodzika z widokiem na morze, hotel Aegean Blue" width="800" height="533" />

<!-- Functional: describe the action, not the picture -->
<a href="/"><img src="/logo.svg" alt="Wakacje.pl: strona główna" width="140" height="32" /></a>
<button type="submit"><img src="/icons/search.svg" alt="Szukaj" width="20" height="20" /></button>

<!-- Decorative: empty alt, screen reader skips it -->
<img src="/img/wave-divider.svg" alt="" width="1200" height="40" />

<!-- Image of text: repeat the text -->
<img src="/promo/first-minute.png" alt="First Minute: do 30% taniej, rezerwuj do 31 stycznia" width="600" height="200" />
```

## Częste błędy

- Alt typu "obrazek", "zdjęcie" lub nazwa pliku; czytnik i tak ogłasza, że to grafika.
- Powtarzanie w `alt` tego samego tekstu, który stoi obok obrazu w podpisie lub nagłówku karty.
- Pominięcie atrybutu zamiast `alt=""` przy dekoracjach; to nie to samo.
