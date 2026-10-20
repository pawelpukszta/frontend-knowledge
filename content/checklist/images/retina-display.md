---
title: Obsługa ekranów high-DPI
priority: medium
---

Warianty 2x dla ekranów o dużej gęstości pikseli, ale bez przesady: 3x rzadko daje widoczną różnicę, a mocno zwiększa plik. Dla ikon i logo SVG.

## Dlaczego to ważne

- Większość współczesnych telefonów ma DPR 2-3; obraz w 1x wygląda na nich wyraźnie rozmyto, zwłaszcza logo i tekst na grafikach.
- Wariant 3x ma 2,25 raza więcej pikseli niż 2x, a różnica na zdjęciu jest dla oka praktycznie niezauważalna.
- SVG jest ostre przy każdej gęstości i zwykle lżejsze niż kilka rastrowych wariantów.

## Jak sprawdzić

Emulacja DPR 2 i 3 w trybie urządzenia DevTools; sprawdź `currentSrc` i ostrość logo oraz ikon.

## Kod

```html title="Obraz o stałym rozmiarze"
<!-- Fixed-size partner badge: density descriptors are enough -->
<img src="/img/badge-travelife-120.png"
     srcset="/img/badge-travelife-120.png 1x, /img/badge-travelife-240.png 2x"
     alt="Certyfikat Travelife Gold" width="120" height="60" />
```

```css title="Tło w CSS"
.newsletter {
  background-image: image-set(
    url("/img/newsletter-bg.webp") 1x,
    url("/img/newsletter-bg@2x.webp") 2x
  );
}
```

## Częste błędy

- Serwowanie zawsze wersji 2x także na ekranach 1x zamiast pozwolić przeglądarce wybrać.
