---
title: Bez lazy loadingu treści nad zgięciem
priority: medium
---

Obraz hero i inne obrazy widoczne od razu nie mają `loading="lazy"`; ładuj je normalnie (eager), a obraz LCP z `fetchpriority="high"`.

## Dlaczego to ważne

- `loading="lazy"` sprawia, że przeglądarka czeka z pobraniem na wyliczenie layoutu, więc obraz LCP startuje później i LCP rośnie, często o kilkaset milisekund.
- Częsty błąd w komponentach obrazów, które domyślnie ustawiają `lazy` dla wszystkiego, łącznie z pierwszą kartą na liście czy logo.
- Sekcje "nad zgięciem" różnią się na telefonie i desktopie; sprawdzaj oba układy.

## Jak sprawdzić

Insight o wykrywalności żądania LCP w Lighthouse i DevTools (flaguje lazy loading obrazu LCP), atrybuty obrazu LCP w panelu Elements.

## Kod

```html title="Źle"
<img src="/img/hero-santorini-1200.avif" alt="Santorini" width="1200" height="675" loading="lazy">
```

```tsx title="Dobrze (next/image)"
import Image from 'next/image';

// First visible image: eager + high priority; the rest of the list stays lazy
<Image src="/img/hero-santorini.jpg" alt="Widok na kalderę z tarasu hotelu"
       width={1200} height={675} sizes="100vw" loading="eager" fetchPriority="high" />
{offers.map((o, i) => (
  <Image key={o.id} src={o.image} alt={o.name} width={400} height={300} loading={i < 2 ? 'eager' : 'lazy'} />
))}
```

## Częste błędy

- Lazy loading pierwszych kart na liście wyników, które na desktopie są widoczne bez przewijania.
- Używanie w Next.js 16 przestarzałego propa `priority`; zastępuje go `preload`, a dokumentacja w większości przypadków zaleca `loading="eager"` lub `fetchPriority="high"`.
