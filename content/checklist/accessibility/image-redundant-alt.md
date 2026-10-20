---
title: Bez zbędnych słów w alt
priority: low
---

Czytnik i tak ogłasza "grafika", więc "Zdjęcie hotelu..." czy "obrazek" w `alt` jest powtórzeniem. Alt nie powinien też powtarzać sąsiedniego podpisu ani tekstu linku.

## Dlaczego to ważne

- "Grafika, zdjęcie przedstawiające basen" to szum, który przy kilkudziesięciu zdjęciach w galerii realnie spowalnia przeglądanie.
- Gdy alt powtarza tekst obok (np. nazwę hotelu w karcie oferty), użytkownik słyszy tę samą informację dwa razy; wtedy obraz powinien mieć `alt=""`.
- Wyjątek: gdy forma jest informacją, słowa "zrzut ekranu", "mapa" czy "wykres" mają sens.

## Jak sprawdzić

axe (`image-redundant-alt`); przegląd altów w galeriach i kartach ofert.

## Kod

```html title="Źle"
<img src="/img/aegean-pool.avif" alt="Zdjęcie przedstawiające basen hotelu">
<a href="/oferta/1832">
  <img src="/img/aegean.avif" alt="Hotel Aegean Blue">
  Hotel Aegean Blue
</a>
```

```html title="Dobrze"
<img src="/img/aegean-pool.avif" alt="Basen z leżakami i widokiem na morze">
<a href="/oferta/1832">
  <img src="/img/aegean.avif" alt="">
  Hotel Aegean Blue
</a>
```

## Częste błędy

- Nazwa pliku jako alt (`alt="IMG_2041.jpg"`) generowana automatycznie przez CMS.
