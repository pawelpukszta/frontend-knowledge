---
title: Micro frontends
level: senior
added: 2026-10-20
tags:
  - micro frontends
  - Module Federation
  - skalowanie zespołów
summary: Podział frontu na niezależnie budowane i wdrażane części, własność różnych zespołów. Rozwiązuje problem organizacyjny, a nie techniczny, i ma wysoki koszt.
sources:
  - title: "Martin Fowler: Micro Frontends"
    url: https://martinfowler.com/articles/micro-frontends.html
  - title: Module Federation
    url: https://module-federation.io/
---

## Wyjaśnienie

Sposoby integracji:

- **Build time**: paczki npm (proste, ale brak niezależnego deployu).
- **Runtime**: **Module Federation** (webpack, Rspack, Vite plugin), import maps, Web Components, iframe.
- **Server/edge**: składanie fragmentów HTML (SSI, ESI), osobne aplikacje pod różnymi ścieżkami (najprostsze: "multi-zone" w Next.js).

Plusy: niezależne wdrożenia i zespoły, izolacja awarii, stopniowa migracja starego kodu.

Minusy: duplikacja zależności i większy bundle, niespójny UX, złożoność komunikacji między częściami, trudniejsze testy E2E, wersjonowanie współdzielonych bibliotek, wyższy próg wejścia.

Kiedy ma sens: wiele zespołów (np. 5+) pracuje nad jednym produktem, potrzebują niezależnych cykli wydań, albo trwa migracja z legacy. Dla jednego zespołu to zwykle przerost formy; modularny monolit daje większość korzyści taniej.

## Pytania

### Kiedy wybrałbyś micro frontends? {#sr-microfrontends-q1}

Gdy problemem jest skala organizacji: wiele zespołów blokuje się nawzajem przy wydaniach jednej aplikacji, części produktu mają różne cykle życia, lub trzeba stopniowo migrować legacy. Dla małego zespołu wybrałbym modularny monolit z jasnymi granicami. Konsekwencje długofalowe: niezależność zespołów kosztem wydajności, spójności UX i złożoności infrastruktury.

## Quiz

### Micro frontends rozwiązują przede wszystkim problem: {#sr-microfrontends-z1}

- [x] Organizacyjny: niezależne zespoły i wdrożenia
- [ ] Wydajności ładowania strony
- [ ] Braku TypeScriptu
- [ ] SEO

Kosztem wydajności i złożoności dają niezależność zespołów.
