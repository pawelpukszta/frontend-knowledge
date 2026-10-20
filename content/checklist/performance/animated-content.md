---
title: Wideo zamiast animowanych GIF-ów
priority: medium
sources:
  - title: "web.dev: Replace animated GIFs with video"
    url: https://web.dev/articles/replace-gifs-with-videos
---

GIF jest wielokrotnie większy od odpowiadającego mu MP4 lub WebM. Zamiast GIF-a użyj `<video autoplay muted loop playsinline>` albo animowanego AVIF/WebP.

## Dlaczego to ważne

- Kilkusekundowy GIF może ważyć kilka MB, a ten sam klip w MP4 lub WebM zwykle kilkanaście razy mniej.
- GIF ma tylko 256 kolorów, więc przy większym rozmiarze wygląda gorzej niż wideo.
- Element `<video>` daje kontrolę: można zatrzymać animację dla osób z `prefers-reduced-motion` i nie ładować jej poza ekranem.

## Jak sprawdzić

Insight dotyczący dostarczania obrazów w Lighthouse (animowana treść jako wideo), filtr Img w Network i rozmiar plików `.gif`.

## Kod

```html title="Dobrze"
<video autoplay muted loop playsinline width="480" height="270"
       poster="/media/booking-demo-poster.webp" aria-label="Jak zarezerwować pokój w 3 krokach">
  <source src="/media/booking-demo.webm" type="video/webm">
  <source src="/media/booking-demo.mp4" type="video/mp4">
</video>
```

```bash title="Konwersja GIF na MP4 i WebM"
ffmpeg -i booking-demo.gif -movflags +faststart -pix_fmt yuv420p \
  -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" booking-demo.mp4
ffmpeg -i booking-demo.gif -c:v libvpx-vp9 -b:v 0 -crf 41 booking-demo.webm
```

## Częste błędy

- Brak `muted` i `playsinline`: przeglądarki mobilne nie uruchomią wtedy autoodtwarzania.
