---
title: Virtual DOM, reconciliation i klucze
level: mid
added: 2026-10-20
tags:
  - Virtual DOM
  - reconciliation
  - diffing
  - key
  - Fiber
summary: React trzyma lekką reprezentację UI w pamięci i przy zmianie porównuje ją z poprzednią (reconciliation), żeby zaktualizować tylko to, co się zmieniło w DOM. Klucze pomagają dopasować elementy list.
sources:
  - title: "React: Preserving and Resetting State"
    url: https://react.dev/learn/preserving-and-resetting-state
  - title: "React: Rendering Lists (keys)"
    url: https://react.dev/learn/rendering-lists
  - title: "legacy.reactjs.org: Reconciliation"
    url: https://legacy.reactjs.org/docs/reconciliation.html
---

## Wyjaśnienie

**Virtual DOM**: drzewo zwykłych obiektów JS opisujących UI (wynik JSX). Tworzenie ich jest tanie, operacje na prawdziwym DOM są drogie.

**Reconciliation** (heurystyki O(n)):

- Inny **typ elementu** na tej samej pozycji (`<div>` → `<span>`, `ComponentA` → `ComponentB`): React niszczy całe poddrzewo, **tracąc stan**, i tworzy nowe.
- Ten sam typ: aktualizuje atrybuty i rekurencyjnie porównuje dzieci.
- **Listy**: `key` identyfikuje element między renderami. Bez stabilnego klucza React dopasowuje elementy po indeksie.

**Fiber**: silnik React od wersji 16, który dzieli pracę renderowania na małe jednostki i pozwala ją przerywać i priorytetyzować (Concurrent rendering, `useTransition`).

Stan jest przywiązany do **pozycji w drzewie**, a nie do komponentu. Zmiana `key` to sposób na świadomy reset stanu komponentu.

## Kod

```tsx
// Bad: index as key - state (e.g. input value) jumps between items after reorder/delete
{items.map((item, i) => <Row key={i} item={item} />)}

// Good: stable id from data
{items.map((item) => <Row key={item.id} item={item} />)}

// Reset a form when a different offer is selected
<BookingForm key={offer.id} offer={offer} />
```

## Częste błędy

- `key={Math.random()}`: element jest odtwarzany przy każdym renderze (utrata stanu, słaba wydajność).
- Definiowanie komponentu wewnątrz innego komponentu: przy każdym renderze to nowy typ, więc React niszczy i odtwarza jego poddrzewo.

## Pytania

### Czym jest Virtual DOM i po co React go używa? {#react-reconciliation-q1}

Reprezentacją UI w postaci obiektów JS. React tworzy nowe drzewo przy każdym renderze, porównuje z poprzednim i nanosi na prawdziwy DOM tylko różnice. Daje deklaratywny model programowania przy akceptowalnej wydajności.

### Dlaczego nie używać indeksu jako key? {#react-reconciliation-q2}

Przy zmianie kolejności, wstawianiu lub usuwaniu elementów indeks przypisuje się innym danym, więc React błędnie dopasowuje stan komponentów (np. wartości inputów) i wykonuje zbędne aktualizacje. Indeks jest OK tylko dla statycznych list.

### Jak zresetować stan komponentu? {#react-reconciliation-q3}

Zmienić jego `key`. React potraktuje go jako nowy element i utworzy go od zera.

## Quiz

### Dlaczego `key={index}` bywa problemem? {#react-reconciliation-z1}

- [x] Po zmianie kolejności stan komponentów przypisuje się do złych elementów
- [ ] Indeks nie jest unikalny
- [ ] React nie akceptuje liczb jako key
- [ ] Spowalnia pierwsze renderowanie

Klucz musi identyfikować dane, a nie pozycję.
