---
title: Prawdziwy tekst zamiast tekstu na obrazkach
priority: low
sources:
  - title: "W3C Understanding 1.4.5: Images of Text"
    url: https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html
---

Tekst w grafice nie skaluje się, nie zmienia kontrastu, nie tłumaczy się i nie jest indeksowany jak zwykły tekst. Używaj prawdziwego tekstu na tle grafiki. Wyjątek: logotypy. WCAG 1.4.5 (AA).

## Dlaczego to ważne

- Tekst w grafice pikselizuje się przy zoomie i nie reaguje na preferencje użytkownika: tryb wysokiego kontrastu, własne kolory, odstępy między wierszami.
- Nie da się go przetłumaczyć automatycznie, skopiować ani wyszukać na stronie (Ctrl+F).
- Każda zmiana ceny czy daty promocji wymaga nowej grafiki zamiast szybkiej edycji tekstu w CMS.

## Jak sprawdzić

Przejrzyj banery i grafiki promocyjne; spróbuj zaznaczyć tekst myszą i powiększyć stronę do 200%.

## Kod

```html
<!-- Bad: price and dates baked into the banner -->
<img src="/banners/kreta-promo.jpg" alt="Kreta od 2 499 zł, wyloty od 1 maja">

<!-- Good: real text over a decorative photo -->
<section class="promo">
  <img src="/banners/kreta-bg.avif" alt="" class="promo__bg">
  <h2>Kreta od 2 499 zł</h2>
  <p>Wyloty od 1 maja z Warszawy i Katowic</p>
</section>
```

```css
.promo { position: relative; isolation: isolate; padding: 2rem; color: #fff; }
.promo__bg { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; object-fit: cover; }
/* Dark overlay keeps text contrast stable whatever the photo */
.promo::after { content: ""; position: absolute; inset: 0; z-index: -1; background: rgb(0 0 0 / 0.5); }
```

## Częste błędy

- Cały baner jako obraz z długim altem zamiast tekstu w HTML.
