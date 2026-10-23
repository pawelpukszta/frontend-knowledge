---
title: Zustand
level: mid
added: 2026-10-20
tags:
  - Zustand
  - store
  - selector
  - hooks
summary: Minimalistyczny store oparty na hookach. Brak providera i boilerplate'u, a selektory sprawiają, że komponent re-renderuje się tylko przy zmianie wybranego fragmentu stanu.
sources:
  - title: "Zustand: Introduction"
    url: https://zustand.docs.pmnd.rs/getting-started/introduction
  - title: "Zustand: GitHub"
    url: https://github.com/pmndrs/zustand
---

## Wyjaśnienie

- Store tworzysz funkcją `create`, dostajesz hook.
- **Selektory**: `useStore(s => s.count)` subskrybuje tylko `count`.
- Brak providera: store to moduł, działa też poza React (`useStore.getState()`).
- Middleware: `persist` (localStorage), `devtools` (Redux DevTools), `immer`.
- Mały rozmiar i niski próg wejścia.

Kiedy: stan globalny klienta średniej złożoności (koszyk, filtry, UI state), gdy Context powoduje za dużo re-renderów, a Redux wydaje się zbyt ciężki. Konsekwencja długofalowa: mniej narzuconej struktury, więc w dużym zespole warto ustalić własne konwencje (np. slices, nazewnictwo akcji).

## Kod

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FiltersState = {
  city: string;
  maxPrice: number;
  setCity: (city: string) => void;
  reset: () => void;
};

export const useFilters = create<FiltersState>()(
  persist(
    (set) => ({
      city: '',
      maxPrice: 5000,
      setCity: (city) => set({ city }),
      reset: () => set({ city: '', maxPrice: 5000 }),
    }),
    { name: 'filters' },
  ),
);

// Component re-renders only when `city` changes
const city = useFilters((s) => s.city);
```

## Pytania

### Czym Zustand różni się od Context API? {#state-zustand-q1}

Zustand przechowuje stan poza drzewem React i pozwala subskrybować wybrany fragment przez selektor, więc re-renderują się tylko zainteresowane komponenty. Nie potrzebuje providera i ma middleware (persist, devtools). Context po prostu przekazuje wartość i re-renderuje wszystkich konsumentów przy każdej zmianie.

### Zustand czy Redux Toolkit? {#state-zustand-q2}

Zustand dla prostszego stanu i mniejszych zespołów: mało kodu, szybki start. RTK gdy potrzebujesz ścisłych konwencji, rozbudowanych DevTools, middleware, RTK Query w jednym ekosystemie. Za Zustand: prostota. Przeciw: mniej narzuconej struktury w dużej skali.

## Quiz

### W Zustand komponent z `useStore(s => s.city)` re-renderuje się z powodu store'a, gdy: {#state-zustand-z1}

- [ ] Zmieni się dowolne pole store'a
- [x] Zmieni się wartość city
- [ ] Ktokolwiek wywoła set(), nawet bez zmian
- [ ] Nigdy

Selektor ogranicza subskrypcję do wybranego fragmentu stanu.
