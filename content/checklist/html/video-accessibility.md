---
title: Dostępne wideo
priority: high
---

Napisy (`<track>`), audiodeskrypcja lub transkrypcja, sterowanie z klawiatury, brak autoodtwarzania z dźwiękiem.

## Dlaczego to ważne

- Napisy (WCAG 1.2.2) oraz audiodeskrypcja lub transkrypcja (1.2.3, 1.2.5) obsługują osoby głuche i niewidome; transkrypcję odczyta też monitor brajlowski i zaindeksuje Google.
- Własne odtwarzacze często mają `div` zamiast przycisków: nie da się ich obsłużyć klawiaturą, a czytnik nie ogłasza "Odtwórz" ani głośności.
- Atrybut `controls` daje natywne, dostępne z klawiatury sterowanie bez pisania kodu.

## Jak sprawdzić

Obsługa odtwarzacza klawiaturą (Tab, Spacja, strzałki) i czytnikiem; sprawdź napisy i brak autoodtwarzania z dźwiękiem.

## Kod

```html
<figure>
  <video controls preload="metadata" playsinline poster="/img/hotel-tour.avif">
    <source src="/video/hotel-tour.webm" type="video/webm">
    <source src="/video/hotel-tour.mp4" type="video/mp4">
    <track kind="captions" src="/video/hotel-tour.pl.vtt" srclang="pl" label="Polski" default>
  </video>
  <figcaption>
    Wirtualny spacer po hotelu Aegean Blue (2:14).
    <a href="/transkrypcje/aegean-blue">Transkrypcja z opisem obrazu</a>
  </figcaption>
</figure>
```

## Częste błędy

- Własne przyciski odtwarzacza bez nazw dostępnych (czytnik ogłasza tylko "przycisk").
- Autoodtwarzanie z dźwiękiem w karuzeli ofert.
