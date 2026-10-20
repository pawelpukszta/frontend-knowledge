---
title: WCAG, POUR i European Accessibility Act
level: mid
tags:
  - WCAG
  - POUR
  - kontrast
  - EAA
  - prawo
summary: WCAG to standard dostępności oparty na czterech zasadach POUR. Poziom AA to typowy wymóg prawny, a od czerwca 2025 European Accessibility Act obejmuje m.in. e-commerce w UE.
sources:
  - title: "W3C: WCAG 2.2 Quick Reference"
    url: https://www.w3.org/WAI/WCAG22/quickref/
  - title: "W3C WAI: WCAG 2 Overview"
    url: https://www.w3.org/WAI/standards-guidelines/wcag/
  - title: "European Commission: European Accessibility Act"
    url: https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en
---

## Wyjaśnienie

**POUR:**

- **Perceivable (postrzegalność)**: alternatywy tekstowe, napisy do wideo, kontrast, treść niezależna od koloru.
- **Operable (funkcjonalność)**: obsługa z klawiatury, wystarczający czas, brak migających treści, widoczny focus, cele dotykowe odpowiedniej wielkości.
- **Understandable (zrozumiałość)**: czytelny język, przewidywalne zachowanie, pomoc przy błędach formularza.
- **Robust (solidność)**: poprawny kod działający z technologiami asystującymi.

Poziomy: **A**, **AA** (standard wymagany prawnie), **AAA**. Aktualna wersja: **WCAG 2.2** (m.in. nowe kryteria dla focusu niezasłoniętego, rozmiaru celu, uwierzytelniania bez testów pamięci).

Konkretne progi AA: kontrast tekstu **4,5:1** (duży tekst 3:1), elementów UI i ikon **3:1**, powiększenie do 200% bez utraty treści, reflow przy szerokości 320 px.

**European Accessibility Act (EAA)** stosowany od 28 czerwca 2025: wymogi dostępności dla m.in. sklepów internetowych, bankowości, transportu i usług rezerwacyjnych w UE (w Polsce ustawa o zapewnianiu spełniania wymagań dostępności). Dla firm e-commerce i turystycznych to wymóg prawny, a nie "miły dodatek".

## Pytania

### Co oznacza akronim POUR? {#a11y-wcag-q1}

Cztery zasady WCAG: Perceivable (treść da się odebrać zmysłami), Operable (interfejs da się obsłużyć, np. klawiaturą), Understandable (treść i działanie są zrozumiałe), Robust (kod działa z różnymi technologiami asystującymi).

### Jaki kontrast wymaga WCAG AA? {#a11y-wcag-q2}

4,5:1 dla zwykłego tekstu, 3:1 dla dużego tekstu (ok. 24 px lub 18,5 px pogrubiony) oraz 3:1 dla elementów interfejsu i grafik niosących informację.

### Dlaczego dostępność to wymóg biznesowy? {#a11y-wcag-q3}

Od 2025 roku EAA nakłada wymogi dostępności na e-commerce i wiele usług w UE, z karami za niezgodność. Poza prawem: szerszy rynek (ok. 1 na 5 osób ma jakąś niepełnosprawność, dochodzą seniorzy i sytuacyjne ograniczenia), lepsze SEO i UX dla wszystkich.

## Quiz

### Minimalny kontrast zwykłego tekstu według WCAG AA: {#a11y-wcag-z1}

- [ ] 3:1
- [x] 4,5:1
- [ ] 7:1
- [ ] 2:1

4,5:1 dla zwykłego tekstu, 3:1 dla dużego. 7:1 to poziom AAA.

### Co oznacza litera O w POUR? {#a11y-wcag-z2}

- [ ] Optimized
- [x] Operable
- [ ] Open
- [ ] Ordered

Operable: interfejs da się obsłużyć, np. samą klawiaturą.
