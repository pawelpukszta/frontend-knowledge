---
title: "Core Web Vitals: przegląd"
level: mid
tags:
  - Core Web Vitals
  - LCP
  - INP
  - CLS
  - SEO
  - CrUX
summary: "Trzy metryki Google mierzące realne doświadczenie użytkownika: szybkość ładowania (LCP), responsywność (INP) i stabilność wizualną (CLS). Wpływają na UX, konwersję i SEO."
sources:
  - title: "web.dev: Web Vitals"
    url: https://web.dev/articles/vitals
  - title: "web.dev: INP replaces FID"
    url: https://web.dev/blog/inp-cwv-march-12
  - title: "GitHub: web-vitals library"
    url: https://github.com/GoogleChrome/web-vitals
---

## Wyjaśnienie

| Metryka | Mierzy | Dobra | Wymaga poprawy | Słaba |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | kiedy widać główną treść | ≤ 2,5 s | ≤ 4 s | > 4 s |
| **INP** (Interaction to Next Paint) | jak szybko strona reaguje na interakcje | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| **CLS** (Cumulative Layout Shift) | jak bardzo "skacze" układ | ≤ 0,1 | ≤ 0,25 | > 0,25 |

- Ocena opiera się na **75. percentylu** wizyt, osobno dla mobile i desktop. Czyli 75% użytkowników musi mieć dobry wynik.
- Dane "field" pochodzą z **CrUX** (Chrome User Experience Report), widoczne w PageSpeed Insights i Search Console.
- **INP zastąpił FID** w marcu 2024. FID mierzył tylko opóźnienie pierwszej interakcji; INP obejmuje wszystkie interakcje i cały czas do wyrenderowania odpowiedzi.
- Biblioteka **`web-vitals`** mierzy metryki u prawdziwych użytkowników (RUM) i pozwala wysłać je do analityki.

Wpływ biznesowy: szybsze strony to niższy bounce rate i wyższa konwersja. W e-commerce i turystyce każda sekunda LCP ma mierzalny wpływ na sprzedaż; CWV są też jednym z sygnałów rankingowych Google (page experience).

## Kod

```js
import { onLCP, onINP, onCLS } from 'web-vitals';

function sendToAnalytics(metric) {
  navigator.sendBeacon('/analytics', JSON.stringify({
    name: metric.name, value: metric.value, rating: metric.rating, id: metric.id,
  }));
}
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

## Pytania

### Czym są Core Web Vitals i jakie mają progi? {#perf-cwv-q1}

Trzy metryki doświadczenia użytkownika: LCP (ładowanie, dobrze ≤ 2,5 s), INP (responsywność, ≤ 200 ms), CLS (stabilność, ≤ 0,1). Ocenia się je na 75. percentylu prawdziwych wizyt.

### Dlaczego INP zastąpił FID? {#perf-cwv-q2}

FID mierzył tylko opóźnienie przed obsługą pierwszej interakcji, pomijając czas przetwarzania i renderowania oraz wszystkie kolejne interakcje. INP mierzy pełne opóźnienie (od interakcji do następnej klatki) dla interakcji w trakcie całej wizyty i raportuje jedną z najgorszych.

### Dlaczego 75. percentyl? {#perf-cwv-q3}

Średnia ukrywa problemy wolnych urządzeń i sieci. 75. percentyl oznacza, że większość użytkowników ma co najmniej taki wynik, a jednocześnie nie jest zdominowany przez skrajne przypadki.

## Quiz

### Jaki jest próg "dobrego" INP? {#perf-cwv-z1}

- [ ] ≤ 100 ms
- [x] ≤ 200 ms
- [ ] ≤ 500 ms
- [ ] ≤ 1 s

INP dobry ≤ 200 ms, słaby > 500 ms.

### Która metryka zastąpiła FID w Core Web Vitals? {#perf-cwv-z2}

- [ ] TBT
- [ ] TTI
- [x] INP
- [ ] FCP

INP został Core Web Vital w marcu 2024.
