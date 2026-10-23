---
title: "Responsywność: media queries, container queries, jednostki"
level: mid
added: 2026-10-20
tags:
  - responsive
  - media queries
  - container queries
  - clamp
  - rem
summary: Media queries reagują na viewport, container queries na rozmiar kontenera komponentu. Płynne jednostki (rem, %, clamp, dvh) zmniejszają liczbę breakpointów.
sources:
  - title: "MDN: CSS container queries"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
  - title: "MDN: Using media queries"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
  - title: "web.dev: Learn Responsive Design"
    url: https://web.dev/learn/design
---

## Wyjaśnienie

- **Mobile-first**: style bazowe dla małych ekranów, `@media (min-width: ...)` dla większych.
- **Container queries** (`container-type: inline-size` + `@container`): komponent (np. karta oferty) dopasowuje się do miejsca, w którym go umieszczono, a nie do szerokości okna. Idealne dla design systemów.
- **Jednostki**: `rem` (względem root font-size, szanuje ustawienia użytkownika), `em`, `%`, `vw/vh`, `dvh/svh` (poprawne na mobile z paskiem przeglądarki), `ch`.
- **`clamp(min, preferred, max)`**: płynna typografia i odstępy.
- Media features: `prefers-color-scheme`, `prefers-reduced-motion`, `hover`, `pointer`.

## Kod

```css
.card-wrapper { container-type: inline-size; }

.card { display: grid; gap: 12px; }
@container (min-width: 480px) {
  .card { grid-template-columns: 200px 1fr; } /* image beside text when the slot is wide */
}

h1 { font-size: clamp(1.75rem, 1.2rem + 2vw, 3rem); }

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

## Pytania

### Czym różnią się container queries od media queries? {#css-responsive-q1}

Media queries sprawdzają cechy viewportu lub urządzenia. Container queries sprawdzają rozmiar najbliższego kontenera z `container-type`, więc ten sam komponent może mieć inny układ w wąskim sidebarze i w szerokiej sekcji głównej.

### Dlaczego rem zamiast px dla fontów? {#css-responsive-q2}

`rem` skaluje się z ustawieniem rozmiaru czcionki w przeglądarce użytkownika, co jest ważne dla dostępności. Piksele ignorują to ustawienie.

## Quiz

### Komponent karty ma zmieniać układ zależnie od szerokości miejsca, w którym go wstawiono. Użyjesz: {#css-responsive-z1}

- [ ] Media queries
- [x] Container queries
- [ ] Flexbox wrap
- [ ] vw

Container queries reagują na rozmiar kontenera, nie viewportu.
