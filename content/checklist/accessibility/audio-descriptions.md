---
title: Audiodeskrypcja do wideo
priority: medium
sources:
  - title: "W3C Understanding 1.2.5: Audio Description (Prerecorded)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html
---

Jeśli ważne informacje są przekazane tylko obrazem (tekst na ekranie, ceny, mapy, zmiany scen), wideo potrzebuje audiodeskrypcji lub pełnej transkrypcji tekstowej, która opisuje również to, co widać.

## Dlaczego to ważne

- Niewidomy usłyszy tylko muzykę w spocie, w którym nazwa hotelu i cena "od 2 499 zł" pojawiają się wyłącznie jako napis na obrazie.
- WCAG 1.2.3 (A) dopuszcza audiodeskrypcję albo alternatywę tekstową, ale 1.2.5 (AA) wymaga już audiodeskrypcji dla nagranego wideo.
- Najtaniej zaplanować to przy scenariuszu: jeśli lektor mówi to, co pokazuje obraz, osobna ścieżka audiodeskrypcji nie jest potrzebna.

## Jak sprawdzić

Obejrzyj wideo z wyłączonym obrazem (lub zamkniętymi oczami): czy rozumiesz cały przekaz, łącznie z cenami, datami i nazwami?

## Kod

```html
<figure>
  <video controls preload="metadata" poster="/img/kreta-promo.avif">
    <source src="/video/kreta-promo.mp4" type="video/mp4">
    <track kind="captions" src="/video/kreta-promo.pl.vtt" srclang="pl" label="Polski" default>
  </video>
  <figcaption>
    Spot: Kreta, sezon 2027.
    <a href="/video/kreta-promo-ad.mp4">Wersja z audiodeskrypcją</a>,
    <a href="/transkrypcje/kreta-promo">pełna transkrypcja z opisem obrazu</a>.
  </figcaption>
</figure>
```

## Częste błędy

- `<track kind="descriptions">` jako jedyne rozwiązanie: przeglądarki i czytniki ekranu praktycznie go nie odczytują.
- Transkrypcja zawierająca tylko dialogi, bez opisu tego, co dzieje się na ekranie.
