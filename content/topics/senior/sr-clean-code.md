---
title: "Czysty kod w React i TypeScript"
level: mid
tags:
  - clean code
  - Single Responsibility
  - nazewnictwo
  - colocation
  - KISS
  - YAGNI
summary: "Czytelny kod ma dobre nazwy, małe funkcje na jednym poziomie abstrakcji i komponenty, które robią jedną rzecz. Pliki zmieniane razem leżą obok siebie, a komentarze tłumaczą tylko to, czego nie widać w kodzie."
sources:
  - title: "React: Thinking in React"
    url: https://react.dev/learn/thinking-in-react
  - title: "Martin Fowler: Yagni"
    url: https://martinfowler.com/bliki/Yagni.html
  - title: "Kent C. Dodds: Colocation"
    url: https://kentcdodds.com/blog/colocation
  - title: "ESLint: Disabling rules with inline comments"
    url: https://eslint.org/docs/latest/use/configure/rules
---

## Wyjaśnienie

Kod czyta się wielokrotnie częściej, niż się go pisze. Praktyki poniżej zmniejszają ilość kontekstu, który czytelnik musi trzymać w głowie.

Dobra nazwa mówi, co coś robi albo czym jest w domenie: `filterAvailableOffers`, `isRefundable`, `useBookingDraft`. Jeśli nie umiesz znaleźć nazwy i kończy się na `handleData`, `processItems` albo `OfferUtils`, to zwykle znak, że funkcja robi kilka rzeczy naraz albo że granica abstrakcji jest w złym miejscu. Spójnik "And" w nazwie (`validateAndSave`) mówi to samo wprost.

Funkcje powinny być małe i trzymać się jednego poziomu abstrakcji. `submitBooking` wywołuje `validate`, `buildPayload`, `sendBooking`. Nie miesza tego z ręcznym parsowaniem daty w środku. Czytasz ją jak spis treści i wchodzisz głębiej tylko tam, gdzie trzeba.

**Guard clauses** (early return): przypadki brzegowe obsługuj na początku i od razu wychodź z funkcji. Główna ścieżka zostaje bez zagnieżdżeń. W komponencie React wczesny `return` może stać dopiero po wszystkich hookach (Rules of Hooks).

