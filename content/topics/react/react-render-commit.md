---
title: "Render i commit: kiedy komponent się renderuje"
level: mid
tags:
  - render
  - commit
  - re-render
  - state
summary: Render to wywołanie funkcji komponentu i obliczenie nowego JSX. Commit to naniesienie różnic na prawdziwy DOM. Re-render nie oznacza zmiany w DOM.
flow:
  - Trigger (setState)
  - Render (wywołanie komponentów)
  - Reconciliation (diff)
  - Commit (zmiany w DOM)
  - Paint
  - useEffect
sources:
  - title: "React: Render and Commit"
    url: https://react.dev/learn/render-and-commit
  - title: "React: State as a Snapshot"
    url: https://react.dev/learn/state-as-a-snapshot
  - title: "React: Queueing a Series of State Updates"
    url: https://react.dev/learn/queueing-a-series-of-state-updates
---

## Wyjaśnienie

Trzy kroki (jak w restauracji: zamówienie, gotowanie, podanie):

1. **Trigger**: pierwszy render (`createRoot().render`) albo zmiana stanu (`setState`) w komponencie lub jego przodku.
2. **Render**: React wywołuje funkcje komponentów i buduje nowe drzewo elementów. To czyste obliczenie, bez dotykania DOM.
3. **Commit**: React porównuje nowe drzewo z poprzednim i nanosi **minimalne zmiany** na DOM. Potem przeglądarka maluje ekran i uruchamiają się efekty.

Komponent renderuje się ponownie, gdy:

- zmieni się **jego stan**,
- **rodzic się przerenderuje** (domyślnie wszystkie dzieci też, niezależnie od props!),
- zmieni się **kontekst**, którego używa.

Zmiana props sama w sobie nie jest przyczyną; props zmieniają się, bo rodzic się przerenderował. `setState` z tą samą wartością (wg `Object.is`) jest pomijany. Aktualizacje stanu są **batchowane** (od React 18 także w Promise i timeoutach).

W trybie dev `StrictMode` wywołuje komponenty i efekty podwójnie, żeby wykryć nieczyste funkcje.

## Pytania

### Kiedy komponent React się re-renderuje? {#react-render-commit-q1}

Gdy zmienia się jego stan, gdy przerenderuje się jego rodzic (domyślnie całe poddrzewo) lub gdy zmieni się wartość kontekstu, który czyta. Zmiana props wynika z re-renderu rodzica.

### Czy re-render zawsze zmienia DOM? {#react-render-commit-q2}

Nie. Render to tylko obliczenie JSX. Jeśli wynik jest taki sam, faza commit nic nie zmieni w DOM. Koszt re-renderu to czas wykonania funkcji komponentów i porównania.

### Co to jest batching? {#react-render-commit-q3}

Grupowanie wielu `setState` w jedną aktualizację i jeden render. Od React 18 działa automatycznie wszędzie, także w Promise, `setTimeout` i natywnych event handlerach.

## Quiz

### Co NIE powoduje re-renderu komponentu? {#react-render-commit-z1}

- [ ] Zmiana jego stanu
- [ ] Re-render rodzica
- [ ] Zmiana używanego kontekstu
- [x] Zmiana zmiennej w useRef

Zmiana `ref.current` nie wyzwala renderu.
