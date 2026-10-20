---
title: Lazy loading obrazów poza ekranem
priority: high
sources:
  - title: "web.dev: Browser-level image lazy loading for the web"
    url: https://web.dev/articles/browser-level-image-lazy-loading
---

`loading="lazy"` dla obrazów poniżej zgięcia (galerie, listy ofert, stopka); nigdy dla obrazu LCP i obrazów widocznych od razu.

## Dlaczego to ważne

- Lista 40 ofert bez lazy loadingu pobiera wszystkie miniatury od razu, konkurując o łącze z obrazem hero i skryptami.
- Natywny `loading="lazy"` działa we wszystkich głównych przeglądarkach i nie wymaga JavaScriptu ani bibliotek.
- Lazy loading na obrazie LCP opóźnia go, bo przeglądarka czeka z pobraniem do wyliczenia układu; to częsty powód regresji LCP po "optymalizacji".

## Jak sprawdzić

Network podczas przewijania: obrazy z dołu strony powinny pojawiać się dopiero przy zbliżaniu się do nich; sprawdź, że obraz LCP nie ma `loading="lazy"`.

## Kod

```html title="Źle"
<!-- Hero lazy-loaded: delays LCP -->
<img src="/img/hero.avif" alt="Plaża na Krecie" width="1600" height="900" loading="lazy" />
```

```html title="Dobrze"
<img src="/img/hero.avif" alt="Plaża na Krecie" width="1600" height="900" fetchpriority="high" />

<ul class="offers">
  <li>
    <img src="/img/oferta-rodos-400.webp" alt="Rodos, hotel Lindos Bay"
         width="400" height="267" loading="lazy" decoding="async" />
  </li>
  <!-- ...more offers below the fold -->
</ul>
```

## Częste błędy

- Lazy loading bez `width` i `height`; obrazy pojawiające się w trakcie przewijania przesuwają treść.
