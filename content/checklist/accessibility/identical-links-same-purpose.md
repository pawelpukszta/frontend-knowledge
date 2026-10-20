---
title: Linki o tej samej treści prowadzą w to samo miejsce
priority: medium
---

Linki o tej samej nazwie dostępnej prowadzą w to samo miejsce, a linki do różnych miejsc mają różne nazwy. Kilka linków "Zobacz szczegóły" do różnych ofert jest nieodróżnialnych na liście linków: dodaj kontekst w treści linku lub `aria-labelledby`.

## Dlaczego to ważne

- Użytkownicy czytników często przeglądają stronę listą linków (NVDA+F7, rotor VoiceOver), która pokazuje tylko nazwy linków, bez otaczającego kontekstu.
- Dziesięć pozycji "Zobacz szczegóły" to dla nich dziesięć identycznych linków; nie da się wybrać konkretnego hotelu.
- Opisowa treść linku pomaga też SEO, bo anchor text mówi Google, czego dotyczy strona docelowa. Powiązane kryteria: WCAG 2.4.4 (A) i 2.4.9 (AAA).

## Jak sprawdzić

Lista linków w czytniku ekranu (NVDA+F7 lub rotor VoiceOver); axe (`identical-links-same-purpose`).

## Kod

```html title="Źle"
<a href="/oferta/1832">Zobacz szczegóły</a>
<a href="/oferta/2271">Zobacz szczegóły</a>
```

```html title="Dobrze"
<article>
  <h3>Hotel Aegean Blue, Kreta</h3>
  <p>7 nocy, all inclusive, od 3 499 zł</p>
  <a href="/oferta/1832">
    Zobacz szczegóły<span class="visually-hidden"> oferty Hotel Aegean Blue</span>
  </a>
</article>
```

## Częste błędy

- `aria-label` niezawierający widocznego tekstu linku: łamie WCAG 2.5.3 Label in Name i utrudnia sterowanie głosem.
