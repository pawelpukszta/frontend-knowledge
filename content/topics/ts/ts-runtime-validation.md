---
title: "Walidacja w runtime: granice zaufania, Zod i Standard Schema"
level: mid
tags:
  - Zod
  - walidacja
  - runtime
  - Standard Schema
  - parse don't validate
summary: Typy znikają po kompilacji, więc dane z zewnątrz (API, URL, formularz, localStorage) trzeba sprawdzić w runtime. Schemat, np. w Zod, robi to raz na granicy i daje typ, któremu reszta kodu może ufać.
sources:
  - title: "Zod: Basic usage (parse, safeParse, z.infer)"
    url: https://zod.dev/basics
  - title: "Zod: For library authors (Standard Schema)"
    url: https://zod.dev/library-authors
  - title: Standard Schema
    url: https://standardschema.dev/
  - title: "Valibot: Introduction"
    url: https://valibot.dev/guides/introduction/
  - title: "Alexis King: Parse, don't validate"
    url: https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
  - title: "TypeScript Handbook: Narrowing (type predicates)"
    url: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
---

## Wyjaśnienie

TypeScript sprawdza kod przed uruchomieniem, a potem typy są usuwane (szczegóły w temacie o kompilacji). `res.json() as Offer` niczego więc nie sprawdza, tylko każe kompilatorowi uwierzyć. Jeśli backend zwróci `price: "99"` zamiast liczby, błąd wyjdzie dopiero daleko od miejsca, gdzie dane weszły.

**Granica zaufania** to każde miejsce, w którym dane przychodzą spoza Twojego kodu:

- odpowiedzi `fetch`, WebSocket, Server-Sent Events,
- parametry URL i `URLSearchParams` (zawsze stringi, często puste lub zmienione ręcznie),
- dane z formularzy i `FormData`,
- `localStorage`, `sessionStorage`, IndexedDB (stara wersja aplikacji mogła zapisać inny kształt),
- `postMessage` z innego okna lub iframe'a (sprawdź też `event.origin`),
- SDK firm trzecich i `JSON.parse`.

Tam typ powinien być `unknown`, a nie `any`. Na granicy dane przechodzą przez walidację, a dalej, w "zaufanym rdzeniu", kod zakłada, że typ jest prawdziwy, i nie powtarza sprawdzeń.

**Parse, don't validate.** Funkcja, która tylko zwraca `true`/`false`, nie przenosi wiedzy dalej. Lepsza jest funkcja, która zwraca nowy, węższy typ albo błąd. Schemat w Zod działa właśnie tak: `Offer.parse(data)` zwraca obiekt typu `Offer` (z wyciętymi nieznanymi polami) albo rzuca `ZodError`. `safeParse` zamiast rzucać zwraca `{ success: true, data }` lub `{ success: false, error }`. Typ wyprowadzasz ze schematu przez `z.infer<typeof Offer>`, więc schemat i typ się nie rozjadą. Schemat może też przekształcić dane, np. `z.coerce.number()` zamieni `"3"` z URL-a na `3`.

**Inne biblioteki.** Valibot ma API z małych funkcji (`v.pipe(v.string(), v.email())`), dzięki czemu bundler wycina nieużywany kod i paczka jest mniejsza. ArkType definiuje schematy składnią podobną do TypeScriptu w stringach (`type({ name: 'string' })`). **Standard Schema** to wspólny interfejs (`~standard.validate`), który implementuje Zod i, według dokumentacji Zod, większość popularnych bibliotek walidacji. Biblioteki formularzy czy routery mogą przyjmować dowolny zgodny schemat bez zależności od konkretnej paczki.

**Ręczny type guard czy schemat?** Ręczny predykat `value is T` wystarczy dla małego, płaskiego kształtu w jednym miejscu i nie dodaje zależności. TS nie sprawdza jednak, czy predykat sprawdza to, co obiecuje, a przy zagnieżdżonych danych kod szybko rośnie. Schemat daje typ z jednego źródła, zagnieżdżenia, komunikaty błędów ze ścieżką pola i transformacje.

## Kod

```ts title="Granica: fetch i parametry URL"
import * as z from 'zod';

const Offer = z.object({
  id: z.string(),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  startsAt: z.iso.datetime(),
});
export type Offer = z.infer<typeof Offer>;

export async function getOffer(id: string): Promise<Offer> {
  const res = await fetch(`/api/offers/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const result = Offer.safeParse(await res.json());
  if (!result.success) throw new Error(z.prettifyError(result.error));
  return result.data; // trusted from here on
}

const SearchParams = z.object({
  page: z.coerce.number().int().min(1).catch(1), // "abc" -> 1
  sort: z.enum(['price', 'date']).catch('date'),
});
const params = SearchParams.parse(Object.fromEntries(new URLSearchParams(location.search)));
```

```ts title="Ręczny type guard dla prostego kształtu"
function isNamed(value: unknown): value is { id: string; name: string } {
  return (
    typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'name' in value && typeof value.name === 'string'
  );
}

