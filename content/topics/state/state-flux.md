---
title: "Wzorzec Flux: action → dispatcher → store → view"
level: mid
added: 2026-10-20
tags:
  - Flux
  - unidirectional
  - action
  - dispatcher
  - store
summary: "Flux to architektura od Facebooka, w której dane płyną w jedną stronę: widok wysyła akcję, dispatcher przekazuje ją do store'ów, store aktualizuje stan, a widok się odświeża."
flow:
  - Action
  - Dispatcher
  - Store
  - View
  - (interakcja użytkownika)
  - Action
sources:
  - title: "Flux: In-Depth Overview (archiwum Facebook)"
    url: https://facebookarchive.github.io/flux/docs/in-depth-overview
  - title: "Flux: repozytorium (archived)"
    url: https://github.com/facebookarchive/flux
  - title: "Redux: Fundamentals, Part 1"
    url: https://redux.js.org/tutorials/fundamentals/part-1-overview
---

## Wyjaśnienie

Flux powstał jako odpowiedź na problem MVC z dwukierunkowym wiązaniem: gdy wiele modeli i widoków aktualizuje się nawzajem, trudno przewidzieć, co spowodowało zmianę. Flux wprowadza **jeden kierunek przepływu**:

1. **Action**: prosty obiekt opisujący, *co się stało*, np. `{ type: 'cart/itemAdded', payload: offer }`.
2. **Dispatcher**: jeden centralny "rozdzielacz", który przekazuje każdą akcję do wszystkich zarejestrowanych store'ów.
3. **Store**: przechowuje stan i logikę jego zmiany. Reaguje na akcje i emituje zdarzenie "zmieniłem się". Stanu nie zmienia się z zewnątrz.
4. **View**: komponenty React czytają stan ze store'a i renderują UI. Interakcja użytkownika tworzy nową akcję i cykl się powtarza.

Korzyści: przewidywalność, łatwe debugowanie (każda zmiana ma swoją akcję), możliwość logowania i odtwarzania akcji. Sama biblioteka `flux` jest dziś zarchiwizowana, ale idea żyje w **Redux** (jeden store, reducery zamiast dispatchera) i w `useReducer`.

## Analogia

Restauracja: gość (View) składa zamówienie (Action) u kelnera (Dispatcher), który przekazuje je do kuchni (Store). Kuchnia przygotowuje danie (nowy stan) i podaje je na stół. Gość nie wchodzi do kuchni i nie gotuje sam.

## Kod

```js
// Minimal Flux-like flow with useReducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    case 'cart/cleared':
      return { ...state, items: [] };
    default:
      return state;
  }
}

function Cart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return (
    <button onClick={() => dispatch({ type: 'cart/itemAdded', payload: { id: 1 } })}>
      Dodaj ({state.items.length})
    </button>
  );
}
```

## Pytania

### Opisz przepływ danych we Flux. {#state-flux-q1}

Jednokierunkowy: View wywołuje Action (obiekt opisujący zdarzenie) → Dispatcher przekazuje ją do Store'ów → Store aktualizuje swój stan i powiadamia o zmianie → View pobiera nowy stan i się renderuje. Stan nigdy nie jest zmieniany bezpośrednio przez widok.

### Czym różni się Redux od klasycznego Flux? {#state-flux-q2}

Redux ma jeden store zamiast wielu, nie ma osobnego dispatchera (rolę przejmuje `store.dispatch`), a logika zmian to czyste funkcje (reducery), które zwracają nowy stan zamiast go mutować.

### Jakie problemy rozwiązuje jednokierunkowy przepływ danych? {#state-flux-q3}

Eliminuje kaskadowe, trudne do śledzenia aktualizacje z dwukierunkowego wiązania. Każda zmiana ma jedno źródło (akcję), więc łatwiej debugować, testować i odtwarzać stan (time-travel debugging).

## Quiz

### Prawidłowa kolejność przepływu danych we Flux: {#state-flux-z1}

- [x] Action → Dispatcher → Store → View
- [ ] View → Store → Dispatcher → Action
- [ ] Dispatcher → Action → View → Store
- [ ] Store → Action → View → Dispatcher

Widok wysyła akcję, dispatcher przekazuje ją do store'a, store aktualizuje stan, widok się renderuje.
