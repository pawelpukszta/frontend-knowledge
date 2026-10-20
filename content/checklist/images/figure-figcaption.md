---
title: figure i figcaption dla podpisów
priority: medium
sources:
  - title: "MDN: The figure element"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure
---

Obraz z podpisem umieść w `<figure>` z `<figcaption>`; podpis jest wtedy semantycznie powiązany z obrazem i staje się dostępną nazwą całej figury.

## Dlaczego to ważne

- Czytnik ekranu ogłasza figurę i jej podpis razem, więc użytkownik wie, że "Widok z balkonu pokoju typu Superior" opisuje właśnie to zdjęcie, a nie sąsiedni akapit.
- Zwykły `<p>` pod obrazem jest tylko wizualnie blisko; po zmianie układu (np. na mobile) lub w trybie czytania powiązanie znika.
- `<figure>` nadaje się też do wykresów, fragmentów kodu i cytatów, dając spójny wzorzec dla całego CMS.

## Jak sprawdzić

Przegląd DOM galerii i artykułów; w panelu Accessibility w DevTools figura powinna mieć nazwę z `figcaption`.

## Kod

```html
<figure class="gallery-item">
  <img
    src="/img/hotel-kreta-pokoj-superior.webp"
    alt="Dwuosobowy pokój z balkonem i widokiem na zatokę"
    width="1200" height="800" loading="lazy" />
  <figcaption>Pokój Superior z widokiem na morze, dopłata 120 zł za noc.</figcaption>
</figure>
```

## Częste błędy

- Kopiowanie całego podpisu do `alt`; `alt` opisuje obraz, podpis dodaje kontekst.
- Używanie `<figure>` dla każdego obrazka, także dekoracyjnych ikon bez podpisu.
