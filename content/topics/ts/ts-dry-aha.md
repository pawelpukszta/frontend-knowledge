---
title: "DRY vs WET vs AHA: kiedy abstrakcja ma sens"
level: senior
tags:
  - DRY
  - WET
  - AHA
  - abstrakcja
  - refactoring
  - clean code
summary: DRY każe nie powtarzać kodu, WET dopuszcza powtórzenia, AHA radzi unikać pochopnych abstrakcji. Duplikacja jest tańsza niż zła abstrakcja.
sources:
  - title: "Kent C. Dodds: AHA Programming"
    url: https://kentcdodds.com/blog/aha-programming
  - title: "Sandi Metz: The Wrong Abstraction"
    url: https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction
  - title: Effective TypeScript (Dan Vanderkam)
    url: https://effectivetypescript.com/
---

## Wyjaśnienie

- **DRY (Don't Repeat Yourself)**: każda **wiedza** (reguła biznesowa) powinna mieć jedno źródło prawdy. Uwaga: chodzi o wiedzę, nie o podobnie wyglądający kod.
- **WET (Write Everything Twice)**: pozwól sobie na powtórzenie; abstrahuj dopiero przy trzecim wystąpieniu ("rule of three").
- **AHA (Avoid Hasty Abstractions, Kent C. Dodds)**: optymalizuj pod **zmianę**. Poczekaj, aż wzorzec się ustabilizuje i zrozumiesz, co naprawdę jest wspólne.

Sandi Metz: "duplication is far cheaper than the wrong abstraction". Zła abstrakcja rośnie: każdy nowy przypadek dodaje parametr, flagę `if (isSpecialCase)`, i po roku komponent `<Card>` ma 25 propsów.

Kiedy **abstrahować**:

- Ta sama reguła biznesowa w wielu miejscach (np. wyliczanie ceny z VAT, walidacja PESEL). Rozjazd tych kopii to bug.
- Kod zmienia się **razem, z tego samego powodu**.
- Wzorzec wystąpił 3+ razy i jest stabilny.

Kiedy **powtórzyć**:

- Kod wygląda podobnie, ale należy do różnych domen i będzie ewoluował niezależnie (np. formularz rezerwacji i formularz kontaktowy).
- Abstrakcja wymagałaby flag i warunków specyficznych dla wywołujących.
- Jeszcze nie wiesz, jak będą wyglądać kolejne przypadki.

Jak wyjść ze złej abstrakcji: wstaw ("inline") kod z powrotem w miejsca użycia, usuń nieużywane gałęzie, a potem zobacz, co jest naprawdę wspólne.

W TypeScript to samo dotyczy typów: jeden super-generyczny typ z pięcioma parametrami bywa gorszy niż dwa proste, czytelne typy.

## Kod

```ts
// Hasty abstraction: flags for every caller
function formatPrice(v: number, opts: { withVat?: boolean; forPartner?: boolean; hideCents?: boolean; legacy?: boolean }) { /* ... */ }

// Better: shared knowledge extracted, callers compose it
const VAT_RATE = 0.23;
export const gross = (net: number) => net * (1 + VAT_RATE); // single source of business truth
export const pln = (v: number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(v);
```

## Częste błędy

- Wydzielanie "wspólnego" komponentu po dwóch podobnych użyciach, zanim wiesz, czy będą się zmieniać razem.
- Traktowanie DRY jako zasady o tekście kodu zamiast o wiedzy.
- Utrzymywanie złej abstrakcji tylko dlatego, że "już jest i ktoś się napracował" (sunk cost).

## Pytania

### Czym jest AHA programming? {#ts-dry-aha-q1}

Podejście "Avoid Hasty Abstractions": nie twórz abstrakcji, dopóki nie zobaczysz powtarzalnego, stabilnego wzorca i nie zrozumiesz, co jest naprawdę wspólne. Optymalizujesz pod łatwość zmian, a nie pod minimalną liczbę linii.

### Kiedy duplikacja kodu jest lepsza niż abstrakcja? {#ts-dry-aha-q2}

Gdy podobny kod ma różne powody zmian (różne domeny, zespoły, cykle życia), gdy abstrakcja wymagałaby flag i warunków dla wywołujących, lub gdy przypadków jest za mało, żeby poznać wzorzec. Duplikację łatwo później scalić; złą abstrakcję trudno rozplątać.

### Masz komponent z 20 propsami-flagami. Co robisz? {#ts-dry-aha-q3}

Sygnał złej abstrakcji. Opcje: rozbić na mniejsze komponenty i kompozycję (children, sloty), wstawić kod z powrotem w miejsca użycia i ponownie zidentyfikować część wspólną, lub wydzielić hook z logiką, zostawiając osobne widoki. Za: prostszy kod i mniej regresji. Przeciw: chwilowo więcej linii. Długofalowo: łatwiejsze zmiany niezależnych przypadków.

## Quiz

### Zasada AHA mówi, żeby: {#ts-dry-aha-z1}

- [ ] Zawsze wydzielać kod po drugim powtórzeniu
- [x] Unikać pochopnych abstrakcji i optymalizować pod zmianę
- [ ] Nigdy nie tworzyć abstrakcji
- [ ] Pisać wszystko dwa razy

"Avoid Hasty Abstractions": duplikacja jest tańsza niż zła abstrakcja.
