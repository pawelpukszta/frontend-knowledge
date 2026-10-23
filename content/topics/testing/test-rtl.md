---
title: "React Testing Library: testuj jak użytkownik"
level: mid
added: 2026-10-23
tags:
  - Testing Library
  - user-event
  - getByRole
  - findBy
  - testy
summary: "Test ma robić to, co robi użytkownik: szukać elementów po roli i nazwie, klikać i pisać przez `userEvent`, czekać na wynik przez `findBy*`. Stan, propsy i instancje komponentu zostają poza testem."
sources:
  - title: "Testing Library: About Queries (priorytet zapytań)"
    url: https://testing-library.com/docs/queries/about/
  - title: "Testing Library: user-event Introduction"
    url: https://testing-library.com/docs/user-event/intro
  - title: "Kent C. Dodds: Common mistakes with React Testing Library"
    url: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
  - title: "Kent C. Dodds: Testing Implementation Details"
    url: https://kentcdodds.com/blog/testing-implementation-details
---

## Wyjaśnienie

React Testing Library (RTL) renderuje komponent do DOM (w Vitest zwykle jsdom lub happy-dom) i daje zapytania, które szukają elementów tak, jak szuka ich człowiek. Nie daje dostępu do stanu, propsów ani instancji komponentu, więc test widzi tylko to, co jest na ekranie i co da się kliknąć.

Testy szczegółów implementacji psują się w dwie strony. Zmiana nazwy pola w stanie wywala test, choć aplikacja działa (fałszywy alarm). A źle podpięty `onClick` przechodzi, bo test ustawił stan ręcznie, z pominięciem przycisku. Ogólną strategię testów (piramida, testing trophy) opisuje temat o strategii testów; tu skupiamy się na samym pisaniu testu.

Dokumentacja Testing Library podaje kolejność, w jakiej warto sięgać po zapytania:

1. `getByRole` z opcją `name`, np. `getByRole('button', { name: /zapisz/i })`. Działa dla prawie wszystkiego. Jeśli elementu nie da się znaleźć po roli, często znaczy to, że UI jest niedostępne.
2. `getByLabelText` dla pól formularza.
3. `getByPlaceholderText`, `getByText`, `getByDisplayValue`.
4. `getByAltText`, `getByTitle`.
5. `getByTestId` na końcu: gdy roli ani tekstu nie da się sensownie użyć, np. kontener wykresu z canvas albo element z dynamiczną treścią.

Każde zapytanie występuje w trzech wariantach:

| Zapytanie | Brak elementu | Czeka? | Do czego |
|---|---|---|---|
| `getBy*` | rzuca błąd | nie | element jest w DOM teraz |
| `queryBy*` | zwraca `null` | nie | tylko sprawdzanie, że elementu nie ma |
| `findBy*` | odrzuca Promise | tak (domyślnie 1000 ms) | element pojawi się po chwili |

Zapytania wywołuj przez `screen` zamiast destrukturyzować wynik `render`. Nie trzeba wtedy pilnować listy wyciąganych funkcji, a test czyta się jak opis ekranu.

Do interakcji używaj `userEvent`. `fireEvent.click` wysyła jedno zdarzenie DOM, a `user.click` odtwarza całą sekwencję: najechanie kursorem, wciśnięcie przycisku myszy, przeniesienie focusu, puszczenie i `click`. `userEvent` respektuje też `disabled` i niewidoczne elementy, więc nie kliknie czegoś, czego użytkownik kliknąć nie może. Wywołaj `userEvent.setup()` na początku testu, przed `render`, i `await`-uj każdą akcję.

Gdy UI zmienia się asynchronicznie, nie wstawiaj `setTimeout` do testu. Użyj `await screen.findByRole(...)` albo `await waitFor(() => expect(...))`. `findBy*` to skrót na `waitFor` + `getBy*` i daje lepszy komunikat błędu. W `waitFor` umieszczaj tylko asercję, bez kliknięć: callback może się wykonać wiele razy.

Test ma trzy części: arrange (render, dane), act (akcje użytkownika) i assert (co widać). Nazwa testu opisuje efekt widoczny dla użytkownika: "pokazuje błąd przy złym haśle", a nie "ustawia `error` w stanie".

## Kod

```tsx title="Formularz logowania"
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw/http';
import { server } from '../mocks/node';
import { LoginForm } from './LoginForm';

test('shows an error message when the password is wrong', async () => {
  server.use(
    http.post('/api/login', () =>
      HttpResponse.json({ message: 'Nieprawidłowe hasło' }, { status: 401 }),
    ),
  );
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText(/e-mail/i), 'ala@example.com');
  await user.type(screen.getByLabelText(/hasło/i), 'wrong');
  await user.click(screen.getByRole('button', { name: /zaloguj/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/nieprawidłowe hasło/i);
  expect(screen.queryByRole('heading', { name: /witaj/i })).not.toBeInTheDocument();
});
```

