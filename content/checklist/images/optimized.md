---
title: Obrazy zoptymalizowane pod szybkie ładowanie
priority: high
---

Połączenie formatu, rozmiaru, kompresji i priorytetu ładowania; obrazy to zwykle największa część wagi strony, więc tu zwykle jest największy zysk.

## Dlaczego to ważne

- Obraz jest elementem LCP na większości stron; jego optymalizacja to najczęściej najprostsza droga do zmieszczenia się w 2,5 s.
- Lista 30 ofert z niezoptymalizowanymi miniaturami to kilka MB, które użytkownik mobilny pobiera, zanim w ogóle zacznie przewijać.
- Wolniejsze strony mają wyższy współczynnik odrzuceń; w turystyce użytkownik porównuje oferty w kilku kartach i zamyka tę, która ładuje się najdłużej.

## Jak sprawdzić

Network posortowany po rozmiarze z filtrem Img; poniższy snippet w konsoli wypisze największe obrazy.

## Kod

```js title="Snippet do konsoli DevTools"
// List images over 150 KB with transfer size and rendered vs natural width
// (cross-origin images need Timing-Allow-Origin to report transferSize)
const imgs = [...document.images];
performance.getEntriesByType('resource')
  .filter((e) => e.initiatorType === 'img' && e.transferSize > 150_000)
  .map((e) => {
    const el = imgs.find((i) => i.currentSrc === e.name);
    return {
      url: e.name,
      kb: Math.round(e.transferSize / 1024),
      natural: el?.naturalWidth,
      rendered: el ? Math.round(el.clientWidth * devicePixelRatio) : null,
    };
  })
  .forEach((row) => console.log(row));
```

## Częste błędy

- Optymalizacja jednego wymiaru (np. formatu) przy ignorowaniu reszty: AVIF w 4000 px nadal jest za duży.
