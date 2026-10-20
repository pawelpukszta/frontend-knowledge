---
title: Brak elementów fokusowalnych w role="text"
priority: medium
---

`role="text"` (niestandardowa rola spoza WAI-ARIA 1.2, obsługiwana głównie przez VoiceOver) spłaszcza zawartość do jednego tekstu dla czytnika; zagnieżdżone linki lub przyciski stają się wtedy niedostępne.

## Dlaczego to ważne

- Rolę stosuje się, by VoiceOver nie dzielił tekstu rozbitego na wiele `<span>`, np. ceny "2 499 zł" ze stylowaną walutą; to obejście, nie standard.
- Gdy w środku jest link lub przycisk, focus trafia na element, którego czytnik nie ogłasza jako interaktywny, bo jego semantyka została spłaszczona.
- To reguła "best practice" w axe bez przypisanego kryterium WCAG, ale błąd realnie blokuje obsługę.

## Jak sprawdzić

axe (`aria-text`).

## Kod

```html title="Źle"
<p role="text">
  Hotel Aquila <span class="price">2 499 zł</span>
  <a href="/oferty/aquila">Zobacz ofertę</a>
</p>
```

```html title="Dobrze"
<p>
  <span role="text">Hotel Aquila <span class="price">2 499 zł</span></span>
  <a href="/oferty/aquila">Zobacz ofertę</a>
</p>
```

## Częste błędy

- Stosowanie `role="text"` wszędzie "na wszelki wypadek"; inne czytniki go nie znają, a podział tekstu na fragmenty to zwykle mniejszy problem niż utrata semantyki.
