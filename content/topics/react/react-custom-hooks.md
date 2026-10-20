---
title: Custom hooks
level: mid
tags:
  - custom hooks
  - reużywalność logiki
  - Rules of Hooks
summary: "Custom hook to funkcja zaczynająca się od use, która składa inne hooki. Współdzieli logikę, a nie stan: każde wywołanie ma własny stan."
sources:
  - title: "React: Reusing Logic with Custom Hooks"
    url: https://react.dev/learn/reusing-logic-with-custom-hooks
  - title: "React: Rules of Hooks"
    url: https://react.dev/reference/rules/rules-of-hooks
---

## Wyjaśnienie

- Nazwa zaczyna się od `use`, dzięki czemu linter pilnuje **Rules of Hooks**: wywołuj hooki tylko na najwyższym poziomie komponentu lub innego hooka, nie w warunkach i pętlach.
- Dwa komponenty używające tego samego hooka mają **niezależny** stan. Do współdzielenia stanu potrzebujesz Context lub store'a.
- Dobre hooki mają jedną odpowiedzialność i jasne API: `useDebounce`, `useMediaQuery`, `useOnlineStatus`, `useLocalStorage`.
- Hook dla każdego `useEffect` to też sposób na czytelność: nazwa mówi, co efekt robi.

## Kod

```ts
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cancel if value changes before the delay
  }, [value, delay]);
  return debounced;
}

// usage
const query = useDebouncedValue(input, 300);
const { data } = useQuery({ queryKey: ['search', query], queryFn: () => search(query) });
```

## Pytania

### Czy dwa komponenty używające tego samego custom hooka współdzielą stan? {#react-custom-hooks-q1}

Nie. Custom hook współdzieli logikę; każde wywołanie tworzy własny stan. Wspólny stan wymaga Context, store'a lub podniesienia stanu.

### Jakie są Rules of Hooks? {#react-custom-hooks-q2}

Wywołuj hooki tylko na najwyższym poziomie (nie w pętlach, warunkach, zagnieżdżonych funkcjach) i tylko z komponentów funkcyjnych lub innych hooków. React identyfikuje hooki po kolejności wywołań, więc musi być stała.
