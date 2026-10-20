---
title: Tylko atrybuty ARIA dozwolone dla danej roli
priority: medium
---

Nie każdy atrybut pasuje do każdej roli, np. `aria-checked` nie ma sensu na zwykłym przycisku (do tego służy `aria-pressed`). Niedozwolone atrybuty są ignorowane lub mylą technologie asystujące.

## Dlaczego to ważne

- Przełącznik "Tylko z wyżywieniem" z `aria-checked` na `button` nie ogłasza stanu, więc użytkownik nie wie, czy filtr jest włączony.
- Część czytników mimo wszystko odczytuje niedozwolony atrybut, a część nie, więc ten sam komponent działa inaczej w NVDA, JAWS i VoiceOver.
- axe przypisuje regułę do WCAG 4.1.2 (A): stan kontrolki musi być przekazany w poprawny, przewidywalny sposób.

## Jak sprawdzić

axe (`aria-allowed-attr`); dozwolone atrybuty dla roli znajdziesz w tabeli "Supported States and Properties" w specyfikacji WAI-ARIA.

## Kod

```html title="Źle"
<button aria-checked="true">Tylko z wyżywieniem</button>
<a href="/hotele" aria-selected="true">Hotele</a>
```

```html title="Dobrze"
<button aria-pressed="true">Tylko z wyżywieniem</button>
<!-- Or a switch: role="switch" supports aria-checked -->
<button role="switch" aria-checked="true">Tylko z wyżywieniem</button>

<a href="/hotele" aria-current="page">Hotele</a>
```

## Częste błędy

- Przenoszenie atrybutów między wzorcami, np. `aria-selected` z zakładek na linki nawigacji zamiast `aria-current`.
