---
title: "Formularze i refy: kontrolowane pola, useRef i akcje w React 19"
level: mid
added: 2026-10-23
tags:
  - formularze
  - useRef
  - useActionState
  - useFormStatus
  - walidacja
summary: Pole kontrolowane trzyma wartość w stanie React, niekontrolowane w DOM, a ty czytasz ją przy wysyłce przez `FormData`. W React 19 `ref` jest zwykłym propem, a `<form action>` z `useActionState` i `useFormStatus` obsługuje wysyłkę, stan oczekiwania i błędy bez ręcznego `onSubmit`.
sources:
  - title: "React: input (controlled and uncontrolled)"
    url: https://react.dev/reference/react-dom/components/input
  - title: "React: form"
    url: https://react.dev/reference/react-dom/components/form
  - title: "React: useActionState"
    url: https://react.dev/reference/react/useActionState
  - title: "React: useFormStatus"
    url: https://react.dev/reference/react-dom/hooks/useFormStatus
  - title: "React: useRef"
    url: https://react.dev/reference/react/useRef
  - title: "React: useImperativeHandle"
    url: https://react.dev/reference/react/useImperativeHandle
  - title: "MDN: Constraint validation"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation
---

## Wyjaśnienie

**Pole kontrolowane** dostaje `value` i `onChange`. Wartość żyje w stanie, a React wymusza ją w DOM przy każdym renderze. Dzięki temu w każdej chwili znasz wartość: możesz walidować w trakcie pisania, formatować, blokować przycisk albo pokazywać podgląd. Kosztem jest re-render przy każdym znaku.

**Pole niekontrolowane** dostaje `defaultValue` (lub `defaultChecked`), a dalej wartością zarządza przeglądarka. Czytasz ją dopiero przy wysyłce: `new FormData(form)` zbiera wszystkie pola z atrybutem `name`. Mniej kodu i mniej renderów, dobre dla prostych formularzy.

Pole nie może zmieniać trybu w trakcie życia. `value={user.name}`, gdzie `name` najpierw jest `undefined`, daje ostrzeżenie o przejściu z niekontrolowanego na kontrolowane. Pomaga `value={user.name ?? ''}`. Samo `value` bez `onChange` robi pole tylko do odczytu.

`useRef` ma dwa zastosowania. Pierwsze to dostęp do węzła DOM: fokus, przewinięcie, pomiar, integracja z biblioteką spoza React. Drugie to zmienna, która przetrwa render, ale jej zmiana nie powinna go wywołać: ID timera, poprzednia wartość, flaga "już wysłano". Zmiana `ref.current` nie powoduje re-renderu, więc nie czytaj ani nie zapisuj go w trakcie renderu (wyjątkiem jest leniwa inicjalizacja).

W React 19 komponent funkcyjny przyjmuje `ref` jak zwykły prop, więc `forwardRef` nie jest już potrzebny (ma zostać oznaczony jako przestarzały w przyszłej wersji). `useImperativeHandle` pozwala wystawić zamiast węzła DOM własne API, np. tylko `focus()`. Używaj go rzadko: jeśli coś da się wyrazić propem (`isOpen`), nie rób z tego metody `open()`.

React 19 obsługuje akcje formularzy także na kliencie:

- `<form action={fn}>` wywołuje `fn(formData)` w transition. Nie potrzebujesz `e.preventDefault()`. Po udanej akcji React resetuje niekontrolowane pola.
- `useActionState(action, initialState)` zwraca `[state, formAction, isPending]`. Akcja dostaje poprzedni stan i `FormData`, a zwraca nowy stan, np. błędy walidacji albo komunikat o sukcesie.
- `useFormStatus()` z `react-dom` zwraca m.in. `pending` formularza, w którym jest wyrenderowany komponent. Musi być wywołany w dziecku `<form>`, nie w komponencie, który ten formularz renderuje.
- `useOptimistic` pokazuje wynik od razu (np. nowy komentarz na liście), zanim serwer odpowie. Po zakończeniu akcji React wraca do prawdziwego stanu, a przy błędzie optymistyczna zmiana znika.

Walidację warto robić na dwóch poziomach. Natywne atrybuty (`required`, `type="email"`, `min`, `pattern`) dają darmowe komunikaty przeglądarki, obsługę czytników ekranu i `:invalid` w CSS. Schemat (np. Zod) w akcji sprawdza to samo w kodzie, daje typy i może być współdzielony z backendem. Walidacja po stronie klienta nigdy nie zastępuje walidacji na serwerze.

## Kod

```tsx title="Kontrolowane, niekontrolowane i ref"
function SearchBox({ ref }: { ref?: React.Ref<HTMLInputElement> }) {
  const [query, setQuery] = useState(''); // controlled: live filtering
  return <input ref={ref} value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function Newsletter() {
  const inputRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email'); // uncontrolled: read on submit
    if (!email) inputRef.current?.focus();
  }
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} name="email" type="email" defaultValue="" />
      <button>Zapisz</button>
    </form>
  );
}
```

