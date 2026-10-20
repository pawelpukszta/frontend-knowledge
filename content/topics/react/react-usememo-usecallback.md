---
title: "useMemo i useCallback: kiedy tak, kiedy nie"
level: mid
tags:
  - useMemo
  - useCallback
  - memoizacja
  - referencje
  - performance
summary: "useMemo zapamiętuje wynik obliczenia, useCallback zapamiętuje funkcję. Oba służą do dwóch rzeczy: unikania drogich obliczeń i utrzymywania stabilnych referencji. W innych przypadkach tylko dokładają kosztu."
sources:
  - title: "React: useMemo"
    url: https://react.dev/reference/react/useMemo
  - title: "React: useCallback"
    url: https://react.dev/reference/react/useCallback
  - title: "Kent C. Dodds: When to useMemo and useCallback"
    url: https://kentcdodds.com/blog/usememo-and-usecallback
---

## Wyjaśnienie

- `useMemo(() => compute(a, b), [a, b])`: przelicza tylko, gdy zmienią się zależności.
- `useCallback(fn, [deps])` to to samo co `useMemo(() => fn, [deps])`: zwraca tę samą referencję funkcji między renderami.

**Kiedy używać:**

1. **Kosztowne obliczenie** (filtrowanie/sortowanie tysięcy elementów, parsowanie), mierzalnie wolne. Orientacyjnie: gdy w Profilerze zajmuje ok. 1 ms lub więcej.
2. **Stabilna referencja** przekazywana do komponentu w `memo`.
3. **Zależność innego hooka** (`useEffect`, `useMemo`), żeby efekt nie odpalał się przy każdym renderze.
4. Wartość `value` providera Context.

**Kiedy NIE używać:**

- Proste obliczenia (`a + b`, mapowanie 10 elementów): koszt porównania zależności i pamięci jest większy niż zysk.
- Funkcja przekazywana do zwykłego elementu DOM (`<button onClick>`) lub komponentu bez `memo`: stabilna referencja nic nie daje.
- "Na wszelki wypadek" wszędzie: gorsza czytelność, łatwe do przeoczenia błędne zależności.

**React Compiler** (stabilny od 2025) automatycznie memoizuje komponenty i wartości, więc w projektach z kompilatorem ręczne `useMemo`/`useCallback` są potrzebne rzadko (np. jako precyzyjna kontrola zależności efektu).

## Kod

```tsx
function Offers({ offers, query }: { offers: Offer[]; query: string }) {
  // Worth it: filtering and sorting thousands of items
  const visible = useMemo(
    () => offers.filter((o) => o.title.includes(query)).toSorted((a, b) => a.price - b.price),
    [offers, query],
  );

  // Not worth it: trivial computation
  const count = visible.length; // just compute it

  // Worth it only because MemoMap is wrapped in memo
  const onPinClick = useCallback((id: string) => setSelected(id), []);
  return <MemoMap offers={visible} onPinClick={onPinClick} />;
}
```

## Częste błędy

- Brakujące zależności: zapamiętana wartość jest nieaktualna (stale closure). Włącz regułę `react-hooks/exhaustive-deps`.
- Zależność będąca nowym obiektem przy każdym renderze: memoizacja nigdy nie trafia w cache.
- Traktowanie `useMemo` jako gwarancji semantycznej. To optymalizacja; React może wyrzucić cache.

## Pytania

### Czym różni się useMemo od useCallback? {#react-usememo-usecallback-q1}

`useMemo` zapamiętuje wynik wywołania funkcji (wartość), `useCallback` zapamiętuje samą funkcję (referencję). `useCallback(fn, deps)` jest równoważne `useMemo(() => fn, deps)`.

### Kiedy nie warto używać useMemo i useCallback? {#react-usememo-usecallback-q2}

Przy tanich obliczeniach i gdy stabilna referencja niczego nie zmienia (funkcja trafia do elementu DOM lub komponentu bez memo, wartość nie jest zależnością hooka). Wtedy dodają koszt porównań, pamięci i złożoności kodu bez zysku.

### Czy useCallback sprawia, że funkcja nie jest tworzona na nowo? {#react-usememo-usecallback-q3}

Nie. Funkcja inline jest tworzona przy każdym renderze i tak; `useCallback` tylko zwraca poprzednią referencję, jeśli zależności się nie zmieniły. Zysk pojawia się dopiero tam, gdzie ktoś porównuje referencje (memo, zależności hooków).

### Jak React Compiler zmienia podejście do memoizacji? {#react-usememo-usecallback-q4}

Kompilator analizuje komponenty w czasie buildu i automatycznie memoizuje wartości, funkcje i JSX. Ręczna memoizacja staje się wyjątkiem. Warunek: kod musi przestrzegać Rules of React (czyste komponenty, brak mutacji props i stanu).

## Quiz

### Kiedy useCallback realnie poprawia wydajność? {#react-usememo-usecallback-z1}

- [ ] Zawsze, gdy przekazujesz funkcję
- [x] Gdy funkcja trafia do komponentu w memo lub jest zależnością hooka
- [ ] Gdy funkcja trafia do onClick zwykłego buttona
- [ ] Gdy funkcja jest krótka

Stabilna referencja ma znaczenie tylko tam, gdzie ktoś porównuje referencje.
