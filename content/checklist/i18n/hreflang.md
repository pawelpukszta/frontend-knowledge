---
title: Tagi hreflang dla wersji językowych
priority: medium
sources:
  - title: "Google: Localized versions of your pages"
    url: https://developers.google.com/search/docs/specialty/international/localized-versions
  - title: "Next.js: generateMetadata"
    url: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
---

`<link rel="alternate" hreflang="pl-PL" href="...">` dla każdej wersji językowej, z wzajemnymi odwołaniami, odwołaniem do samej siebie i `x-default`, wskazuje wyszukiwarkom właściwą wersję dla użytkownika.

## Dlaczego to ważne

- Bez hreflang Google może pokazać polskiemu użytkownikowi wersję angielską albo potraktować bardzo podobne wersje (np. `de-DE` i `de-AT`) jak duplikaty.
- Odwołania muszą być dwustronne: jeśli strona A wskazuje B, a B nie wskazuje A, adnotacje mogą zostać zignorowane.
- `x-default` wskazuje stronę dla użytkowników spoza obsługiwanych języków, np. stronę wyboru języka lub wersję angielską.
- Kody to ISO 639-1 dla języka i opcjonalnie ISO 3166-1 alpha-2 dla regionu (`en-GB`, a nie `en-UK`); błędny kod jest pomijany.

## Jak sprawdzić

Crawler z raportem hreflang (np. Screaming Frog): brak błędów odwołań zwrotnych, kodów i adresów nieindeksowalnych; canonical każdej wersji wskazuje na nią samą.

## Kod

```html
<!-- The same set on every language version, including a self-reference -->
<link rel="alternate" hreflang="pl-PL" href="https://example.com/pl/wakacje/grecja" />
<link rel="alternate" hreflang="de-DE" href="https://example.com/de/urlaub/griechenland" />
<link rel="alternate" hreflang="en-GB" href="https://example.com/en/holidays/greece" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/holidays/greece" />
```

```tsx title="app/[locale]/[...slug]/page.tsx"
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  // e.g. { 'pl-PL': '/pl/wakacje/grecja', 'de-DE': '/de/urlaub/griechenland', 'en-GB': '/en/holidays/greece' }
  const paths: Record<string, string> = await getLocalizedPaths(locale, slug);
  return {
    // Relative paths resolve against metadataBase set in the root layout
    alternates: {
      canonical: `/${locale}/${slug.join('/')}`,
      languages: { ...paths, 'x-default': paths['en-GB'] },
    },
  };
}
```

## Częste błędy

- Canonical wersji niemieckiej wskazujący na wersję polską; sprzeczny z hreflang i usuwający wersję z wyników.
- Automatyczne przekierowanie po IP lub `Accept-Language`, które uniemożliwia Googlebotowi dotarcie do innych wersji.
