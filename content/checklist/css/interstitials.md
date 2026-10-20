---
title: Bez natrętnych interstitiali
priority: medium
sources:
  - title: "Google: Avoid intrusive interstitials"
    url: https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials
---

Pełnoekranowe popupy zasłaniające treść zaraz po wejściu (zwłaszcza na mobile) frustrują i są sygnałem negatywnym dla Google. Używaj banerów zajmujących niewielką część ekranu. Wyjątki: weryfikacja wieku, wymogi prawne, logowanie.

## Dlaczego to ważne

- Google wskazuje, że strony, których treść jest trudno dostępna po przejściu z wyników mobilnych, mogą być oceniane niżej.
- Popup z newsletterem zasłaniający ofertę zaraz po wejściu z reklamy podnosi współczynnik odrzuceń i marnuje budżet kampanii.
- Źle zrobiony popup bywa pułapką dla klawiatury i czytnika ekranu (brak focusu, brak zamknięcia Escape), co narusza WCAG.

## Jak sprawdzić

Wejście na stronę na telefonie z czystą sesją (tryb incognito); sprawdź, ile ekranu zajmuje baner cookies i promocje oraz czy da się je zamknąć klawiaturą.

## Kod

```css
/* Small, dismissible banner instead of a full-screen overlay */
.promo-banner {
  position: fixed;
  inset-inline: var(--space-2);
  inset-block-end: var(--space-2);
  max-block-size: 25dvh;
  overflow: auto;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--surface);
  box-shadow: 0 4px 24px rgb(0 0 0 / 0.2);
}
```

## Częste błędy

- Pokazywanie popupu natychmiast po wejściu zamiast po interakcji lub przy zamiarze wyjścia.
- Baner, który zasłania przycisk "Rezerwuj" lub pole wyszukiwania.
