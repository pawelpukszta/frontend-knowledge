---
title: "Optymalizacja bez memo: przesuń stan w dół, podnieś treść w górę"
level: senior
added: 2026-10-20
tags:
  - composition
  - children
  - state colocation
  - performance
summary: Zanim sięgniesz po memo, zmień strukturę komponentów. Stan przeniesiony niżej lub treść przekazana przez children często usuwa zbędne re-rendery bez żadnej memoizacji.
sources:
  - title: "Dan Abramov: Before You memo()"
    url: https://overreacted.io/before-you-memo/
  - title: "React: useTransition"
    url: https://react.dev/reference/react/useTransition
  - title: "React: useDeferredValue"
    url: https://react.dev/reference/react/useDeferredValue
---

## Wyjaśnienie

Dwie techniki z artykułu Dana Abramova "Before You memo()":

1. **Move state down (colocation)**: jeśli stan używa tylko mały fragment UI, wydziel ten fragment do osobnego komponentu razem ze stanem. Zmiana stanu re-renderuje wtedy tylko ten mały komponent.
2. **Lift content up (children as props)**: jeśli komponent ze stanem musi owijać dużą część drzewa, przekaż tę część jako `children`. Elementy `children` są tworzone przez rodzica wyżej, więc zmiana stanu w wrapperze ich nie re-renderuje (ta sama referencja elementu).

Dodatkowo: dziel duże komponenty, trzymaj Context providery nisko, wirtualizuj długie listy (TanStack Virtual), a dla kosztownych aktualizacji używaj `useTransition`/`useDeferredValue`.

## Kod

```tsx
// Before: typing re-renders ExpensiveTree
function App() {
  const [color, setColor] = useState('red');
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <ExpensiveTree />
    </div>
  );
}

// After: content lifted up as children - ExpensiveTree is not re-rendered
function ColorPicker({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState('red');
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      {children}
    </div>
  );
}
const App = () => <ColorPicker><ExpensiveTree /></ColorPicker>;
```

## Pytania

### Jak ograniczyć re-rendery bez memo? {#react-before-memo-q1}

Przenieść stan bliżej miejsca użycia (state colocation), a gdy komponent ze stanem musi owijać dużą część UI, przekazać ją przez `children`. Elementy utworzone wyżej nie re-renderują się przy zmianie stanu wrappera.

### Czym są useTransition i useDeferredValue? {#react-before-memo-q2}

Narzędzia concurrent rendering. `useTransition` oznacza aktualizację jako niepilną, więc pilne interakcje (wpisywanie) nie są blokowane. `useDeferredValue` daje "opóźnioną" wersję wartości do kosztownego renderu, podczas gdy input aktualizuje się natychmiast.
