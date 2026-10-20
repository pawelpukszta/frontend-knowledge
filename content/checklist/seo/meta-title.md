---
title: Opisowy tytuł strony
priority: high
---

`<title>` opisuje treść strony, ma główną frazę na początku i krótką nazwę marki na końcu; orientacyjnie 50-60 znaków, bo Google przycina tytuł do szerokości ekranu. To najważniejszy pojedynczy element on-page dla wyników wyszukiwania.

## Dlaczego to ważne

- Tytuł jest głównym źródłem linku tytułowego w wynikach Google i nazwą karty w przeglądarce; decyduje o tym, czy ktoś kliknie.
- Google przepisuje tytuły zbyt długie, szablonowe lub upchane słowami kluczowymi; bierze wtedy tekst z H1, `og:title` albo z kotwic linków.
- Czytnik ekranu ogłasza tytuł jako pierwszy po załadowaniu strony; to też wymóg WCAG 2.4.2 Page Titled.

## Jak sprawdzić

Crawler (długość, brak, duplikaty), podgląd w symulatorze wyników, a w Search Console strony z wysoką liczbą wyświetleń i niskim CTR.

## Kod

```html
<!-- Bad: brand first, vague, stuffed with keywords -->
<title>Example Travel | Wakacje | Tanie wakacje | Wczasy | Last minute</title>

<!-- Good: topic first, specific, brand at the end (about 55 characters) -->
<title>Wakacje na Krecie all inclusive 2027 | Example Travel</title>
```

```tsx title="app/layout.tsx"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Example Travel', // child pages set only their own part
    default: 'Example Travel: wakacje i wycieczki z wylotem z Polski',
  },
};
```

## Częste błędy

- Ten sam tytuł na wszystkich widokach SPA, bo nikt nie aktualizuje go przy zmianie trasy.
