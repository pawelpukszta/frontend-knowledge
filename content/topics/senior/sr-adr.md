---
title: Decyzje architektoniczne i ADR
level: senior
added: 2026-10-20
tags:
  - ADR
  - trade-offs
  - decyzje
  - dokumentacja
summary: "Senior podejmuje decyzje świadomie: porównuje opcje, nazywa kompromisy i zapisuje uzasadnienie w krótkim dokumencie ADR, żeby zespół za rok wiedział, dlaczego tak jest."
sources:
  - title: "Michael Nygard: Documenting Architecture Decisions"
    url: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
  - title: ADR GitHub organization
    url: https://adr.github.io/
---

## Wyjaśnienie

**ADR (Architecture Decision Record)**: krótki dokument w repo (np. `docs/adr/0007-state-management.md`):

- **Kontekst**: jaki problem i jakie ograniczenia.
- **Rozważane opcje** z plusami i minusami.
- **Decyzja**.
- **Konsekwencje**: co zyskujemy, co tracimy, co trzeba będzie zrobić, jaki wpływ długofalowy.
- Status (proponowana, przyjęta, zastąpiona przez ADR-00X).

Jak rozmawiać o trade-offach na rozmowie: nie ma "najlepszej" technologii, jest najlepsza **w danym kontekście** (zespół, skala, czas, budżet, ryzyko). Pokaż, że znasz koszty własnej rekomendacji i wiesz, kiedy przestałaby być dobra. Rozróżniaj decyzje odwracalne (podejmuj szybko) od trudnych do odwrócenia (analizuj dokładniej).

## Kod

```md
# ADR-0007: Server state managed by TanStack Query

## Status
Accepted (2026-03-02)

## Context
Offers, availability and bookings are fetched in 14 places with ad-hoc useEffect code.
We see duplicated requests, race conditions and no cache between pages.

## Options
1. Keep useEffect + Zustand - no new dependency, but we keep writing cache logic.
2. RTK Query - good if we adopted Redux; we have not.
3. TanStack Query - mature cache, devtools, SSR support; one more library to learn.

## Decision
Option 3.

## Consequences
+ Cache, dedup, retries and invalidation out of the box.
- Team onboarding; query key conventions must be documented.
Long term: global store shrinks to UI state only.
```

## Pytania

### Jak podejmujesz decyzje architektoniczne? {#sr-adr-q1}

Definiuję problem i ograniczenia, zbieram 2-3 realne opcje, porównuję je (koszt wdrożenia i utrzymania, ryzyko, wpływ na zespół, odwracalność), robię szybki prototyp, jeśli jest niepewność, a decyzję i konsekwencje zapisuję w ADR. Decyzje odwracalne podejmuję szybciej, nieodwracalne konsultuję szerzej.

### Opowiedz o decyzji technicznej, której żałujesz. {#sr-adr-q2}

Dobra odpowiedź (metoda STAR): kontekst, decyzja i jej powody, co poszło nie tak, jak to naprawiłeś i czego się nauczyłeś (np. że abstrakcja była przedwczesna, więc teraz stosujesz AHA i ADR). Pokazuje dojrzałość i refleksję, a nie nieomylność.

## Quiz

### Co powinien zawierać ADR? {#sr-adr-z1}

- [ ] Tylko decyzję
- [x] Kontekst, rozważane opcje, decyzję i konsekwencje
- [ ] Harmonogram sprintu
- [ ] Listę osób w zespole

Najważniejsze jest uzasadnienie i konsekwencje, żeby zespół rozumiał decyzję w przyszłości.
