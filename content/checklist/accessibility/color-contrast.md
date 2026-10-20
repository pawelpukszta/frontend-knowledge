---
title: Minimalny kontrast kolorów
priority: high
sources:
  - title: "W3C Understanding 1.4.11: Non-text Contrast"
    url: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
  - title: "WebAIM: Contrast Checker"
    url: https://webaim.org/resources/contrastchecker/
---

Tekst i istotne elementy interfejsu muszą odpowiednio odcinać się od tła: zwykły tekst co najmniej 4,5:1, duży tekst (ok. 24 px lub 18,5 px pogrubiony) 3:1, ikony i obramowania kontrolek 3:1.

## Dlaczego to ważne

- Ok. 8% mężczyzn ma zaburzenia rozpoznawania barw, a z wiekiem czułość na kontrast spada; jasnoszary tekst na białym tle jest dla nich nieczytelny.
- Słaby kontrast przeszkadza wszystkim w trudnych warunkach: ostre słońce na telefonie, tani monitor, tryb oszczędzania energii.
- To kryteria WCAG 1.4.3 i 1.4.11 (poziom AA), wymagane prawnie m.in. przez European Accessibility Act dla e-commerce.

## Jak sprawdzić

Picker kolorów w DevTools pokazuje współczynnik kontrastu z oznaczeniem AA/AAA; sprawdź też stany hover, focus i disabled oraz tryb ciemny. Automatycznie: axe lub Lighthouse.

## Kod

```css title="Źle"
.price-note { color: #a0a0a0; background: #ffffff; } /* 2.6:1, fails AA */
.btn-ghost { border: 1px solid #e0e0e0; }           /* control border 1.3:1 */
```

```css title="Dobrze"
:root { --text-muted: #5f6368; }                     /* 6.0:1 on white */
.price-note { color: var(--text-muted); }
.btn-ghost { border: 1px solid #8a8f98; }           /* 3.3:1, passes 1.4.11 */
```

## Częste błędy

- Sprawdzanie tylko tekstu, a pomijanie ikon, obramowań pól i wskaźnika focusu.
- Tekst na zdjęciu bez przyciemniającej nakładki; kontrast zmienia się wraz z obrazem.
