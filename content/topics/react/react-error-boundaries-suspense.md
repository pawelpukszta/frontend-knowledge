---
title: Error boundaries i Suspense
level: mid
added: 2026-10-23
tags:
  - error boundary
  - Suspense
  - use
  - react-error-boundary
  - streaming
summary: Error boundary łapie błędy renderowania w poddrzewie i pokazuje fallback zamiast pustej strony. Suspense pokazuje fallback, dopóki kod (`lazy`) albo dane (`use`) nie są gotowe; razem wyznaczają, która część UI ładuje się i psuje niezależnie.
sources:
  - title: "React: Catching rendering errors with an Error Boundary"
    url: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
  - title: "React: Suspense"
    url: https://react.dev/reference/react/Suspense
  - title: "React: use"
    url: https://react.dev/reference/react/use
  - title: "React: createRoot (onCaughtError, onUncaughtError)"
    url: https://react.dev/reference/react-dom/client/createRoot
  - title: "react-error-boundary (GitHub)"
    url: https://github.com/bvaughn/react-error-boundary
---

## Wyjaśnienie

Gdy komponent rzuci błąd w trakcie renderowania i nic go nie złapie, React odmontowuje całe drzewo. Użytkownik widzi pustą stronę. **Error boundary** to komponent, który łapie takie błędy w swoim poddrzewie i renderuje fallback, np. "Nie udało się wczytać opinii" z przyciskiem "Spróbuj ponownie".

Error boundary nie złapie błędów:

- w event handlerach (tam używasz zwykłego `try/catch` i stanu),
- w kodzie asynchronicznym, np. w `setTimeout` czy w `.then()` po `fetch` w efekcie,
- podczas renderowania na serwerze,
- rzuconych przez sam boundary, a nie przez jego dzieci.

Wyjątek: błąd w funkcji przekazanej do `startTransition` trafia do najbliższego boundary. To samo dotyczy odrzuconego Promise czytanego przez `use`.

W React 19 error boundary nadal pisze się jako klasę z `static getDerivedStateFromError` (przełącza na fallback) i `componentDidCatch` (logowanie). Nie ma hooka, który by to zastąpił. W praktyce używa się biblioteki `react-error-boundary`: daje komponent `ErrorBoundary` z `FallbackComponent`, funkcję `resetErrorBoundary`, `resetKeys` do automatycznego resetu i hook `useErrorBoundary`, którym przekażesz do boundary błąd z event handlera (`showBoundary(error)`).

React 19 dodał też opcje `onCaughtError` i `onUncaughtError` w `createRoot` (oraz `onRecoverableError`). Dostają błąd i `componentStack`, więc to dobre miejsce na jedno wspólne wysyłanie błędów do Sentry lub innego narzędzia.

Granularność dobierasz do tego, co ma przetrwać awarię. Jeden boundary na całą aplikację to ostatnia linia obrony. Do tego boundary na trasę i na niezależne sekcje: zepsuty widget opinii nie powinien zabierać przycisku "Rezerwuj". Owijanie każdego przycisku osobno to przesada, bo ekran zamienia się w mozaikę komunikatów.

**Suspense** pokazuje `fallback`, dopóki dzieci "czekają". Czekanie włączają: `lazy` (kod komponentu), `use(promise)` (dane) oraz frameworki i biblioteki zgodne z Suspense (Next.js, `useSuspenseQuery` w TanStack Query). Fetch w `useEffect` nie włącza Suspense. `use` czyta wartość Promise w trakcie renderu. Promise musi być stabilny między renderami, więc tworzy się go poza komponentem, w cache albo w Server Component. Promise tworzony w renderze powstaje od nowa przy każdym renderze i fallback pokazuje się w kółko. Odrzucony Promise trafia do najbliższego error boundary.

Fallback umieszczasz tam, gdzie ma się pojawić szkielet. Zagnieżdżone boundary odsłaniają treść etapami: nagłówek oferty od razu, opinie później. Przy streamingu SSR serwer wysyła najpierw powłokę strony z fallbackami, a potem HTML każdej sekcji, gdy jej dane są gotowe. Gdy aktualizacja (np. zmiana zakładki) wstrzymuje już widoczną treść, `startTransition` każe Reactowi zostawić stary widok zamiast wracać do spinnera.

## Kod

```tsx title="Sekcja z własnym boundary i Suspense"
import { lazy, Suspense, use } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

const OfferMap = lazy(() => import('./OfferMap'));

function SectionError({ resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Nie udało się wczytać opinii.</p>
      <button onClick={resetErrorBoundary}>Spróbuj ponownie</button>
    </div>
  );
}

// reviewsPromise is created outside render (router loader, cache or Server Component)
function Reviews({ reviewsPromise }: { reviewsPromise: Promise<Review[]> }) {
  const reviews = use(reviewsPromise); // suspends while pending, throws on rejection
  return <ReviewList reviews={reviews} />;
}

export function OfferPage({ offerId, reviewsPromise }: Props) {
  return (
    <>
      <OfferHeader offerId={offerId} />
      <ErrorBoundary FallbackComponent={SectionError} resetKeys={[offerId]}>
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews reviewsPromise={reviewsPromise} />
        </Suspense>
      </ErrorBoundary>
      <Suspense fallback={<MapPlaceholder />}>
        <OfferMap offerId={offerId} />
      </Suspense>
    </>
  );
}
```

