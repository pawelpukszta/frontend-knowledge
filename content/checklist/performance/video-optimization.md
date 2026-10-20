---
title: Zoptymalizowane wideo
priority: high
---

Wideo jest skompresowane, w nowoczesnych kodekach (AV1, VP9, z H.264 jako zapasem), w rozdzielczości dopasowanej do ekranu, z plakatem i `preload="none"` lub `metadata` dla wideo, które nie startuje od razu.

## Dlaczego to ważne

- Kilkunastosekundowy film w tle hero potrafi ważyć więcej niż cała reszta strony; na telefonie z limitem danych to realny koszt dla użytkownika.
- AV1 przy tej samej jakości jest zwykle wyraźnie mniejszy niż H.264, a przeglądarki bez wsparcia po prostu wybiorą kolejne `<source>`.
- Plakat z wymiarami zapobiega przesunięciom układu i daje treść do wyświetlenia, zanim wideo się załaduje (a plakat może być elementem LCP).

## Jak sprawdzić

Rozmiar plików wideo w Network (filtr Media), sprawdzenie, czy wideo poniżej zgięcia nie pobiera się przy starcie strony.

## Kod

```html
<video controls preload="none" width="1280" height="720"
       poster="/video/hotel-tour-poster.avif">
  <source src="/video/hotel-tour-720p.av1.mp4" type='video/mp4; codecs="av01.0.05M.08"'>
  <source src="/video/hotel-tour-720p.vp9.webm" type="video/webm; codecs=vp9">
  <source src="/video/hotel-tour-720p.h264.mp4" type="video/mp4">
  <track kind="captions" src="/video/hotel-tour.pl.vtt" srclang="pl" label="Polski">
</video>
```

```bash title="Kodowanie AV1 i H.264 z ffmpeg"
ffmpeg -i tour.mov -vf scale=-2:720 -c:v libsvtav1 -crf 35 -preset 6 -an hotel-tour-720p.av1.mp4
ffmpeg -i tour.mov -vf scale=-2:720 -c:v libx264 -crf 24 -preset slow -an -movflags +faststart hotel-tour-720p.h264.mp4
```

## Częste błędy

- Wysyłanie pliku 4K do wszystkich urządzeń, także telefonów o szerokości 390 px.
- Dłuższe filmy hostowane jako jeden plik MP4 zamiast streamingu adaptacyjnego (HLS/DASH) lub zewnętrznej platformy wideo.
