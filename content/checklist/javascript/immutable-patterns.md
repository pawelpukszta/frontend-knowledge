---
title: Niemutowalne aktualizacje danych
priority: medium
---

Spread, `map`, `filter`, `toSorted`, `with` zamiast mutacji. Przewidywalny stan i poprawne działanie React (porównywanie referencji).

## Dlaczego to ważne

- React, React Compiler i `memo` porównują referencje; po `state.push()` tablica jest ta sama, więc komponent się nie przerenderuje i UI pokazuje stare dane.
- `sort()` i `reverse()` mutują tablicę w miejscu; posortowanie ofert po cenie w jednym komponencie zmienia kolejność w każdym innym, który dzieli te dane.
- Niemutowalne aktualizacje ułatwiają debugowanie (poprzedni stan nadal istnieje) i funkcje typu cofnij.

## Jak sprawdzić

Reguły lint lub code review pod kątem `push`, `splice`, `sort`, przypisań do pól stanu; React DevTools pokazuje, czy komponent się odświeżył.

## Kod

```ts title="Źle"
function onAdd(room: Room) {
  rooms.push(room);           // mutates state, no re-render
  setRooms(rooms);
}
const cheapest = offers.sort((a, b) => a.price - b.price); // mutates shared array
```

```ts title="Dobrze"
setRooms((prev) => [...prev, room]);
const cheapest = offers.toSorted((a, b) => a.price - b.price);
const updated = rooms.with(index, { ...rooms[index], guests: 3 });
setBooking((b) => ({ ...b, contact: { ...b.contact, email } }));
```

## Częste błędy

- Płytka kopia (`{ ...obj }`) przy zagnieżdżonych danych, a potem mutacja obiektu wewnątrz.
