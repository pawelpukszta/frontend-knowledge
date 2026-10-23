---
title: Architektura aplikacji front-end
level: senior
added: 2026-10-20
tags:
  - architektura
  - feature-based
  - modularność
  - monorepo
  - design system
summary: Dobra architektura frontu grupuje kod według funkcjonalności, pilnuje kierunku zależności i oddziela UI od logiki domenowej i dostępu do danych.
sources:
  - title: Feature-Sliced Design
    url: https://feature-sliced.design/
  - title: "Turborepo: Monorepo handbook"
    url: https://turborepo.dev/docs/crafting-your-repository
  - title: "React: Thinking in React"
    url: https://react.dev/learn/thinking-in-react
---

## Wyjaśnienie

- **Struktura według funkcji (feature-based / vertical slices)**: `features/search`, `features/booking`, każdy z komponentami, hookami, API i typami. Zamiast `components/`, `hooks/`, `utils/` na całą aplikację.
- **Warstwy i kierunek zależności**: `app` (routing, providery) → `features` → `shared` (UI kit, utils). Feature nie importuje z innego feature'a inaczej niż przez jego publiczne API. Pilnuj tego regułami lint (np. `eslint-plugin-boundaries`, Feature-Sliced Design).
- **Oddziel warstwy**: komponenty prezentacyjne, logika w hookach lub domenie, dostęp do danych w jednym miejscu (API client, query keys).
- **Design system** / biblioteka komponentów współdzielona między zespołami, z tokenami i Storybookiem.
- **Monorepo** (pnpm workspaces, Turborepo, Nx) dla wielu aplikacji i paczek: wspólne typy i narzędzia, atomowe zmiany; koszt to złożoność CI i narzędzi.
- **Kontrakty**: typy generowane z OpenAPI/GraphQL, walidacja na granicach (Zod).

## Pytania

### Jak zorganizowałbyś strukturę katalogów dużej aplikacji React? {#sr-architecture-q1}

Według funkcjonalności: `app/` (routing, providery), `features/<nazwa>/` z własnymi komponentami, hookami, API i publicznym `index.ts`, oraz `shared/` na UI kit i narzędzia. Zależności tylko w dół, pilnowane lintem. Za: łatwa nawigacja, własność zespołów, możliwość wydzielenia modułu. Przeciw: trzeba dyscypliny przy decyzji, co jest "shared". Długofalowo: skaluje się z liczbą zespołów.

### Kiedy warto przejść na monorepo? {#sr-architecture-q2}

Gdy kilka aplikacji lub paczek współdzieli kod (design system, typy API, konfiguracje) i zmiany często dotyczą kilku naraz. Zyski: atomowe zmiany i jedna wersja zależności. Koszty: narzędzia (Turborepo/Nx), czas CI, uprawnienia i granice własności.
