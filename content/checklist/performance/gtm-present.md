---
title: Wydajna konfiguracja Google Tag Managera
priority: medium
---

Ogranicz liczbę tagów i triggerów, usuwaj nieużywane, odkładaj niekrytyczne tagi (trigger "Window Loaded" lub własne zdarzenie), przekazuj dane przez `dataLayer` zamiast skrobania DOM i rozważ server-side tagging.

## Dlaczego to ważne

- Sam GTM to umiarkowany koszt, ale kontener z kilkudziesięcioma tagami marketingowymi potrafi dodać setki KB JS i długie zadania przy każdym kliknięciu.
- Tagi dodawane przez marketing bez przeglądu technicznego omijają code review, więc łatwo o duplikaty, wycieki danych i spowolnienia.
- Server-side tagging przenosi część pracy z przeglądarki na serwer i zmniejsza liczbę skryptów firm trzecich na stronie.

## Jak sprawdzić

Insight o firmach trzecich w Lighthouse, waterfall i długie zadania z `gtm.js` w DevTools Performance, tryb Preview w GTM: które tagi i na jakich triggerach się uruchamiają.

## Kod

```tsx title="app/layout.tsx (Next.js, @next/third-parties)"
import { GoogleTagManager } from '@next/third-parties/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
      <GoogleTagManager gtmId="GTM-XXXXXXX" /> {/* loaded after hydration */}
    </html>
  );
}
```

```tsx title="Zdarzenie przez dataLayer zamiast skrobania DOM"
import { sendGTMEvent } from '@next/third-parties/google';

<button onClick={() => sendGTMEvent({ event: 'add_to_cart', item_id: 'HTL-8812', value: 4999, currency: 'PLN' })}>
  Dodaj do koszyka
</button>
```

## Częste błędy

- Kilka kontenerów GTM na jednej stronie albo GTM i ręcznie wklejony `gtag.js` wysyłające te same zdarzenia.
- Tagi z niestandardowym HTML wstawiające kolejne synchroniczne skrypty.