```tsx title="Akcja formularza z useActionState, useFormStatus i Zod"
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

const schema = z.object({
  email: z.email('Podaj poprawny adres e-mail'),
  guests: z.coerce.number().int().min(1, 'Minimum 1 osoba').max(8, 'Maksymalnie 8 osób'),
});
// schema.safeParse({ email: 'ala@', guests: '0' }) gives fieldErrors:
// { email: ['Podaj poprawny adres e-mail'], guests: ['Minimum 1 osoba'] }

type State = { errors?: Record<string, string[]>; values?: Record<string, string>; ok?: boolean };

async function bookAction(_prev: State, formData: FormData): Promise<State> {
  const values = Object.fromEntries(formData) as Record<string, string>;
  const result = schema.safeParse(values);
  if (!result.success) return { errors: z.flattenError(result.error).fieldErrors, values };
  await createBooking(result.data); // the server validates again
  return { ok: true };
}

function SubmitButton() {
  const { pending } = useFormStatus(); // reads the parent <form>
  return <button disabled={pending}>{pending ? 'Wysyłanie...' : 'Rezerwuj'}</button>;
}

export function BookingForm() {
  const [state, formAction] = useActionState(bookAction, {});
  return (
    <form action={formAction}>
      {/* the form resets after the action, so keep typed values as defaults */}
      <input name="email" type="email" required defaultValue={state.values?.email} />
      {state.errors?.email && <p role="alert">{state.errors.email[0]}</p>}
      <input name="guests" type="number" min={1} max={8} required defaultValue={state.values?.guests ?? '2'} />
      {state.errors?.guests && <p role="alert">{state.errors.guests[0]}</p>}
      <SubmitButton />
      {state.ok && <p role="status">Rezerwacja przyjęta</p>}
    </form>
  );
}
```

## Częste błędy

- `useFormStatus` wywołany w tym samym komponencie, który renderuje `<form>`: `pending` nigdy nie będzie `true`.
- Zapomniany reset pól po akcji: React czyści niekontrolowane pola po każdej akcji zakończonej bez wyjątku, także gdy zwraca ona błędy walidacji. Zwróć wpisane wartości w stanie i użyj ich jako `defaultValue`.
- Trzymanie w `useRef` danych, które mają być widoczne w UI. Zmiana ref nie odświeży ekranu; to zadanie dla `useState`.
- Kontrolowanie każdego pola dużego formularza, gdy wystarczy odczyt przy wysyłce. Każdy znak to re-render całego formularza.

## Pytania

### Czym różni się komponent kontrolowany od niekontrolowanego i kiedy który wybierzesz? {#react-forms-refs-q1}

W kontrolowanym polu wartość trzyma stan React: przekazujesz `value` i aktualizujesz ją w `onChange`. W niekontrolowanym wartość trzyma DOM, ustawiasz tylko `defaultValue` i czytasz ją przy wysyłce przez `FormData` albo ref. Kontrolowane wybieram, gdy UI reaguje na wartość w trakcie pisania: filtrowanie listy, maska numeru telefonu, zależne pola, blokada przycisku. Niekontrolowane wybieram dla prostych formularzy wysyłanych w całości, zwłaszcza z `<form action>` w React 19. Mniej renderów i mniej kodu, a walidację zapewniają natywne atrybuty i schemat w akcji.

### Do czego służy useRef poza dostępem do DOM? {#react-forms-refs-q2}

Do przechowywania wartości, która ma przetrwać między renderami, ale nie wpływa na to, co widać. Przykłady: ID `setTimeout` do anulowania, instancja zewnętrznej biblioteki, poprzednia wartość propsa, licznik prób. Zmiana `ref.current` nie wywołuje re-renderu, dlatego refa nie czyta się ani nie zapisuje w trakcie renderu, tylko w handlerach i efektach. Jeśli wartość ma się pokazać na ekranie, powinna być w `useState`.

```tsx
const timerRef = useRef<number | null>(null);
function onType() {
  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = window.setTimeout(save, 500);
}
```

### Jak przekazać ref do własnego komponentu w React 19? {#react-forms-refs-q3}

W React 19 `ref` jest zwykłym propem komponentu funkcyjnego. Odbierasz go w props i przekazujesz dalej do elementu DOM, bez `forwardRef`. `forwardRef` nadal działa, ale nie jest już potrzebny i ma zostać oznaczony jako przestarzały. Gdy nie chcesz wystawiać całego węzła DOM, używasz `useImperativeHandle` i zwracasz tylko wybrane metody, np. `focus`. Robię to rzadko: zachowanie, które da się opisać propem, przekazuję propem.

```tsx
function TextField({ ref, ...props }: React.ComponentProps<'input'>) {
  return <input ref={ref} {...props} />;
}
```

### Jak działają akcje formularzy w React 19 na kliencie? {#react-forms-refs-q4}

Do `<form action>` przekazujesz funkcję, którą React wywoła z `FormData` w transition, bez `preventDefault`. `useActionState` opakowuje ją tak, że dostaje poprzedni stan i zwraca nowy, a hook daje `[state, formAction, isPending]`. W stanie zwracam błędy walidacji albo komunikat o sukcesie. Przycisk wysyłki czyta `pending` przez `useFormStatus` w komponencie wyrenderowanym wewnątrz formularza. Po udanej akcji React resetuje niekontrolowane pola, a nieoczekiwany wyjątek trafia do error boundary.

## Quiz

### Gdzie trzeba wywołać `useFormStatus`, żeby `pending` działało? {#react-forms-refs-z1}

- [ ] W komponencie, który renderuje `<form>`
- [x] W komponencie wyrenderowanym wewnątrz `<form>`
- [ ] W dowolnym komponencie, z ID formularza jako argumentem
- [ ] W akcji przekazanej do `action`

`useFormStatus` zwraca status formularza-rodzica, więc musi być wywołany w jego dziecku, np. w komponencie przycisku.

### Co się stanie po zmianie `ref.current` w handlerze kliknięcia? {#react-forms-refs-z2}

- [ ] Komponent wyrenderuje się ponownie
- [x] Wartość się zmieni, ale React nie wyrenderuje komponentu ponownie
- [ ] React rzuci błąd, bo refy są tylko do odczytu
- [ ] Zmiana zostanie cofnięta przy następnym renderze

Ref to zwykły obiekt, o którego zmianach React nie wie, więc nie planuje re-renderu.
