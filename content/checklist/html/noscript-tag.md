---
title: Treść zastępcza w noscript
priority: medium
---

Gdy JS jest wyłączony lub zablokowany, `<noscript>` informuje użytkownika, co zrobić. Kluczowa treść powinna być jednak w HTML z serwera (SSR).

## Dlaczego to ważne

- Pusta strona bez komunikatu wygląda na awarię serwisu; `noscript` przynajmniej podpowiada alternatywę, np. telefon do biura.
- Google renderuje JavaScript, ale treść obecna w HTML z serwera jest indeksowana szybciej i pewniej; `noscript` nie zastąpi SSR.
- `noscript` nie pomoże, gdy JS jest włączony, ale się nie wykonał (błąd w bundlu, zablokowany CDN, zerwane połączenie); na to potrzebny jest SSR i obsługa błędów.

## Jak sprawdzić

Wyłącz JavaScript w DevTools (Command Menu: Disable JavaScript) i odśwież stronę.

## Kod

```html
<body>
  <noscript>
    <p class="notice">
      Wyszukiwarka ofert wymaga JavaScriptu. Możesz też zarezerwować wyjazd telefonicznie:
      <a href="tel:+48221234567">22 123 45 67</a>.
    </p>
  </noscript>
  <!-- Key content is server-rendered, so it is readable without JS -->
  <main id="main">...</main>
</body>
```

## Częste błędy

- Cała aplikacja renderowana tylko po stronie klienta, a w `noscript` jedynie "Włącz JavaScript".
