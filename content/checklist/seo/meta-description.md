---
title: Meta description na każdej stronie
priority: high
---

Unikalny, zachęcający do kliknięcia opis zawartości, orientacyjnie 120-160 znaków (Google nie ma sztywnego limitu, przycina do szerokości ekranu). Nie wpływa bezpośrednio na ranking, ale na CTR; Google może go zastąpić fragmentem treści.

## Dlaczego to ważne

- Opis działa jak reklama strony w wynikach: konkret (cena, termin, liczba ofert) przyciąga kliknięcia bardziej niż ogólnik.
- Google używa meta description, gdy lepiej opisuje stronę niż fragment treści; dobry opis daje kontrolę nad pierwszym wrażeniem.
- Opis bywa używany jako zapas w podglądach linków w komunikatorach, gdy brakuje `og:description`.

## Jak sprawdzić

Crawler: brakujące, za krótkie, za długie i zduplikowane opisy; podgląd w symulatorze wyników wyszukiwania.

## Kod

```html
<!-- Bad: generic, no specifics, same on every page -->
<meta name="description" content="Wakacje, wczasy, wycieczki. Najlepsze oferty. Zapraszamy!">

<!-- Good: specific and unique, about 150 characters -->
<meta name="description" content="Wakacje na Krecie all inclusive od 2499 zł/os. 214 hoteli, wyloty z 9 miast, pokoje rodzinne i transfer w cenie. Sprawdź terminy na wrzesień.">
```

```tsx title="app/wakacje/[country]/page.tsx"
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const s = await getCountryStats(country); // { locative: 'w Grecji', minPrice, hotels, airports }
  return {
    description: `Wakacje ${s.locative} od ${s.minPrice} zł/os. ${s.hotels} hoteli, wyloty z ${s.airports} miast. Porównaj oferty i zarezerwuj online.`,
  };
}
```

## Częste błędy

- Opis wygenerowany jako pierwsze 160 znaków treści, z uciętym w pół słowa zdaniem.