```tsx title="Źle i dobrze"
// Bad: implementation details, fireEvent, arbitrary sleep
const { container } = render(<Dropdown />);
fireEvent.click(container.querySelector('.dropdown__toggle')!);
await new Promise((r) => setTimeout(r, 500));
expect(container.querySelectorAll('li')).toHaveLength(3);

// Good: role + name, real interaction, waiting for the result
const user = userEvent.setup();
render(<Dropdown />);
await user.click(screen.getByRole('button', { name: /sortuj/i }));
expect(await screen.findAllByRole('option')).toHaveLength(3);
```

## Częste błędy

- `getByTestId` lub `container.querySelector` wszędzie, choć element ma rolę i dostępną nazwę.
- `queryBy*` do sprawdzania, że element jest na ekranie. Przy braku elementu dostajesz mało czytelny błąd; do obecności używaj `getBy*` lub `findBy*`.
- Czekanie przez `setTimeout` albo pusty `waitFor(() => {})`. Test jest wtedy wolny albo niestabilny.
- Kliknięcia i wpisywanie wewnątrz `waitFor`, owijanie `render` i `userEvent` w dodatkowy `act` (RTL robi to sam), brak `await` przed akcją `user.*`.

## Pytania

### Jak przetestujesz formularz logowania? Co sprawdzasz, a czego nie? {#test-rtl-q1}

Renderuję formularz, a sieć mockuję przez MSW. Wypełniam pola znalezione po etykiecie (`getByLabelText`) i klikam przycisk znaleziony po roli i nazwie. Sprawdzam efekty widoczne dla użytkownika. Po poprawnych danych pojawia się powitanie albo następuje przekierowanie. Złe hasło daje komunikat błędu w `role="alert"`. Puste pole kończy się walidacją przy polu, a w trakcie wysyłania przycisk jest zablokowany. Nie sprawdzam stanu komponentu, liczby renderów, wywołań `setState` ani tego, jaką funkcję wywołał handler. Nie asertuję też samego requestu: jeśli formularz wyśle złe dane, handler MSW zwróci błąd i test to pokaże.

### Kolega napisał test `expect(component.state.isOpen).toBe(true)`. Jak go przepiszesz? {#test-rtl-q2}

Ten test sprawdza wewnętrzny stan, więc zepsuje się po zmianie nazwy pola albo po przejściu z klasy na hook, choć zachowanie się nie zmieni. Przejdzie też, gdy przycisk jest źle podpięty. Pytam, co widzi użytkownik, gdy `isOpen` jest `true`: zwykle rozwinięty panel lub menu. Ten widoczny efekt testuję.

```tsx
const user = userEvent.setup();
render(<Accordion />);
const toggle = screen.getByRole('button', { name: /szczegóły/i });
await user.click(toggle);
expect(toggle).toHaveAttribute('aria-expanded', 'true');
expect(screen.getByRole('region', { name: /szczegóły/i })).toBeVisible();
```

### Czym różnią się `getBy`, `queryBy` i `findBy`? {#test-rtl-q3}

`getBy*` szuka synchronicznie i rzuca błąd, gdy elementu nie ma albo jest ich kilka. `queryBy*` przy braku zwraca `null`, więc nadaje się tylko do asercji, że czegoś nie ma. `findBy*` zwraca Promise i ponawia wyszukiwanie, aż element się pojawi albo minie timeout (domyślnie 1000 ms). Używam go po akcjach, które zmieniają UI asynchronicznie, np. po odpowiedzi z API. Każda z nich ma też wariant `*AllBy*` dla wielu elementów.

### Dlaczego `userEvent` zamiast `fireEvent`? {#test-rtl-q4}

`fireEvent` wysyła pojedyncze zdarzenie DOM. `userEvent` odtwarza całą sekwencję, jaką wywołuje prawdziwy użytkownik: przy pisaniu `keydown`, `keypress`, `input` i `keyup` dla każdego znaku, przy kliknięciu także zmianę focusu. Nie pozwala kliknąć elementu z `disabled` ani ukrytego. Dzięki temu test łapie błędy, których `fireEvent` nie zauważy. Instancję tworzę przez `userEvent.setup()` przed `render`, a każdą akcję `await`-uję.

## Quiz

### Które zapytanie Testing Library zaleca jako pierwszy wybór? {#test-rtl-z1}

- [ ] `getByTestId`
- [ ] `getByText`
- [x] `getByRole` z opcją `name`
- [ ] `container.querySelector`

Rola z dostępną nazwą odpowiada temu, jak element widzą użytkownicy, także ci z czytnikiem ekranu.

### Jak poprawnie poczekać na komunikat, który pojawi się po odpowiedzi z API? {#test-rtl-z2}

- [ ] `await new Promise((r) => setTimeout(r, 1000))`, potem `getByText`
- [x] `await screen.findByText(...)`
- [ ] `screen.queryByText(...)` bez `await`
- [ ] `await waitFor(() => {})`, potem `getByText`

`findBy*` ponawia wyszukiwanie, aż element się pojawi, więc test nie zależy od sztywnego czasu.
