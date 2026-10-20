---
title: Obrazy neutralne kulturowo
priority: low
---

Domyślnie ikony i grafiki bez znaczeń regionalnych (gesty, lokalne symbole, flagi zamiast nazw języków, tekst wtopiony w obraz), a warianty lokalne tylko tam, gdzie mają znaczenie, np. zdjęcia, waluta, wzory dokumentów.

## Dlaczego to ważne

- Gesty takie jak "OK" czy uniesiony kciuk bywają w niektórych kulturach obraźliwe, a lokalne symbole (np. amerykańska skrzynka pocztowa) nie są wszędzie czytelne.
- Tekst wpisany w grafikę (baner "Grecja do -30%") trzeba osobno przygotować dla każdego języka; nie przeczyta go czytnik ekranu ani wyszukiwarka i nie da się go przetłumaczyć.
- Flaga oznacza państwo, nie język: po hiszpańsku mówi się też w Meksyku, po angielsku nie tylko w Wielkiej Brytanii; w przełączniku lepiej użyć nazwy języka w tym języku ("Deutsch", "Español").
- Ikony kierunkowe (strzałki, "wstecz") w językach zapisywanych od prawej do lewej muszą być odwrócone.

## Jak sprawdzić

Przegląd grafik i ikon przy dodawaniu nowego rynku; wyszukaj obrazy z tekstem (np. banery w CMS) i sprawdź ikony kierunkowe z `dir="rtl"`.

## Kod

```html
<!-- Text in HTML, not baked into the image: translatable and readable by screen readers -->
<section class="promo">
  <img src="/img/santorini.avif" alt="" width="1200" height="600" />
  <h2 class="promo__title">Grecja do -30%</h2>
</section>

<!-- Language switcher: language names in their own language, not flags -->
<nav aria-label="Język">
  <a href="/en/" hreflang="en" lang="en">English</a>
  <a href="/de/" hreflang="de" lang="de">Deutsch</a>
</nav>
```

```css
/* Mirror directional icons in right-to-left languages */
.icon-chevron:dir(rtl) { transform: scaleX(-1); }
```

## Częste błędy

- Zrzuty ekranu interfejsu z polskimi napisami w wersji angielskiej serwisu.
