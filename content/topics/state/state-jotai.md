---
title: Jotai (stan atomowy)
level: senior
tags:
  - Jotai
  - atom
  - atomic state
  - derived state
summary: Jotai buduje stan z małych, niezależnych atomów. Komponenty subskrybują pojedyncze atomy, a atomy pochodne wyliczają wartości z innych atomów.
sources:
  - title: "Jotai: Introduction"
    url: https://jotai.org/docs/introduction
  - title: "Jotai: Comparison"
    url: https://jotai.org/docs/basics/comparison
---

## Wyjaśnienie

- **Atom** to najmniejsza jednostka stanu: `atom(0)`.
- `useAtom(countAtom)` działa jak `useState`, ale stan jest współdzielony między komponentami.
- **Atomy pochodne**: `atom((get) => get(priceAtom) * get(qtyAtom))` przeliczają się automatycznie.
- Atomy asynchroniczne współpracują z Suspense.
- Podejście **bottom-up** (składasz z atomów), w przeciwieństwie do **top-down** Reduxa/Zustanda (jeden store, z którego wybierasz fragmenty).

Kiedy: dużo niezależnych, drobnych kawałków stanu i zależności między nimi (np. edytory, konfiguratory, formularze wieloetapowe). Podobna idea: Recoil (niewspierany), signals.

## Kod

```tsx
import { atom, useAtom, useAtomValue } from 'jotai';

const nightsAtom = atom(7);
const pricePerNightAtom = atom(350);
const totalAtom = atom((get) => get(nightsAtom) * get(pricePerNightAtom)); // derived

function Nights() {
  const [nights, setNights] = useAtom(nightsAtom);
  return <input type="number" value={nights} onChange={(e) => setNights(+e.target.value)} />;
}
function Total() {
  const total = useAtomValue(totalAtom); // re-renders only when total changes
  return <strong>{total} zł</strong>;
}
```

## Pytania

### Czym różni się podejście atomowe (Jotai) od store'a (Zustand/Redux)? {#state-jotai-q1}

Store to jeden obiekt stanu, z którego komponenty wybierają fragmenty (top-down). Jotai składa stan z wielu małych atomów i atomów pochodnych (bottom-up); zależności między nimi są śledzone automatycznie, a re-renderują się tylko komponenty używające zmienionego atomu.
