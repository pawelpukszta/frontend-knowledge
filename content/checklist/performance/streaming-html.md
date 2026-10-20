---
title: Strumieniowanie HTML
priority: medium
---

Wysyłanie HTML w kawałkach (chunked transfer, streaming SSR z Suspense w React i Next.js) pozwala przeglądarce zacząć parsowanie, pobieranie CSS i obrazów, zanim serwer skończy pobierać wszystkie dane.

## Dlaczego to ważne

- Szybki fragment strony (nagłówek, galeria, cena) nie czeka na wolne API (opinie, rekomendacje), więc FCP i często LCP są wcześniejsze.
- Przeglądarka odkrywa CSS, fonty i obraz hero już z pierwszego kawałka HTML, zamiast czekać na całą odpowiedź.
- Wolne zapytanie z jednej usługi przestaje blokować całą stronę; użytkownik widzi szkielet sekcji, a treść dopływa w tym samym połączeniu.

## Jak sprawdzić

Waterfall dokumentu w Network (szybki TTFB, dłuższe "Content Download"), podgląd odpowiedzi w filmstrip WebPageTest, wyłączony JS: treść z Suspense i tak dopływa jako HTML.

## Kod

```tsx title="app/hotele/[slug]/page.tsx (Next.js App Router)"
import { Suspense } from 'react';

export default async function HotelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hotel = await getHotel(slug); // fast, critical: rendered in the first chunk

  return (
    <main>
      <HotelHero hotel={hotel} />
      <PriceBox hotelId={hotel.id} />
      {/* Slow service streams in later without blocking the page */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews hotelId={hotel.id} />
      </Suspense>
    </main>
  );
}
```

## Częste błędy

- Pobieranie wszystkich danych w jednym `Promise.all` na górze strony, co znosi korzyść ze streamingu.
- Bufor po drodze (proxy, kompresja z dużym buforem, niektóre konfiguracje CDN), który zbiera całą odpowiedź przed wysłaniem.
