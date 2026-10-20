---
title: Jak wybrać sposób zarządzania stanem
level: senior
tags:
  - architektura
  - decyzja
  - URL state
  - form state
summary: Najpierw nazwij rodzaj stanu, potem wybierz najprostsze narzędzie, które go obsłuży. Nie każdy stan musi być globalny.
sources:
  - title: "React: Managing State"
    url: https://react.dev/learn/managing-state
  - title: "Kent C. Dodds: Application State Management with React"
    url: https://kentcdodds.com/blog/application-state-management-with-react
  - title: "TkDodo: React Query as a State Manager"
    url: https://tkdodo.eu/blog/react-query-as-a-state-manager
---

## Wyjaśnienie

| Rodzaj stanu | Przykład | Narzędzie |
|---|---|---|
| Lokalny UI | otwarty dropdown | `useState` / `useReducer` |
| Współdzielony przez kilka komponentów | wybrany wariant | lifting state up |
| Globalny, rzadko zmieniany | motyw, język, user | Context |
| Globalny, często zmieniany | koszyk, złożone filtry | Zustand / Redux / Jotai |
| Server state | oferty, profil | TanStack Query / RTK Query / SWR |
| URL state | filtry, strona, sortowanie | query params (`useSearchParams`, nuqs) |
| Formularze | wartości, walidacja | React Hook Form + Zod, Server Actions |

Zasady:

- Zaczynaj **lokalnie**, podnoś stan dopiero, gdy jest potrzebny wyżej.
- **Stan wyliczalny liczysz**, nie przechowujesz.
- **Filtry i paginacja w URL**: link można udostępnić, działa przycisk Wstecz i odświeżenie strony (ważne w e-commerce i SEO).

## Pytania

### Jak zdecydowałbyś o zarządzaniu stanem w nowej aplikacji? {#state-choosing-q1}

Klasyfikuję stan: server state do TanStack Query, filtry i paginacja do URL, formularze do React Hook Form, lokalny UI w `useState`. Dopiero to, co zostaje i jest naprawdę globalne, trafia do Context (rzadkie zmiany) lub Zustand/Redux (częste zmiany). Za: mniejszy globalny store i mniej re-renderów. Przeciw: kilka bibliotek do opanowania. Długofalowo: każda warstwa ma jasną odpowiedzialność.

### Dlaczego filtry wyszukiwarki trzymać w URL? {#state-choosing-q2}

Bo stan w URL jest trwały i udostępnialny: odświeżenie strony go nie gubi, działa przycisk Wstecz, link można wysłać, a SSR i SEO widzą te same parametry.
