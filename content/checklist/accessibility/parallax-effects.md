---
title: Zapewnij alternatywę dla efektów paralaksy
priority: medium
---

Paralaksa i ruch tła przy przewijaniu wywołują u części osób zawroty głowy i nudności. Przy `prefers-reduced-motion: reduce` warstwy powinny przewijać się razem z treścią, a efekt nie może być jedynym sposobem pokazania informacji.

## Dlaczego to ważne

- Różna prędkość warstw podczas przewijania to dokładnie ten rodzaj ruchu, który najczęściej wywołuje objawy u osób z zaburzeniami przedsionkowymi; paralaksa jest przykładem omawianym wprost w WCAG 2.3.3.
- Paralaksa liczona w JS w zdarzeniu `scroll` obciąża główny wątek i szarpie na słabszych telefonach; scroll-driven animations w CSS działają poza głównym wątkiem.
- Treść ujawniana dopiero przez efekt (tekst wjeżdżający przy przewijaniu) musi być widoczna także wtedy, gdy animacja jest wyłączona.

## Jak sprawdzić

Sprawdź stronę z emulacją reduced motion; tło nie powinno się poruszać niezależnie od treści, a cała treść musi być widoczna.

## Kod

```css title="Paralaksa tylko bez reduced motion"
.hero { position: relative; overflow: clip; }
.hero__bg { position: absolute; inset: -10% 0; background: url("/img/santorini.avif") center / cover; }

/* Parallax only for users who did not ask for less motion */
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    .hero__bg {
      animation: hero-parallax linear both;
      animation-timeline: scroll(root);
      animation-range: 0 100vh;
    }
    @keyframes hero-parallax { to { transform: translateY(20%); } }
  }
}
```

## Częste błędy

- Ciężki handler `scroll` z `getBoundingClientRect()` w każdej klatce zamiast animacji sterowanej przewijaniem.
- Tekst nagłówka ukryty (`opacity: 0`) do momentu odpalenia animacji; przy wyłączonym ruchu nigdy się nie pojawia.
