---
title: Redux i Redux Toolkit
level: mid
tags:
  - Redux
  - RTK
  - reducer
  - slice
  - RTK Query
summary: Redux to jeden globalny store zmieniany wyłącznie przez akcje i czyste reducery. Redux Toolkit (RTK) to oficjalny, zalecany sposób pisania Reduxa bez boilerplate'u.
sources:
  - title: Redux Essentials, Part 1
    url: https://redux.js.org/tutorials/essentials/part-1-overview-concepts
  - title: Redux Fundamentals
    url: https://redux.js.org/tutorials/fundamentals/part-1-overview
  - title: "Redux Toolkit: createSlice"
    url: https://redux.js.org/toolkit/api/createSlice
---

## Wyjaśnienie

Trzy zasady Reduxa:

1. **Jedno źródło prawdy**: cały stan globalny w jednym store.
2. **Stan tylko do odczytu**: zmiana wyłącznie przez `dispatch(action)`.
3. **Zmiany przez czyste funkcje**: `reducer(state, action) => newState`.

**Redux Toolkit** (RTK):

- `configureStore`: store z DevTools i middleware.
- `createSlice`: reducery + action creators w jednym. Pod spodem **Immer**, więc możesz pisać "mutujący" kod, który w rzeczywistości tworzy nowy stan.
- `createAsyncThunk`: logika asynchroniczna.
- **RTK Query**: pobieranie i cache danych z API (alternatywa dla TanStack Query).

Kiedy Redux: duża aplikacja, wiele niezależnych części UI współdzieli złożony stan klienta, potrzebne są DevTools, middleware, time-travel, jasne konwencje dla dużego zespołu. Koszt: więcej ceremonii niż Zustand.

## Kod

```ts
import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as { id: string; price: number }[] },
  reducers: {
    itemAdded(state, action: PayloadAction<{ id: string; price: number }>) {
      state.items.push(action.payload); // Immer turns this into an immutable update
    },
    cleared(state) { state.items = []; },
  },
});

export const { itemAdded, cleared } = cartSlice.actions;
export const store = configureStore({ reducer: { cart: cartSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;

// Component: useSelector(state => state.cart.items), useDispatch()
```

## Pytania

### Jakie są trzy zasady Reduxa? {#state-redux-q1}

Jedno źródło prawdy (jeden store), stan tylko do odczytu (zmiana przez akcje), zmiany przez czyste funkcje (reducery).

### Dlaczego w createSlice można "mutować" state? {#state-redux-q2}

RTK używa Immera. Zmiany na draftcie są zapisywane i zamieniane na nowy, niemutowalny obiekt stanu. Zewnętrznie Redux nadal dostaje nową referencję.

### Czy Redux jest dziś nadal potrzebny? {#state-redux-q3}

Rzadziej niż kiedyś. Stan serwera obsługuje TanStack Query lub RTK Query, prosty stan globalny Context lub Zustand. Redux ma sens przy dużym, złożonym stanie klienta, wielu zespołach i potrzebie ścisłych konwencji oraz narzędzi. Za: przewidywalność i DevTools. Przeciw: więcej kodu i koncepcji do nauki.

## Quiz

### Dlaczego w reducerach RTK można pisać `state.items.push(x)`? {#state-redux-z1}

- [ ] Redux Toolkit pozwala mutować stan
- [x] Immer zamienia zmiany na draftcie w nowy, niemutowalny stan
- [ ] Bo push nie mutuje tablicy
- [ ] To działa tylko w trybie dev

Immer śledzi zmiany i produkuje nowy obiekt.
