---
title: Napisy do nagrań wideo
priority: high
sources:
  - title: "W3C Understanding 1.2.2: Captions (Prerecorded)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html
---

Nagrane wideo z dźwiękiem ma zsynchronizowane napisy (`<track kind="captions">`), także z opisem istotnych dźwięków i oznaczeniem mówiących. Automatyczne napisy wymagają korekty przez człowieka.

## Dlaczego to ważne

- Napisów potrzebują osoby głuche i niedosłyszące, ale też każdy, kto ogląda na telefonie bez dźwięku: w komunikacji miejskiej, w biurze, przy śpiącym dziecku.
- To WCAG 1.2.2 (poziom A); brak napisów to jeden z najczęstszych zarzutów w audytach zgodności z European Accessibility Act.
- Plik WebVTT to zwykły tekst: łatwo go przetłumaczyć, przeszukać i opublikować jako transkrypcję, która pomaga też SEO.

## Jak sprawdzić

Włącz napisy w odtwarzaczu i sprawdź ich poprawność, synchronizację oraz obecność opisów dźwięków; w Network upewnij się, że plik `.vtt` ładuje się bez błędu CORS.

## Kod

```html
<video controls preload="metadata" poster="/img/hotel-tour.avif">
  <source src="/video/hotel-tour.mp4" type="video/mp4">
  <track kind="captions" src="/video/hotel-tour.pl.vtt" srclang="pl" label="Polski" default>
  <track kind="subtitles" src="/video/hotel-tour.en.vtt" srclang="en" label="English">
</video>
```

```txt title="hotel-tour.pl.vtt"
WEBVTT

00:00:01.000 --> 00:00:04.000
<v Rezydentka>Witamy w hotelu Aegean Blue na Krecie.

00:00:04.500 --> 00:00:07.000
[szum fal i spokojna muzyka gitarowa]

00:00:07.200 --> 00:00:11.000
<v Rezydentka>Basen jest otwarty od 8:00 do 20:00.
```

## Częste błędy

- Plik VTT z innej domeny bez nagłówków CORS i atrybutu `crossorigin` na `video`: przeglądarka go nie załaduje.
- `kind="subtitles"` zamiast `captions` dla głównego języka: subtitles to tłumaczenie dialogów, captions zawierają też dźwięki.
- Opublikowanie automatycznych napisów bez korekty nazw własnych, cen i dat.
