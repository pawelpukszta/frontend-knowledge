---
title: Favicon na każdej stronie
priority: medium
sources:
  - title: "Google: Define a favicon to show in search results"
    url: https://developers.google.com/search/docs/appearance/favicon-in-search
---

Kwadratowa ikona (1:1), najlepiej większa niż 48x48 px (minimum Google to 8x8 px), wskazana przez `<link rel="icon">` co najmniej na stronie głównej, pod stabilnym adresem dostępnym dla Googlebota i Googlebot-Image.

## Dlaczego to ważne

- Favicon widać obok adresu w wynikach Google; dzięki niemu strona jest rozpoznawalna wśród konkurencji.
- Ikona w kartach, zakładkach i na ekranie głównym telefonu (`apple-touch-icon`, manifest) ułatwia powrót do serwisu.
- Plik zablokowany w robots.txt albo zmieniający adres przy każdym deployu może się nie pojawić w wynikach; Google wymaga jednej ikony na hosta i stabilnego URL.

## Jak sprawdzić

Sprawdź `<link rel="icon">` na stronie głównej, kod 200 pliku, brak blokady w robots.txt; ikony PWA w DevTools (Application, Manifest).

## Kod

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"> <!-- 180x180 -->
<link rel="manifest" href="/site.webmanifest">
```

## Częste błędy

- Ikona z hashem w nazwie pliku zmieniającym się przy każdym buildzie.
- Prostokątne logo użyte jako favicon; Google wymaga proporcji 1:1.
