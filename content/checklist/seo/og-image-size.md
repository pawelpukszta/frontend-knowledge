---
title: Odpowiedni rozmiar og:image
priority: medium
---

1200x630 px (proporcje 1.91:1), JPEG lub PNG, bezwzględny adres HTTPS, z `og:image:width`, `og:image:height` i `og:image:alt`. Dobry obraz zwiększa klikalność udostępnień.

## Dlaczego to ważne

- Podane wymiary pozwalają platformie pokazać podgląd już przy pierwszym udostępnieniu, bez czekania na pobranie i analizę obrazu.
- Za mały obraz (na Facebooku poniżej ok. 600x315 px) pokazuje się jako mała miniatura zamiast dużej karty.
- Komunikatory i platformy przycinają obraz do różnych proporcji, także kwadratu; najważniejsza treść musi być w centrum kadru.

## Jak sprawdzić

Facebook Sharing Debugger lub LinkedIn Post Inspector; sprawdź, czy obraz zwraca kod 200 i typ `image/*` bez logowania i ciasteczek (`curl -sI`).

## Kod

```html
<meta property="og:image" content="https://example.pl/og/kreta-2027.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Plaża Elafonisi na Krecie z turkusową wodą">
```

```tsx title="app/oferty/[id]/opengraph-image.tsx"
import { ImageResponse } from 'next/og';

// Next.js adds og:image with width, height and type automatically
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Oferta wakacji Example Travel';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = await getOffer(id);
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 80, fontSize: 64, color: '#fff', background: '#0b4f6c' }}>
      {`${offer.title}: od ${offer.price} zł`}
    </div>,
    size,
  );
}
```

## Częste błędy

- Względna ścieżka w `og:image` (`/og.jpg`); crawlery platform jej nie rozwiążą.
- Obraz za ochroną przed hotlinkingiem lub WAF-em blokującym crawlery Facebooka i LinkedIn.
