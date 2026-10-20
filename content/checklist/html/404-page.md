---
title: Własna strona 404
priority: medium
sources:
  - title: "Next.js: not-found.js"
    url: https://nextjs.org/docs/app/api-reference/file-conventions/not-found
---

Pomocna strona błędu z wyszukiwarką, linkami do popularnych sekcji i strony głównej, zwracająca prawdziwy status 404 (nie 200, czyli "soft 404").

## Dlaczego to ważne

- Soft 404 (strona błędu ze statusem 200) może trafić do indeksu jak zwykła strona, a Search Console zgłasza ją jako problem.
- Wygasła oferta lub literówka w adresie to częsta ścieżka wejścia z Google i newslettera; pomocna 404 z wyszukiwarką i podobnymi ofertami zatrzymuje użytkownika.
- Dla trwale usuniętych treści możesz zwrócić 410, a gdy istnieje odpowiednik, przekierować 301 na niego; masowe przekierowanie na stronę główną Google i tak uzna za soft 404.

## Jak sprawdzić

Wejdź na nieistniejący adres i sprawdź status w Network; Search Console, raport Strony, pozycja "Soft 404".

## Kod

```tsx title="app/oferta/[id]/page.tsx"
import { notFound } from 'next/navigation';

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer) notFound(); // renders the nearest not-found.tsx
  return <OfferDetails offer={offer} />;
}
```

```tsx title="app/not-found.tsx"
import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main">
      <h1>Nie znaleźliśmy tej strony</h1>
      <p>Oferta mogła wygasnąć. Wyszukaj inny termin lub kierunek.</p>
      <search>
        <form action="/szukaj">
          <label htmlFor="q">Szukaj ofert</label>
          <input id="q" name="q" type="search" />
          <button type="submit">Szukaj</button>
        </form>
      </search>
      <Link href="/last-minute">Zobacz oferty last minute</Link>
    </main>
  );
}
```

## Częste błędy

- W Next.js `notFound()` wywołane po rozpoczęciu streamingu (np. pod `loading.tsx`) zwraca status 200 z `noindex`, nie 404; sprawdź status w Network.
