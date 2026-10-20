---
title: React.memo
level: mid
tags:
  - memo
  - re-render
  - props
  - optymalizacja
summary: memo opakowuje komponent tak, aby pomijał re-render, gdy jego props są płytko równe poprzednim. Działa tylko, jeśli props mają stabilne referencje.
sources:
  - title: "React: memo"
    url: https://react.dev/reference/react/memo
  - title: React Developer Tools (Profiler)
    url: https://react.dev/learn/react-developer-tools
---

## Wyjaśnienie

- `memo(Component)` porównuje każdy prop przez `Object.is`. Jeśli wszystkie są równe, React używa poprzedniego wyniku.
- Nie blokuje re-renderu wywołanego **własnym stanem** komponentu ani **kontekstem**.
- Działa tylko, gdy props są stabilne. Nowy obiekt, tablica lub funkcja tworzone w rodzicu przy każdym renderze niweczą `memo`. Tu wchodzą `useMemo` i `useCallback`.

Kiedy ma sens: komponent renderuje się często z tymi samymi props **i** jego render jest kosztowny (duże listy, wykresy, edytory). Zmierz przed i po w React DevTools Profiler.

## Kod

```tsx
const OfferList = memo(function OfferList({ offers, onSelect }: Props) {
  return offers.map((o) => <OfferCard key={o.id} offer={o} onSelect={onSelect} />);
});

function Page() {
  const [query, setQuery] = useState('');
  const offers = useOffers();
  const onSelect = useCallback((id: string) => navigate(`/offer/${id}`), []); // stable reference
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <OfferList offers={offers} onSelect={onSelect} /> {/* skipped while typing */}
    </>
  );
}
```

## Pytania

### Jak działa React.memo? {#react-memo-q1}

Opakowuje komponent i przy re-renderze rodzica porównuje płytko (Object.is) nowe props z poprzednimi. Jeśli są równe, pomija render. Nie chroni przed zmianami własnego stanu i kontekstu.

### Dlaczego memo czasem "nie działa"? {#react-memo-q2}

Bo rodzic przekazuje nowe referencje przy każdym renderze: inline obiekty (`style={{}}`), tablice, funkcje strzałkowe, a także `children` jako JSX. Trzeba je ustabilizować (`useMemo`/`useCallback`) albo zmienić strukturę komponentów.
