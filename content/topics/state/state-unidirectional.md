---
title: "Przepływ danych w React: props w dół, zdarzenia w górę"
level: mid
tags:
  - props
  - lifting state up
  - single source of truth
  - Thinking in React
summary: W React dane płyną z rodzica do dziecka przez props, a dziecko informuje rodzica o zmianach przez callbacki. Wspólny stan "podnosisz" do najbliższego wspólnego przodka.
sources:
  - title: "React: Thinking in React"
    url: https://react.dev/learn/thinking-in-react
  - title: "React: Sharing State Between Components"
    url: https://react.dev/learn/sharing-state-between-components
  - title: "React: Choosing the State Structure"
    url: https://react.dev/learn/choosing-the-state-structure
---

## Wyjaśnienie

- **Props down**: rodzic przekazuje dane dzieciom. Dziecko nie modyfikuje props.
- **Events up**: dziecko wywołuje funkcję przekazaną w props (`onChange`, `onSelect`), a rodzic aktualizuje swój stan.
- **Lifting state up**: gdy dwa komponenty potrzebują tego samego stanu, przenosisz go do najbliższego wspólnego rodzica.
- **Single source of truth**: każda informacja ma jedno miejsce przechowywania. Wartości wyliczalne liczysz w trakcie renderu, zamiast trzymać je w osobnym stanie.
- **Prop drilling**: przekazywanie props przez wiele poziomów komponentów, które same ich nie używają. Rozwiązania: kompozycja (`children`), Context, zewnętrzny store.

## Kod

```tsx
function SearchPage() {
  const [query, setQuery] = useState('');           // single source of truth
  const results = offers.filter((o) => o.city.includes(query)); // derived, not stored
  return (
    <>
      <SearchInput value={query} onChange={setQuery} /> {/* events up */}
      <ResultList items={results} />                    {/* props down */}
    </>
  );
}
```

## Pytania

### Co to jest lifting state up? {#state-unidirectional-q1}

Przeniesienie stanu do najbliższego wspólnego rodzica komponentów, które go potrzebują. Rodzic przekazuje wartość w props, a funkcję zmiany jako callback.

### Czym jest prop drilling i jak go unikać? {#state-unidirectional-q2}

Przekazywanie props przez wiele warstw komponentów, które ich nie używają. Najpierw kompozycja (przekazywanie gotowych elementów przez `children`), potem Context dla danych rzadko zmieniających się, a dla złożonego, często zmienianego stanu zewnętrzny store.
