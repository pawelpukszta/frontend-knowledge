---
title: useEffect i "You Might Not Need an Effect"
level: mid
added: 2026-10-20
tags:
  - useEffect
  - side effects
  - cleanup
  - synchronizacja
summary: useEffect służy do synchronizacji z systemami zewnętrznymi (API przeglądarki, subskrypcje, widgety). Nie używaj go do wyliczania danych z props ani do reagowania na zdarzenia użytkownika.
sources:
  - title: "React: You Might Not Need an Effect"
    url: https://react.dev/learn/you-might-not-need-an-effect
  - title: "React: Synchronizing with Effects"
    url: https://react.dev/learn/synchronizing-with-effects
  - title: "React: useLayoutEffect"
    url: https://react.dev/reference/react/useLayoutEffect
---

## Wyjaśnienie

Efekt uruchamia się **po commicie** (po malowaniu ekranu). Funkcja zwrócona z efektu to **cleanup**, wywoływany przed następnym uruchomieniem i przy odmontowaniu.

Dobre zastosowania: subskrypcje (WebSocket, `addEventListener`), integracja z bibliotekami spoza React (mapa, wykres), synchronizacja z `document.title`, pobieranie danych (choć lepiej przez TanStack Query lub framework).

Kiedy **nie potrzebujesz** efektu:

- **Wyliczanie danych**: `fullName = first + ' ' + last` licz w trakcie renderu, nie w `useEffect` + `setState` (dodatkowy render i ryzyko niespójności).
- **Reakcja na zdarzenie**: logikę po kliknięciu umieść w event handlerze.
- **Reset stanu przy zmianie props**: użyj `key`.
- **Kosztowne obliczenie**: `useMemo`.

`useLayoutEffect` uruchamia się synchronicznie przed malowaniem: do pomiaru DOM (np. pozycji tooltipa), żeby uniknąć migotania.

## Kod

```tsx
// Bad: derived state through an effect (extra render)
const [total, setTotal] = useState(0);
useEffect(() => setTotal(items.reduce((s, i) => s + i.price, 0)), [items]);

// Good: compute during render
const total = items.reduce((s, i) => s + i.price, 0);

// Good use: subscribing to an external system with cleanup
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);
```

## Pytania

### Do czego służy useEffect? {#react-effects-q1}

Do synchronizacji komponentu z czymś spoza React: API przeglądarki, subskrypcje, zewnętrzne biblioteki, sieć. Uruchamia się po renderze i commicie, a funkcja cleanup sprząta przed kolejnym uruchomieniem i przy odmontowaniu.

### Podaj przykłady niepotrzebnych efektów. {#react-effects-q2}

Przeliczanie stanu z props (licz w renderze), reagowanie na kliknięcie (użyj event handlera), resetowanie stanu przy zmianie ID (użyj `key`), łańcuchy efektów ustawiających stan jeden po drugim.

### Różnica między useEffect a useLayoutEffect? {#react-effects-q3}

`useEffect` działa asynchronicznie po malowaniu ekranu. `useLayoutEffect` synchronicznie po zmianach DOM, ale przed malowaniem, więc blokuje paint. Używaj go tylko do pomiarów i poprawek układu, które muszą być widoczne w pierwszej klatce.

## Quiz

### Gdzie policzyć `total` z tablicy items przekazanej w props? {#react-effects-z1}

- [ ] W useEffect z setTotal
- [x] Bezpośrednio w trakcie renderu (ewentualnie useMemo)
- [ ] W useLayoutEffect
- [ ] W osobnym Context

Dane wyliczalne liczy się w renderze; efekt dodałby zbędny render.
