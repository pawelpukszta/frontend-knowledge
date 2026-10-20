---
title: Kolejność poziomów nagłówków
priority: medium
---

Poziomy rosną o jeden (h2, potem h3), nie skaczą (z h2 do h5). Wygląd ustawiasz w CSS, poziom wynika ze struktury.

## Dlaczego to ważne

- Przeskok poziomu sugeruje użytkownikowi czytnika, że coś pominął; czytniki pozwalają skakać po konkretnych poziomach (NVDA: klawisze 1-6), więc brakujący poziom psuje tę nawigację.
- Oddzielenie wyglądu od poziomu pozwala zespołowi designu zmieniać rozmiary bez psucia struktury.

## Jak sprawdzić

axe (`heading-order`), HeadingsMap.

## Kod

```html title="Źle"
<h2>Opinie gości</h2>
<h5 class="small-title">Anna, lipiec 2026</h5>
```

```html title="Dobrze"
<h2>Opinie gości</h2>
<h3 class="text-sm font-semibold">Anna, lipiec 2026</h3>
```

## Częste błędy

- Komponent karty z na sztywno wpisanym `h4`, używany raz pod `h2`, raz pod `h3`; lepiej przekazać poziom jako prop.
