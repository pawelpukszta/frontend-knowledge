---
title: Oznaczaj linki afiliacyjne i treści sponsorowane
priority: medium
sources:
  - title: "Google: Qualify your outbound links"
    url: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
---

Użytkownik musi wiedzieć o powiązaniach finansowych: widoczna informacja przy treści, a linki płatne i afiliacyjne oznaczone `rel="sponsored"`. To wymóg zaufania, zasad Google i prawa.

## Dlaczego to ważne

- Google wymaga oznaczania linków płatnych; kupione lub sprzedane linki bez `sponsored` (albo `nofollow`) mogą zostać uznane za spam linkowy.
- Ukryta reklama jest w Polsce nieuczciwą praktyką rynkową (ustawa o przeciwdziałaniu nieuczciwym praktykom rynkowym); UOKiK wydał też rekomendacje oznaczania treści reklamowych.
- Jawność buduje zaufanie: czytelnik, który sam odkryje ukrytą prowizję, przestaje wierzyć całemu serwisowi.

## Jak sprawdzić

Przejrzyj artykuły z linkami partnerskimi: czy informacja jest widoczna przed pierwszym linkiem i czy każdy taki link ma `rel="sponsored"` (DevTools lub crawler z ekstrakcją atrybutu `rel`).

## Kod

```html
<p class="disclosure" role="note">
  Artykuł zawiera linki partnerskie. Jeśli zarezerwujesz przez nie hotel,
  otrzymamy prowizję; cena dla Ciebie się nie zmienia.
  <a href="/jak-zarabiamy">Jak zarabiamy</a>
</p>

<!-- Paid or affiliate link: "sponsored" is preferred, "nofollow" is still accepted -->
<a href="https://partner.example.com/hotel/123?aff=exm" rel="sponsored noopener" target="_blank">
  Sprawdź ceny w Hotel Kalimera Beach
</a>
```

## Częste błędy

- Informacja o współpracy tylko w stopce lub regulaminie, daleko od linków.
- Dodawanie `rel="sponsored"` do zwykłych linków wewnętrznych serwisu.
