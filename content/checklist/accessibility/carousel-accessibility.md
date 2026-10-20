---
title: Dostępna karuzela
priority: medium
sources:
  - title: "W3C APG: Carousel Pattern"
    url: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
---

Autoprzewijanie ma przycisk pauzy (i zatrzymuje się przy focusie oraz hover), slajdy mają etykiety ("Slajd 2 z 5"), a przyciski poprzedni/następny są dostępne z klawiatury.

## Dlaczego to ważne

- WCAG 2.2.2 Pause, Stop, Hide (A): ruch startujący automatycznie i trwający dłużej niż 5 sekund musi dać się zatrzymać.
- Slajd zmieniający się w połowie czytania odbiera treść osobom czytającym wolniej i użytkownikom czytników, dlatego rotacja staje, gdy focus lub kursor jest w karuzeli.
- `aria-roledescription` i etykiety slajdów mówią, gdzie użytkownik jest; bez nich słyszy niepowiązane fragmenty ofert.
- Podczas autorotacji kontener ma `aria-live="off"`, po zatrzymaniu `polite`; inaczej czytnik ogłaszałby każdą automatyczną zmianę.

## Jak sprawdzić

Obsłuż karuzelę bez myszy i z czytnikiem ekranu; sprawdź, czy ukryte slajdy nie są osiągalne Tabem.

## Kod

```html
<section class="carousel" aria-roledescription="karuzela" aria-label="Oferty last minute">
  <button type="button" class="rotation" aria-label="Zatrzymaj automatyczne przewijanie">
    <svg aria-hidden="true">...</svg>
  </button>
  <button type="button" aria-controls="slides" aria-label="Poprzedni slajd">‹</button>
  <button type="button" aria-controls="slides" aria-label="Następny slajd">›</button>

  <div id="slides" aria-live="off">
    <div role="group" aria-roledescription="slajd" aria-label="1 z 5">
      <h3>Kreta, 7 nocy</h3><p>od 2 499 zł</p>
    </div>
    <div role="group" aria-roledescription="slajd" aria-label="2 z 5" hidden>...</div>
  </div>
</section>
```

```js
const carousel = document.querySelector(".carousel");
const slides = document.getElementById("slides");
let timer = setInterval(showNext, 6000);

function stopRotation() {
  clearInterval(timer);
  slides.setAttribute("aria-live", "polite"); // announce manual slide changes
}

// Stop when keyboard focus or the pointer enters, and for reduced motion users
carousel.addEventListener("focusin", stopRotation);
carousel.addEventListener("mouseenter", stopRotation);
if (matchMedia("(prefers-reduced-motion: reduce)").matches) stopRotation();
```

## Częste błędy

- Ukryte slajdy przesunięte tylko przez `transform`, ale nadal osiągalne Tabem; ukrywaj je przez `hidden` lub `inert`.
- Przycisk pauzy, który nie zmienia etykiety po zatrzymaniu ("Wznów automatyczne przewijanie").
