---
title: AVIF dla nowoczesnych przeglądarek
priority: medium
---

AVIF daje zwykle najlepszą kompresję zdjęć, ale koduje się wolniej niż WebP. Umieść go jako pierwsze źródło w `<picture>` przed WebP lub pozwól wybrać go CDN obrazów.

## Dlaczego to ważne

- Przy tej samej jakości AVIF bywa wyraźnie mniejszy od WebP, szczególnie dla dużych zdjęć z gładkimi gradientami (niebo, morze), czyli typowych zdjęć wakacyjnych.
- Wszystkie aktualne przeglądarki (Chrome, Firefox, Safari 16+, Edge 121+) obsługują AVIF, więc zysk dotyczy większości użytkowników.
- Kodowanie AVIF jest kilka razy wolniejsze, dlatego konwertuj w buildzie lub z cache na CDN, a nie przy każdym żądaniu.

## Jak sprawdzić

Network w Chrome: obraz powinien mieć typ `avif`; porównaj rozmiar z wersją WebP i oceń jakość wizualnie przy 100% powiększenia.

## Kod

```html title="Kolejność źródeł"
<picture>
  <!-- The browser takes the first source it supports -->
  <source srcset="/img/hero-santorini.avif" type="image/avif" />
  <source srcset="/img/hero-santorini.webp" type="image/webp" />
  <img src="/img/hero-santorini.jpg" alt="Białe domy Santorini nad zatoką o zachodzie słońca"
       width="1600" height="900" fetchpriority="high" />
</picture>
```

```css title="Tło w CSS"
.promo-banner {
  background-image: image-set(
    url("/img/promo-bg.avif") type("image/avif"),
    url("/img/promo-bg.webp") type("image/webp"),
    url("/img/promo-bg.jpg") type("image/jpeg")
  );
  background-size: cover;
}
```

## Częste błędy

- Zbyt niska jakość AVIF (artefakty rozmycia na twarzach i tekstach) w pogoni za rozmiarem.
