---
title: Container queries dla komponentów
priority: medium
sources:
  - title: "MDN: CSS container queries"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
---

Komponent dopasowuje się do szerokości miejsca, w którym go umieszczono, a nie do okna. Kluczowe dla reużywalnych komponentów design systemu.

## Dlaczego to ważne

- Ta sama karta oferty trafia do szerokiej listy, wąskiego paska bocznego i karuzeli; media queries widzą tylko okno, więc nie wiedzą, ile miejsca ma karta.
- Komponent zawiera całą swoją logikę responsywności, więc można go przenieść w inne miejsce bez dopisywania wyjątków.
- Jednostki kontenera (`cqi`) pozwalają skalować typografię i odstępy względem komponentu; container queries są Baseline od 2023.

## Jak sprawdzić

Umieść komponent w wąskim i szerokim kontenerze (np. w Storybooku); DevTools pokazuje znacznik `container` przy elemencie.

## Kod

```css
.offer-slot {
  container: offer / inline-size;
}
.offer-card { display: grid; gap: var(--space-2); }

@container offer (width >= 32rem) {
  .offer-card { grid-template-columns: 14rem 1fr; }
  .offer-card__title { font-size: clamp(1.1rem, 4cqi, 1.5rem); }
}
```

## Częste błędy

- Ustawienie `container-type` na samym komponencie, który chce się stylować; zapytanie dotyczy przodka, nie elementu.
