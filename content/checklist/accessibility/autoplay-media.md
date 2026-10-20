---
title: Brak automatycznego odtwarzania z dźwiękiem
priority: high
sources:
  - title: "W3C Understanding 1.4.2: Audio Control"
    url: https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html
---

Dźwięk nie startuje sam. Jeśli coś gra automatycznie dłużej niż 3 s, musi mieć pauzę, stop lub regulację głośności niezależną od systemu (WCAG 1.4.2); ruchome, migające lub przewijające się treści trwające ponad 5 s muszą dać się zatrzymać lub ukryć (2.2.2).

## Dlaczego to ważne

- Dźwięk startujący sam zagłusza czytnik ekranu; niewidomy użytkownik nie słyszy komunikatów, więc nie potrafi nawet znaleźć przycisku pauzy.
- Chrome, Safari i Firefox i tak blokują autoodtwarzanie z dźwiękiem bez interakcji użytkownika: wideo u większości nie ruszy, a `play()` zwróci odrzuconą obietnicę.
- Karuzele i animowane tła rozpraszają osoby z ADHD i zaburzeniami poznawczymi; 1.4.2 i 2.2.2 to kryteria poziomu A, czyli absolutne minimum.

## Jak sprawdzić

Wejdź na stronę z włączonym dźwiękiem i czytnikiem ekranu: nic nie powinno zagrać samo, a każda animacja, karuzela lub wideo w tle dłuższe niż 5 s ma widoczny przycisk pauzy dostępny z klawiatury.

## Kod

```html title="Dobrze"
<!-- Muted background video with a visible, keyboard-accessible pause control -->
<video id="hero" autoplay muted loop playsinline poster="/img/zakynthos-poster.avif">
  <source src="/video/zakynthos.mp4" type="video/mp4">
</video>
<button type="button" id="hero-toggle">Zatrzymaj wideo</button>
```

```js
const video = document.querySelector('#hero');
const toggle = document.querySelector('#hero-toggle');
const sync = () => { toggle.textContent = video.paused ? 'Odtwórz wideo' : 'Zatrzymaj wideo'; };

// Respect users who asked the OS for reduced motion
if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
sync();

toggle.addEventListener('click', () => {
  video.paused ? video.play() : video.pause();
  sync();
});
```

## Częste błędy

- Pauza dostępna tylko po najechaniu myszą na wideo albo ukryta w menu kontekstowym.
- Wyciszone autoodtwarzanie bez przycisku pauzy: dźwięku nie ma, ale ruch dłuższy niż 5 s nadal trzeba móc zatrzymać.