const saved: unknown = JSON.parse(localStorage.getItem('lastHotel') ?? 'null');
if (isNamed(saved)) console.log(saved.name); // narrowed
```

## Częste błędy

- `await res.json() as User` albo generyk `fetchJson<User>()` udający walidację. To tylko asercja; kompilator wierzy na słowo.
- Walidacja rozsiana po komponentach (`user?.address?.city ?? ''` wszędzie) zamiast jednego miejsca na granicy.
- `z.coerce.number()` na pustym polu formularza: `Number('')` daje `0`, więc puste pole przechodzi jako zero. Lepiej najpierw odrzucić pusty string albo dodać `.min(1)`, jeśli zero nie jest poprawną wartością.
- Odczyt `localStorage` bez schematu. Po wdrożeniu nowej wersji stary zapis ma inny kształt i aplikacja pada przy starcie.

## Pytania

### Napisz type guard dla danych unknown zawężający do { id: string; name: string }. Kiedy wolisz schemat (np. Zod)? {#ts-runtime-validation-q1}

Sprawdzam, że wartość jest obiektem i nie jest `null`, a potem każde pole przez `in` i `typeof`. Operator `in` zawęża typ obiektu, więc `value.id` jest dostępne bez rzutowania.

```ts
function isNamed(value: unknown): value is { id: string; name: string } {
  return (
    typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'name' in value && typeof value.name === 'string'
  );
}
```

Taki guard wystarcza dla jednego, płaskiego kształtu. Schemat wolę, gdy dane są zagnieżdżone, gdy ten sam kształt sprawdzam w wielu miejscach, gdy potrzebuję komunikatów błędów albo transformacji (np. string z URL na liczbę). Schemat jest też jednym źródłem prawdy: typ powstaje z niego przez `z.infer`, a w ręcznym guardzie typ i sprawdzenie mogą się rozjechać bez ostrzeżenia kompilatora.

### Dlaczego typ TypeScript nie chroni przed złymi danymi z API? {#ts-runtime-validation-q2}

Typy istnieją tylko w czasie kompilacji i są usuwane z wynikowego JavaScriptu. `res.json()` zwraca to, co przyszło z sieci, a `as User` jedynie mówi kompilatorowi, żeby uwierzył. Jeśli backend zmieni kontrakt, błąd pojawi się później, np. jako `undefined is not a function` w komponencie. Dlatego dane z sieci typuję jako `unknown` i przepuszczam przez schemat, który w runtime sprawdza kształt i zwraca poprawnie otypowany wynik albo błąd w jednym, przewidywalnym miejscu.

### Co znaczy "parse, don't validate"? {#ts-runtime-validation-q3}

Walidator zwraca tylko informację "OK" lub "nie OK", więc dalszy kod nie ma dowodu, że dane są poprawne, i często sprawdza je ponownie. Parser zamienia luźne dane (`unknown`) na precyzyjny typ albo zwraca błąd. Wiedza z kontroli zostaje zapisana w typie i kompilator pilnuje jej dalej. Parsowanie robi się na granicy systemu, zanim dane trafią do logiki. W praktyce to `Schema.parse(input)` przy odbiorze danych, a w środku aplikacji zwykłe typy bez dodatkowych `if`.

### Gdzie przebiega granica zaufania w aplikacji front-endowej? {#ts-runtime-validation-q4}

Wszędzie, gdzie dane przychodzą spoza kodu, który kontroluję: odpowiedzi HTTP i WebSocket, parametry URL, formularze, `localStorage` i IndexedDB, `postMessage` oraz SDK firm trzecich. Nawet własne API jest granicą, bo backend i front wdrażają się niezależnie. Waliduję tam raz, zwykle w warstwie klienta API lub w loaderze trasy, a komponenty dostają już sprawdzony typ. Walidacja na froncie nie zastępuje walidacji na serwerze: użytkownik może wysłać żądanie z pominięciem UI.

## Quiz

### Co zwraca `Offer.safeParse(data)` w Zod przy niepoprawnych danych? {#ts-runtime-validation-z1}

- [ ] Rzuca `ZodError`
- [x] Obiekt `{ success: false, error }`
- [ ] `undefined`
- [ ] Dane bez zmian z typem `Offer`

`safeParse` nie rzuca; zwraca unię z polem `success`, a wyjątek rzuca `parse`.

### Która konstrukcja sprawdza dane z API w runtime? {#ts-runtime-validation-z2}

- [ ] `const user = (await res.json()) as User`
- [ ] `const user = await fetchJson<User>(url)`
- [x] `const user = User.parse(await res.json())`
- [ ] `const user = (await res.json()) satisfies User`

Asercja, generyk i `satisfies` działają tylko w czasie kompilacji; schemat sprawdza wartość w runtime.
