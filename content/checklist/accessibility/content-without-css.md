---
title: Treść zrozumiała bez CSS
priority: high
sources:
  - title: "W3C Understanding 1.3.2: Meaningful Sequence"
    url: https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html
---

Kolejność w DOM odpowiada kolejności czytania, a kluczowe informacje nie są wstawiane wyłącznie przez CSS (`::before`, obrazy tła). Tak treść odczytają czytniki, tryb czytania i wyszukiwarki.

## Dlaczego to ważne

- Czytnik ekranu czyta DOM po kolei; jeśli cena jest wizualnie przy tytule, a w kodzie na końcu karty, kontekst się gubi.
- Treść z `content: "..."` i obrazów tła nie da się zaznaczyć, skopiować ani przetłumaczyć, a tryby czytania i własne style użytkownika ją pomijają.
- Przy wolnym łączu lub błędzie CDN arkusz stylów może się nie wczytać; strona dalej powinna dać się użyć.

## Jak sprawdzić

Wyłącz style (np. Web Developer extension: CSS, Disable All Styles lub Firefox: Widok, Styl strony, Bez stylu) i sprawdź, czy strona ma sens i właściwą kolejność.

## Kod

```css title="Źle"
/* Essential info lives only in CSS */
.offer--promo::before { content: "Promocja -20%"; }
.badge-allinclusive { background-image: url(/img/all-inclusive-label.png); }
```

```html title="Dobrze"
<article class="offer">
  <h3>Kreta, Hersonissos</h3>
  <p class="offer__promo">Promocja -20%</p>
  <p>Wyżywienie: all inclusive</p>
  <p class="offer__price">2799 zł <s>3499 zł</s></p>
</article>
```

## Częste błędy

- Zmiana kolejności kolumn przez `order` lub `grid-area` tak, że DOM opowiada inną historię niż ekran.
