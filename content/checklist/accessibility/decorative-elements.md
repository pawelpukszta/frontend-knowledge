---
title: Ukryj elementy dekoracyjne przed technologiami asystującymi
priority: medium
---

Ozdobne obrazy dostają `alt=""`, ikony SVG obok tekstu `aria-hidden="true"`, a czysto wizualne tła trafiają do CSS. Dzięki temu czytnik nie zaśmieca odczytu nazwami plików i ikon.

## Dlaczego to ważne

- Obraz bez atrybutu `alt` czytnik potrafi ogłosić nazwą pliku ("hero bg final v2 webp"), co wydłuża i zaśmieca przejście przez stronę.
- Ikona telefonu obok tekstu "Zadzwoń" bez `aria-hidden` bywa odczytywana jako "obraz" lub dubluje etykietę.
- Pusty `alt=""` to jawna informacja, że obraz jest ozdobny; brak atrybutu `alt` to błąd WCAG 1.1.1 (A).

## Jak sprawdzić

Przejdź stronę czytnikiem ekranu i sprawdź, czy nie odczytuje ozdobników; axe zgłosi obrazy bez `alt` (reguła `image-alt`).

## Kod

```html title="Źle"
<img src="/img/wave-divider.svg">
<a href="tel:+48221234567"><svg viewBox="0 0 24 24"><title>phone icon</title>...</svg> Zadzwoń</a>
```

```html title="Dobrze"
<img src="/img/wave-divider.svg" alt="">
<a href="tel:+48221234567">
  <svg viewBox="0 0 24 24" aria-hidden="true">...</svg> Zadzwoń
</a>
<!-- Purely visual backgrounds belong in CSS -->
<div class="hero" style="background-image: url(/img/palms.avif)"></div>
```

## Częste błędy

- `alt="obrazek"` lub `alt="dekoracja"`; czytnik i tak to przeczyta.
- Ukrycie ikony niosącej informację (np. "bez możliwości zwrotu" pokazane tylko ikoną) tylko dlatego, że jest mała.
