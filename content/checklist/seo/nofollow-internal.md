---
title: Bez nofollow na linkach wewnętrznych
priority: medium
---

`rel="nofollow"` wewnątrz własnej strony utrudnia odkrywanie i ocenę ważnych podstron. Do ukrywania stron służy noindex.

## Dlaczego to ważne

- Google traktuje nofollow jako wskazówkę; link z nofollow może nie zostać użyty ani do odkrycia, ani do oceny strony docelowej.
- "Rzeźbienie PageRanku" przez nofollow nie działa od lat: wartość nie przelewa się na pozostałe linki, po prostu przepada.
- Strony, których nie chcesz w indeksie (koszyk, logowanie), oznacz noindex; link do nich może pozostać zwykłym linkiem.

## Jak sprawdzić

Crawler: wewnętrzne linki z nofollow.

## Kod

```html title="Źle"
<nav>
  <a href="/wakacje/grecja" rel="nofollow">Grecja</a>
  <a href="/last-minute" rel="nofollow">Last minute</a>
  <a href="/logowanie" rel="nofollow">Zaloguj się</a>
</nav>
```

```html title="Dobrze"
<nav>
  <a href="/wakacje/grecja">Grecja</a>
  <a href="/last-minute">Last minute</a>
  <a href="/logowanie">Zaloguj się</a>
</nav>
<!-- On /logowanie itself -->
<meta name="robots" content="noindex" />
```

## Częste błędy

- Globalny nofollow w meta robots (`content="nofollow"`) skopiowany z szablonu stagingu.