KISS (Keep It Simple, Stupid) każe wybrać najprostsze rozwiązanie, które działa dziś. YAGNI (You Aren't Gonna Need It) dotyczy funkcji "na zapas": generycznego systemu motywów, gdy produkt ma jeden motyw, albo konfigurowalnej tabeli, gdy jest jedna tabela. Martin Fowler zaznacza, że YAGNI nie obejmuje refaktoryzacji ani testów. One właśnie pozwalają odkładać decyzje, bo kod da się potem łatwo zmienić.

**Single Responsibility** w React: komponent ma jeden powód do zmiany. Dokumentacja React radzi, żeby komponent zajmował się jedną rzeczą, a gdy rośnie, dzielił się na mniejsze. W praktyce rozdzielasz pobieranie danych (hook), czystą logikę (funkcja), prezentację (komponenty) i efekty uboczne, takie jak analityka.

**Spójność** (cohesion) mówi, jak mocno elementy wewnątrz modułu dotyczą jednego celu. **Sprzężenie** (coupling) mówi, jak bardzo moduł zależy od szczegółów innych modułów. Chcesz wysokiej spójności i niskiego sprzężenia.

**Colocation** to trzymanie obok siebie kodu, który zmienia się razem, na przykład `features/offers/` z komponentem, hookiem, funkcją filtrującą, testem i stylami. Foldery `components/`, `hooks/`, `utils/` na całą aplikację rozrzucają jedną funkcjonalność po pięciu miejscach. Szerzej o strukturze katalogów piszemy w temacie o architekturze frontu.

Komentarz ma sens, gdy wyjaśnia decyzję, której nie widać w kodzie: `// API returns prices in grosze to avoid float rounding`. Jeśli komentarz opisuje, co robi kod, zwykle lepiej poprawić nazwę albo wydzielić funkcję.

Reguł lint nie wyłączaj doraźnie. `eslint-disable-next-line react-hooks/exhaustive-deps` często ukrywa prawdziwy błąd, na przykład nieaktualne domknięcie. Jeśli wyłączenie jest naprawdę potrzebne, ESLint pozwala dopisać powód po `--`. Opcja `reportUnusedDisableDirectives` wyłapuje zbędne wyłączenia.

## Kod

```tsx title="Źle"
// Fetching, filtering, analytics and markup in one component
export function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/offers').then((r) => r.json()).then(setOffers);
  }, []);

  useEffect(() => {
    analytics.track('offers_viewed', { count: offers.length });
  }, [offers.length]);

  const visible = offers.filter((o) => o.title.toLowerCase().includes(query.toLowerCase()));

  return <>{/* 150 lines: search input, list, price formatting, empty state */}</>;
}
```

```tsx title="Dobrze"
// features/offers/filterOffers.ts: pure function, trivial to unit test
export const filterOffers = (offers: Offer[], query: string) =>
  offers.filter((o) => o.title.toLowerCase().includes(query.trim().toLowerCase()));

// features/offers/OffersPage.tsx: only composes the pieces
export function OffersPage() {
  const { data: offers = [], isPending } = useOffers(); // useQuery inside
  const [query, setQuery] = useState('');
  useTrackView('offers_viewed');

  if (isPending) return <OffersSkeleton />; // early return after all hooks

  const visible = filterOffers(offers, query);
  return (
    <>
      <OfferSearch value={query} onChange={setQuery} />
      {visible.length === 0 ? <NoOffers query={query} /> : <OfferList offers={visible} />}
    </>
  );
}
```

## Częste błędy

- Wczesny `return` przed wywołaniem hooka. React wymaga tej samej kolejności hooków w każdym renderze.
- Dzielenie komponentu na kawałki po liczbie linii, a nie po odpowiedzialności. Pięć plików, które zawsze zmieniasz razem, to gorzej niż jeden.
- Abstrakcje "na przyszłość": generyczny `<DataTable>` z 20 propsami dla jednej tabeli.
- Komentarze, które powtarzają kod (`// set loading to true`) i rozjeżdżają się z nim po pierwszej zmianie.

## Pytania

### Co znaczy Single Responsibility dla komponentu React? Podaj przykład naruszenia. {#sr-clean-code-q1}

Komponent ma jeden powód do zmiany. Naruszenie to na przykład `OffersPage`, który sam pobiera dane w `useEffect`, filtruje je, wysyła zdarzenie analityczne i renderuje 150 linii JSX. Zmiana endpointu, reguły filtrowania albo wyglądu karty oferty wymaga edycji tego samego pliku. Dzielę go tak: hook `useOffers` do danych, czysta funkcja `filterOffers` z testem jednostkowym, hook `useTrackView` do analityki, a `OffersPage` tylko składa `OfferSearch` i `OfferList`.

### Czym różni się spójność (cohesion) od sprzężenia (coupling)? {#sr-clean-code-q2}

Spójność opisuje wnętrze modułu: czy jego elementy służą jednemu celowi. Folder `features/checkout/` z formularzem, walidacją i wywołaniem API płatności ma wysoką spójność. Plik `utils.ts` z formatowaniem daty, debounce i walidacją NIP ma niską. Sprzężenie opisuje zależności między modułami: jak wiele jeden musi wiedzieć o drugim. Jeśli `search` importuje wewnętrzny hook z `checkout`, każda zmiana w koszyku może zepsuć wyszukiwarkę. Dążę do wysokiej spójności i niskiego sprzężenia: moduły wystawiają małe publiczne API (`index.ts`), a reszta zostaje w środku.

### Jak guard clauses poprawiają czytelność? {#sr-clean-code-q3}

Obsługują przypadki brzegowe na początku funkcji i od razu z niej wychodzą. Dzięki temu główna logika nie siedzi w trzech poziomach `if`, a czytelnik od razu widzi warunki wstępne. W komponencie React taki `return` musi stać po wszystkich hookach.

```ts
function refundAmount(booking: Booking): number {
  if (booking.status !== 'paid') return 0;
  if (!booking.isRefundable) return 0;
  if (daysUntil(booking.startDate) < 14) return booking.total * 0.5;
  return booking.total;
}
```

### Kiedy piszesz komentarz w kodzie, a kiedy wyłączasz regułę lint? {#sr-clean-code-q4}

Komentarz piszę, gdy kod nie pokaże powodu: obejście błędu przeglądarki z linkiem do zgłoszenia, wymaganie prawne, nieintuicyjny format z API. Jeśli komentarz tłumaczy, co robi kod, wolę zmienić nazwę albo wydzielić funkcję. Reguły lint wyłączam rzadko i zawsze z powodem po `--`, na przykład `// eslint-disable-next-line no-console -- CLI output`. Przy `react-hooks/exhaustive-deps` najpierw szukam prawdziwego problemu, bo wyłączenie zwykle ukrywa nieaktualne domknięcie.

## Quiz

### Który podział komponentu najlepiej realizuje Single Responsibility? {#sr-clean-code-z1}

- [ ] Podział na pliki po 50 linii, niezależnie od zawartości
- [x] Osobno pobieranie danych, czysta logika, prezentacja i analityka
- [ ] Przeniesienie wszystkich hooków do globalnego folderu `hooks/`
- [ ] Jeden komponent z flagami sterującymi każdą częścią

Odpowiedzialność to powód do zmiany, więc dzielimy kod według tego, co zmienia się niezależnie.

### Według Martina Fowlera YAGNI nie dotyczy: {#sr-clean-code-z2}

- [ ] Konfigurowalnego systemu motywów, gdy produkt ma jeden motyw
- [ ] Obsługi przyszłych walut, o które nikt nie prosił
- [x] Refaktoryzacji i testów, które ułatwiają późniejsze zmiany
- [ ] Generycznego komponentu na zapas

YAGNI odrzuca funkcje budowane z wyprzedzeniem, a refaktoryzacja i testy to praktyki, dzięki którym YAGNI w ogóle działa.
