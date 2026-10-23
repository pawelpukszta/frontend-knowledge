---
title: "Typowanie strukturalne, excess property checks i branded types"
level: mid
added: 2026-10-23
tags:
  - structural typing
  - branded types
  - excess property checks
  - index signature
  - noUncheckedIndexedAccess
summary: TypeScript porównuje typy po kształcie, a nie po nazwie. Dlatego dwa różne identyfikatory typu `string` są dla niego wymienne, dopóki nie dodasz im "marki" (brand).
sources:
  - title: "TypeScript Handbook: Type Compatibility"
    url: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
  - title: "TypeScript Handbook: Object Types (excess property checks, index signatures)"
    url: https://www.typescriptlang.org/docs/handbook/2/objects.html
  - title: "TypeScript Playground: Nominal Typing"
    url: https://www.typescriptlang.org/play/typescript/language-extensions/nominal-typing.ts.html
  - title: "TSConfig Reference: noUncheckedIndexedAccess"
    url: https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess
  - title: "MDN: Map (Objects vs. Maps)"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
---

## Wyjaśnienie

**Typowanie strukturalne** oznacza, że TS sprawdza, jakie pola i metody ma wartość. Nazwa typu nie gra roli. Jeśli obiekt ma `x: number` i `y: number`, pasuje do każdego typu `{ x: number; y: number }`, nawet gdy nikt nigdzie nie napisał `implements`. W językach z **typowaniem nominalnym** (Java, C#) klasa musi jawnie zadeklarować, że implementuje interfejs.

Taki model dobrze pasuje do JavaScriptu, gdzie obiekty powstają z literałów, JSON-a i spreadu.

**Excess property checks.** Świeży literał obiektu (zapisany bezpośrednio w przypisaniu lub w argumencie) nie może mieć pól, których nie zna typ docelowy. To ochrona przed literówkami, np. `colour` zamiast `color`. Gdy ten sam obiekt najpierw trafi do zmiennej, sprawdzenie znika i obowiązuje zwykła zgodność strukturalna: dodatkowe pola są dozwolone. Wyjątek: obiekt musi mieć choć jedno pole wspólne z typem docelowym, jeśli wszystkie pola tego typu są opcjonalne.

**Branded types.** Skoro `UserId` i `OrderId` to oba `string`, TS pozwoli je pomylić. Rozwiązaniem jest "marka": przecięcie z obiektem, który w runtime nie istnieje, np. `string & { readonly __brand: 'UserId' }`. Zwykły `string` nie ma pola `__brand`, więc nie przejdzie. Wartość z marką tworzysz w jednej funkcji (konstruktorze), która sprawdza dane i robi jedyne `as` w kodzie. To samo działa dla jednostek: `Pln`, `Eur`, `Meters`. W runtime to dalej zwykły string lub number, więc koszt jest zerowy.

**Słowniki: index signature, `Record`, `Map`.**

- `{ [key: string]: number }` to index signature: dowolne klucze, wszystkie wartości tego samego typu. Pozostałe pola obiektu też muszą do niego pasować.
- `Record<K, V>` to mapped type. Z szerokim `K` (`Record<string, number>`) działa jak index signature. Z unią literałów (`Record<'pl' | 'en', string>`) wymusza komplet kluczy.
- `Map<K, V>` to struktura z runtime: klucze dowolnego typu, kolejność wstawiania, `size`, lepsza przy częstym dodawaniu i usuwaniu. Nie serializuje się sama do JSON.

Bez flagi `noUncheckedIndexedAccess` odczyt `prices['paris']` z `Record<string, number>` ma typ `number`, choć klucza może nie być. Flaga dodaje `| undefined` do każdego odczytu przez index signature (także `arr[i]` w tablicy), więc musisz obsłużyć brak wartości. `Map.get` zawsze zwraca `V | undefined`, niezależnie od flagi.

## Analogia

Typowanie strukturalne to bramkarz, który sprawdza, czy masz bilet z właściwym miejscem, a nie jak masz na nazwisko. Brand to imienna opaska: bilet wygląda tak samo, ale bez opaski z właściwym napisem nie wejdziesz.

## Kod

```ts title="Kształt, excess property checks i brand"
type Point = { x: number; y: number };
const distance = (p: Point) => Math.hypot(p.x, p.y);

const geo = { x: 3, y: 4, label: 'Hotel' };
distance(geo);                            // OK: extra field on a variable is fine
distance({ x: 3, y: 4, label: 'Hotel' }); // error: object literal may only specify known properties

type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

function toUserId(raw: string): UserId {
  if (!/^usr_[a-z0-9]+$/.test(raw)) throw new Error(`Invalid user id: ${raw}`);
  return raw as UserId; // the only cast, guarded by the check above
}

declare function cancelOrder(orderId: OrderId, by: UserId): void;
const user = toUserId('usr_42');
cancelOrder(user, user);    // error: UserId is not assignable to OrderId
cancelOrder('ord_1', user); // error: plain string is not an OrderId
```

```ts title="noUncheckedIndexedAccess"
const prices: Record<string, number> = { rome: 1200 };
prices['paris'].toFixed(2); // flag off: compiles, crashes at runtime
                            // flag on: error, 'prices.paris' is possibly undefined

const labels: Record<'pl' | 'en', string> = { pl: 'Cena', en: 'Price' };
labels.en.toUpperCase();    // OK with the flag: the key set is known

const cache = new Map<string, number>();
const hit = cache.get('paris'); // number | undefined, always
```

## Częste błędy

- Myślenie, że excess property checks działają zawsze. Znikają, gdy obiekt przechodzi przez zmienną lub spread, więc nie zastąpią walidacji danych.
- Brand tworzony przez `as UserId` w wielu miejscach. Wtedy marka nic nie gwarantuje; rzutowanie powinno być w jednej funkcji z walidacją.
- `Record<string, T>` dla danych, w których klucza może nie być, bez `noUncheckedIndexedAccess`. Typ mówi `T`, a w runtime przychodzi `undefined`.
- Używanie obiektu jako słownika z kluczami od użytkownika. Klucz `__proto__` czy `constructor` koliduje z prototypem; `Map` nie ma tego problemu.

## Pytania

### Czym jest typowanie strukturalne i czym różni się od nominalnego? {#ts-structural-branded-q1}

W typowaniu strukturalnym zgodność typów zależy od ich budowy: jeśli wartość ma wszystkie wymagane pola o pasujących typach, jest zgodna, niezależnie od nazwy typu. W typowaniu nominalnym (Java, C#) liczy się nazwa i jawna deklaracja, np. `class Dog implements Pet`. TypeScript jest strukturalny, bo opisuje JavaScript, w którym obiekty powstają z literałów i JSON-a. Wyjątkiem są klasy z polami `private` lub `protected`: są zgodne tylko w obrębie tej samej hierarchii dziedziczenia.

```ts
interface Pet { name: string }
class Dog {
  name = 'Reksio';
  bark() {}
}
const pet: Pet = new Dog(); // OK: same shape, no "implements" needed
```

### Dlaczego TS zgłasza nadmiarowe pole w literale, a w zmiennej już nie? {#ts-structural-branded-q2}

Świeży literał obiektu podlega excess property checking. TS zakłada, że skoro piszesz obiekt w miejscu użycia, dodatkowe pole to prawdopodobnie literówka. Obiekt w zmiennej mógł powstać gdzie indziej i mieć więcej pól z dobrego powodu, więc TS stosuje zwykłą regułę strukturalną: wystarczy, że ma wymagane pola. Dlatego obiekt z API przypisany do zmiennej przejdzie z dowolnymi dodatkowymi polami. Jeśli chcesz odrzucać nieznane pola z zewnątrz, robisz to w runtime, np. schematem `z.strictObject` w Zod.

### Czym są branded types i kiedy ich używasz? {#ts-structural-branded-q3}

To sposób na symulację typowania nominalnego. Do typu bazowego dodajesz przez przecięcie pole, które istnieje tylko w typach: `type UserId = string & { readonly __brand: 'UserId' }`. Zwykły string nie jest już `UserId`, a `UserId` nie jest `OrderId`. Wartość z marką tworzy jedna funkcja, która waliduje wejście i robi rzutowanie. Używam ich dla identyfikatorów różnych encji, jednostek (`Pln` vs `Eur`) i danych "po walidacji" (np. oczyszczony HTML). W runtime nic się nie zmienia, to wciąż string.

### Index signature, `Record` czy `Map`? Co zmienia `noUncheckedIndexedAccess`? {#ts-structural-branded-q4}

Index signature i `Record<string, V>` opisują zwykły obiekt-słownik: łatwo go serializować do JSON i przekazać do API. `Record` z unią literałów wymusza komplet kluczy, co przydaje się przy tłumaczeniach czy mapowaniu statusów. `Map` wybieram, gdy klucze nie są stringami, gdy często dodaję i usuwam wpisy albo gdy klucze pochodzą od użytkownika. Bez `noUncheckedIndexedAccess` odczyt z index signature ma typ `V`, choć klucza może brakować. Z flagą dostajesz `V | undefined` (także przy `arr[i]`) i kompilator zmusza Cię do obsługi braku.

## Quiz

### Który zapis zgłosi błąd kompilacji dla `type Point = { x: number; y: number }`? {#ts-structural-branded-z1}

- [ ] `const a = { x: 1, y: 2, z: 3 }; const p: Point = a;`
- [x] `const p: Point = { x: 1, y: 2, z: 3 };`
- [ ] `const p: Point = JSON.parse('{"x":1,"y":2,"z":3}');`
- [ ] `const p: Point = { ...{ x: 1, y: 2 } };`

Excess property check dotyczy tylko świeżego literału z polem `z`; zmienna przechodzi zwykłą zgodność strukturalną, a `JSON.parse` zwraca `any`.

### Co daje `type UserId = string & { readonly __brand: 'UserId' }`? {#ts-structural-branded-z2}

- [ ] Dodaje pole `__brand` do stringa w runtime
- [ ] Sprawdza format identyfikatora przy każdym przypisaniu
- [x] Sprawia, że zwykły `string` nie jest przypisywalny do `UserId`
- [ ] Zamienia `UserId` w klasę z konstruktorem

Marka istnieje tylko w systemie typów, więc wartość trzeba świadomie utworzyć przez funkcję z rzutowaniem.
