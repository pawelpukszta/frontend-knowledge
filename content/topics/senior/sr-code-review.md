---
title: Code review i mentoring
level: senior
tags:
  - code review
  - mentoring
  - PR
  - komunikacja
summary: Code review służy jakości, dzieleniu się wiedzą i spójności, a nie wytykaniu błędów. Senior automatyzuje drobiazgi i skupia się na architekturze, ryzyku i czytelności.
sources:
  - title: "Google: Engineering Practices, Code Review"
    url: https://google.github.io/eng-practices/review/
  - title: Conventional Comments
    url: https://conventionalcomments.org/
---

## Wyjaśnienie

Na co patrzeć (od najważniejszego):

1. Czy zmiana rozwiązuje właściwy problem i spełnia wymagania?
2. Architektura i granice modułów, wpływ na resztę systemu.
3. Poprawność, przypadki brzegowe, obsługa błędów, bezpieczeństwo.
4. Wydajność i dostępność.
5. Testy: czy sprawdzają zachowanie.
6. Czytelność i nazewnictwo.

Formatowanie i styl zostaw automatom (Prettier, ESLint, CI).

Dobre praktyki:

- Małe PR-y, dobry opis (co, dlaczego, jak testować, screenshoty).
- Komentarze jako pytania i sugestie, z uzasadnieniem. Oznaczaj wagę: "nit:", "blocking:".
- Chwal dobre rozwiązania. Oceniaj kod, nie osobę.
- Szybki czas reakcji: review blokuje innych.

Mentoring: pair programming, wyjaśnianie "dlaczego", stopniowe oddawanie odpowiedzialności, dokumentowanie decyzji.

## Pytania

### Na co zwracasz uwagę w code review? {#sr-code-review-q1}

Najpierw czy zmiana rozwiązuje właściwy problem i jak wpływa na architekturę, potem poprawność, przypadki brzegowe, bezpieczeństwo, wydajność, dostępność i testy. Styl zostawiam narzędziom. Komentarze formułuję jako sugestie z uzasadnieniem i oznaczam, co blokuje merge.

### Jak podejść do PR-a juniora z wieloma problemami? {#sr-code-review-q2}

Priorytetyzuję: blokujące kwestie w komentarzach, reszta jako sugestie lub rozmowa na żywo (pair review). Wyjaśniam dlaczego, podaję materiały, doceniam to, co dobre. Celem jest rozwój osoby, a nie tylko poprawienie tego jednego PR-a.