```tsx title="Wspólne raportowanie błędów (React 19)"
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!, {
  onCaughtError(error, errorInfo) {
    // caught by an error boundary: the user saw a fallback
    reportError(error, { componentStack: errorInfo.componentStack, handled: true });
  },
  onUncaughtError(error, errorInfo) {
    // not caught: React unmounted the tree
    reportError(error, { componentStack: errorInfo.componentStack, handled: false });
  },
}).render(<App />);
```

## Częste błędy

- Oczekiwanie, że error boundary złapie błąd z `onClick` albo z `fetch` w `useEffect`. Taki błąd trzeba obsłużyć samemu albo przekazać przez `showBoundary`.
- Tworzenie Promise w renderze i przekazanie go do `use`: fallback wraca przy każdym renderze.
- Przycisk "Spróbuj ponownie", który resetuje boundary, ale nie ponawia zapytania. Dane z cache rzucają ten sam błąd jeszcze raz (w TanStack Query służy do tego `QueryErrorResetBoundary`).
- Jeden `Suspense` na całą stronę: najwolniejsze zapytanie trzyma spinner zamiast całej treści.

## Pytania

### Jakich błędów nie złapie error boundary? {#react-error-boundaries-suspense-q1}

Boundary łapie błędy rzucone podczas renderowania swoich dzieci, także tych głęboko zagnieżdżonych. Nie złapie błędów w event handlerach, bo te działają poza renderem. Nie złapie też kodu asynchronicznego, takiego jak `setTimeout` czy `.then()` po zapytaniu w efekcie, błędów przy renderowaniu na serwerze ani błędów rzuconych przez sam boundary. Błąd z handlera łapiesz `try/catch` i pokazujesz przez stan albo przekazujesz do boundary przez `showBoundary` z `react-error-boundary`. Błędy z `startTransition` i z odrzuconego Promise czytanego przez `use` trafiają do boundary.

```tsx
const { showBoundary } = useErrorBoundary();
async function onSave() {
  try { await saveOffer(); } catch (error) { showBoundary(error); }
}
```

### Jak dobrać granularność error boundaries? {#react-error-boundaries-suspense-q2}

Pytam, co ma działać, gdy dana część się zepsuje. Globalny boundary przy korzeniu łapie wszystko i pokazuje ekran "Coś poszło nie tak" zamiast pustej strony. Boundary na poziomie trasy pozwala zostawić nawigację i przejść gdzie indziej. Boundary wokół niezależnych sekcji (opinie, mapa, rekomendacje) sprawia, że awaria jednej nie zabiera reszty strony. Nie owijam każdego małego komponentu, bo dziesięć komunikatów o błędzie na jednym ekranie jest gorsze od jednego. `resetKeys` resetuje boundary po zmianie np. ID oferty.

### Czym jest `use` w React 19 i jak współpracuje z Suspense? {#react-error-boundaries-suspense-q3}

`use` to API, które czyta wartość Promise albo Context w trakcie renderu. Gdy Promise jest w toku, komponent wstrzymuje się i najbliższy `Suspense` pokazuje fallback. Po spełnieniu React renderuje komponent z danymi, a po odrzuceniu błąd trafia do najbliższego error boundary. W odróżnieniu od hooków `use` można wywołać w warunku lub pętli, ale nie w `try/catch`. Promise musi być stabilny: tworzy go Server Component, loader routera albo cache, a nie render komponentu.

### Gdzie umieścić fallback Suspense? {#react-error-boundaries-suspense-q4}

Tam, gdzie chcesz pokazać szkielet ładowania, czyli zwykle wokół sekcji, która czeka na dane. Treść w jednym boundary pojawia się razem, więc zagnieżdżone boundary pozwalają pokazać najpierw ważne części (nagłówek, cena), a resztę później. Zbyt wysoko postawiony boundary chowa całą stronę za jednym spinnerem. Zbyt wiele boundary daje efekt "popcornu", gdy elementy wskakują w losowej kolejności. Przy zmianie danych w już widocznej sekcji używam `startTransition`, żeby nie wracać do fallbacku, albo `key` na `Suspense`, gdy chcę go świadomie zresetować.

## Quiz

### Który błąd złapie error boundary bez dodatkowego kodu? {#react-error-boundaries-suspense-z1}

- [ ] Wyjątek rzucony w `onClick`
- [ ] Wyjątek w callbacku `setTimeout`
- [x] Wyjątek rzucony podczas renderowania komponentu-dziecka
- [ ] Wyjątek rzucony w metodzie `render` samego boundary

Boundary łapie błędy renderowania swojego poddrzewa, a handlery, kod asynchroniczny i jego własne błędy są poza jego zasięgiem.

### Co się stanie, gdy przekażesz do `use` Promise tworzony w każdym renderze (`use(fetch(url))`)? {#react-error-boundaries-suspense-z2}

- [ ] React zapamięta pierwszy Promise i zignoruje kolejne
- [x] Komponent będzie wstrzymywał się w kółko i fallback będzie wracał
- [ ] `use` rzuci błąd składni
- [ ] Zadziała tak samo jak z Promise z cache

Każdy render tworzy nowy Promise, więc React za każdym razem znów czeka i pokazuje fallback Suspense.
