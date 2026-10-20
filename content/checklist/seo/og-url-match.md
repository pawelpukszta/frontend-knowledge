---
title: og:url zgodny z canonical
priority: medium
---

`og:url` wskazuje ten sam bezwzględny adres co `<link rel="canonical">`; inaczej udostępnienia i reakcje rozkładają się na kilka wersji URL.

## Dlaczego to ważne

- Facebook zlicza udostępnienia i reakcje dla adresu z `og:url`; adresy z UTM czy `?sort=` tworzą osobne liczniki.
- Platforma traktuje `og:url` jako adres kanoniczny obiektu; jeśli wskazuje stronę główną, każdy udostępniony link pokaże podgląd strony głównej.
- Wspólne źródło adresu dla canonical i `og:url` w kodzie usuwa ten błąd u podstaw.

## Jak sprawdzić

Porównaj oba tagi w head na kilku typach stron, również po wejściu z parametrami UTM.

## Kod

```tsx title="app/wakacje/[country]/page.tsx"
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const url = `https://example.pl/wakacje/${country}`; // one source for both tags
  return {
    alternates: { canonical: url },
    openGraph: { url, type: 'website', siteName: 'Example Travel', locale: 'pl_PL' },
  };
}
```

## Częste błędy

- `og:url` ustawione na stałe na stronę główną w layoucie.
- W Next.js obiekt `openGraph` strony zastępuje cały `openGraph` z layoutu (płytkie scalanie); pola, których nie powtórzysz, znikają.
