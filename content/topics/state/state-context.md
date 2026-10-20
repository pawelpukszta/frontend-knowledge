---
title: Context API i kiedy to za mało
level: mid
tags:
  - Context
  - useContext
  - prop drilling
  - re-render
summary: "Context przekazuje wartość w głąb drzewa bez prop drillingu. To mechanizm wstrzykiwania zależności, a nie pełne narzędzie do zarządzania stanem: każda zmiana wartości re-renderuje wszystkich konsumentów."
sources:
  - title: "React: Passing Data Deeply with Context"
    url: https://react.dev/learn/passing-data-deeply-with-context
  - title: "React: useContext"
    url: https://react.dev/reference/react/useContext
  - title: "React: Scaling Up with Reducer and Context"
    url: https://react.dev/learn/scaling-up-with-reducer-and-context
---

## Wyjaśnienie

Context sprawdza się dla danych **rzadko zmieniających się** i potrzebnych w wielu miejscach: motyw, język, zalogowany użytkownik, konfiguracja, instancje serwisów.

Kiedy Context to za mało:

- **Częste zmiany**: każda zmiana `value` powoduje re-render **wszystkich** komponentów używających `useContext` tego kontekstu, nawet jeśli potrzebują tylko jednego pola. Nie ma selektorów.
- **Duży obiekt w jednym kontekście**: zmiana jednego pola odświeża całą aplikację.
- **Złożona logika**: middleware, persystencja, DevTools, akcje asynchroniczne.
- **Stan serwera**: cache, refetch, deduplikacja, to zadanie dla TanStack Query.

Łagodzenie problemów w samym Context: podział na kilka kontekstów (np. osobno stan i funkcje dispatch), `useMemo` na `value`, trzymanie providera nisko w drzewie. Gdy to nie wystarcza, przejdź na Zustand, Jotai lub Redux, które pozwalają subskrybować wybrany fragment stanu.

## Kod

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light');

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <ThemeContext value={theme}>          {/* React 19: Context as provider */}
      <Layout onToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
    </ThemeContext>
  );
}

function Header() {
  const theme = use(ThemeContext); // or useContext(ThemeContext)
  return <header className={theme}>...</header>;
}
```

## Częste błędy

- Tworzenie nowego obiektu `value={{ user, setUser }}` przy każdym renderze providera: każdy render rodzica re-renderuje wszystkich konsumentów.
- Jeden "AppContext" z całym stanem aplikacji.

## Pytania

### Kiedy Context API to za mało? {#state-context-q1}

Gdy stan zmienia się często i ma wielu konsumentów (każda zmiana re-renderuje wszystkich, brak selektorów), gdy potrzebujesz middleware, DevTools lub persystencji, oraz dla stanu serwera. Wtedy Zustand, Jotai, Redux lub TanStack Query.

### Czy Context to narzędzie do zarządzania stanem? {#state-context-q2}

Nie do końca. To mechanizm transportu wartości w dół drzewa (dependency injection). Stan i tak trzymasz w `useState`/`useReducer`; Context tylko go udostępnia.

### Jak ograniczyć re-rendery przy Context? {#state-context-q3}

Rozdzielić kontekst na mniejsze (np. dane i akcje osobno), memoizować `value`, trzymać provider jak najniżej, a komponenty-dzieci, które nie potrzebują kontekstu, przekazywać jako `children`.

## Quiz

### Główna wada Context API przy często zmieniającym się stanie: {#state-context-z1}

- [ ] Nie działa z TypeScript
- [x] Każda zmiana value re-renderuje wszystkich konsumentów (brak selektorów)
- [ ] Nie można przekazywać funkcji
- [ ] Wymaga Reduxa

Context nie ma selektorów; komponent nie może subskrybować jednego pola.
