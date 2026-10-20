---
title: Elementy niechowane przez blokery
priority: low
---

Klasy i ID typu `.ad`, `.ads`, `.banner`, `.sponsor`, `#ad` mogą zostać ukryte przez listy filtrów, także gdy nie są reklamą (np. baner promocyjny oferty). Używaj nazw opisujących treść.

## Dlaczego to ważne

- Listy filtrów (EasyList i pochodne) ukrywają elementy po nazwach klas, ID i adresach obrazów, niezależnie od tego, co faktycznie zawierają.
- Ukryty może zostać kluczowy element: baner z kodem rabatowym, wyróżniona oferta "sponsorowana" przez hotel czy obrazek z adresu `/ads/`.
- Problem jest niewidoczny w testach zespołu bez blokera, a dotyka części realnych użytkowników.

## Jak sprawdzić

Przegląd strony z uBlock Origin (EasyList); porównanie wyglądu kluczowych stron z blokerem i bez niego.

## Kod

```html title="Źle"
<div class="ad-banner">
  <img src="/ads/first-minute.webp" alt="First Minute: do 30% taniej" width="1200" height="300" />
</div>
```

```html title="Dobrze"
<section class="promo-hero" aria-labelledby="fm-title">
  <h2 id="fm-title">First Minute: do 30% taniej</h2>
  <img src="/img/promo/first-minute.webp" alt="" width="1200" height="300" />
</section>
```

## Częste błędy

- Nazwy plików i katalogów typu `banner_728x90.jpg` lub `/advert/`, które również trafiają na listy filtrów.
