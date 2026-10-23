---
title: "Wzorce kompozycji: children, sloty i compound components"
level: senior
added: 2026-10-23
tags:
  - composition
  - children
  - compound components
  - refaktoryzacja
  - state colocation
summary: Zamiast dokładać kolejne props konfiguracyjne, przekazuj gotowe elementy przez `children` i sloty, a powiązane części łącz w compound components. Duży komponent strony dziel na sekcje, które same pobierają dane i obsługują swoje stany ładowania i błędu.
sources:
  - title: "React: Passing Props to a Component (children)"
    url: https://react.dev/learn/passing-props-to-a-component
  - title: "React: Thinking in React"
    url: https://react.dev/learn/thinking-in-react
  - title: "patterns.dev: Compound Pattern"
    url: https://www.patterns.dev/react/compound-pattern/
  - title: "TanStack Query: useQuery"
    url: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
---

## Wyjaśnienie

Komponent zwykle zaczyna od dwóch props. Po roku ma ich dwadzieścia: `title`, `subtitle`, `icon`, `showFooter`, `footerText`, `footerAction`, `variant`. Każdy nowy przypadek to kolejna flaga i kolejny `if` w środku. Komponent musi znać wszystkie warianty użycia, a ktoś, kto go używa, musi pamiętać, które kombinacje flag ze sobą działają.

Kompozycja odwraca ten układ. Komponent zostawia "dziury", a rodzic wypełnia je gotowym JSX:

- `children` to jedna dziura na główną treść. `Card` nie musi wiedzieć, co w nim jest.
- Sloty to kilka nazwanych dziur w zwykłych props: `header={<OfferHeader />}`, `actions={<Button>Rezerwuj</Button>}`. Komponent decyduje o układzie i stylach, rodzic o zawartości.
- **Compound components** to zestaw komponentów, które działają tylko razem: `Tabs`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`. Rodzic trzyma stan (aktywna zakładka) i udostępnia go dzieciom przez Context. Użytkownik składa strukturę jak w HTML (`<select>` i `<option>`), a nie opisuje jej tablicą obiektów.

Starsze implementacje compound components używały `React.Children.map` i `cloneElement`. To działa tylko dla bezpośrednich dzieci: owinięcie `Tabs.Tab` w `div` albo własny komponent przerywa przekazywanie props. Context nie ma tego ograniczenia.

Druga grupa technik dotyczy podziału kodu. Gałąź warunkową (`isEditing ? ... : ...`) z własnym stanem i efektami warto wydzielić do osobnego komponentu. Hooki trafiają wtedy tam, gdzie są potrzebne, a przełączenie gałęzi naturalnie resetuje jej stan. Stan trzymaj jak najbliżej miejsca użycia i podnoś go dopiero wtedy, gdy potrzebuje go rodzeństwo. Wpływ takiego podziału na liczbę re-renderów opisuje temat o optymalizacji bez `memo`.

**God component** to komponent, który robi wszystko: pobiera dane z kilku źródeł, trzyma kilkanaście `useState`, ma osobne `if (loading)` i `if (error)` dla każdego zapytania i renderuje całą stronę. Typowy objaw: zmiana w jednej sekcji wymaga przewinięcia 600 linii i grozi zepsuciem innej. Refaktoryzacja polega na podziale strony na sekcje, które same pobierają swoje dane (np. przez TanStack Query) i same obsługują ładowanie i błąd. Strona zostaje układem, który składa sekcje. TanStack Query deduplikuje zapytania z tym samym kluczem, więc dwie sekcje mogą prosić o te same dane bez dodatkowego żądania.

Prop `as` (polimorficzny komponent) pozwala zmienić renderowany tag: `<Text as="label">`. Przydaje się w bibliotekach UI, ale typowanie go w TypeScript jest trudne (props zależą od wybranego tagu). W kodzie aplikacji zwykle wystarczy osobny komponent albo `children`.

## Kod

```tsx title="Compound components ze wspólnym Context"
import { createContext, use, useId, useState, type ReactNode } from 'react';

type TabsState = { active: string; setActive: (id: string) => void; baseId: string };
const TabsContext = createContext<TabsState | null>(null);

function useTabs() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be used inside <Tabs>');
  return ctx;
}

function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  const baseId = useId();
  return <TabsContext value={{ active, setActive, baseId }}>{children}</TabsContext>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive, baseId } = useTabs();
  return (
    <button role="tab" id={`${baseId}-tab-${id}`} aria-selected={active === id}
      aria-controls={`${baseId}-panel-${id}`} onClick={() => setActive(id)}>
      {children}
    </button>
  );
}

function Panel({ id, children }: { id: string; children: ReactNode }) {
  const { active, baseId } = useTabs();
  if (active !== id) return null;
  return <div role="tabpanel" id={`${baseId}-panel-${id}`} aria-labelledby={`${baseId}-tab-${id}`}>{children}</div>;
}

Tabs.List = ({ children }: { children: ReactNode }) => <div role="tablist">{children}</div>;
Tabs.Tab = Tab;
Tabs.Panel = Panel;

// Usage: the structure lives in JSX, not in a config array
<Tabs defaultTab="opis">
  <Tabs.List>
    <Tabs.Tab id="opis">Opis</Tabs.Tab>
    <Tabs.Tab id="opinie">Opinie</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="opis"><HotelDescription /></Tabs.Panel>
  <Tabs.Panel id="opinie"><Reviews /></Tabs.Panel>
</Tabs>;
```

```tsx title="Strona po refaktoryzacji: sekcje same pobierają dane"
// Before: OfferPage had 600 lines, three queries and inline loading/error branches.
// After: the page only composes sections.
export function OfferPage({ offerId }: { offerId: string }) {
  return (
    <PageLayout sidebar={<PriceBox offerId={offerId} />}>
      <OfferGallery offerId={offerId} />
      <OfferDetails offerId={offerId} />
      <Reviews offerId={offerId} />
    </PageLayout>
  );
}

function Reviews({ offerId }: { offerId: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['reviews', offerId],
    queryFn: () => fetchReviews(offerId),
  });
  if (isPending) return <ReviewsSkeleton />;
  if (isError) return <SectionError title="Nie udało się wczytać opinii" />;
  return <ReviewList reviews={data} />; // filters and sorting state live here too
}
```

## Częste błędy

- Dokładanie flag `showX`, `hideY`, `variantZ` zamiast slotu. Po kilku wydaniach komponent ma kombinacje props, których nikt nie testował.
- Compound components oparte na `cloneElement`: psują się, gdy ktoś owinie dziecko w dodatkowy element.
- Pobieranie wszystkich danych na górze strony i przekazywanie ich w dół przez kilka poziomów. Jeden wolny endpoint blokuje wtedy całą stronę, a jeden błąd pokazuje błąd całej strony.
- Prop `as` w każdym komponencie aplikacji "na zapas": skomplikowane typy bez realnej potrzeby.

## Pytania

### Jak zrefaktorujesz 600-liniowy komponent strony? {#react-composition-patterns-q1}

Najpierw szukam granic: które fragmenty UI korzystają z których danych i stanu. Zwykle wychodzi kilka niezależnych sekcji, np. galeria, szczegóły, opinie, cena. Każdą sekcję wydzielam do komponentu, który sam pobiera swoje dane (np. `useQuery` z własnym kluczem) i sam obsługuje ładowanie i błąd. Stan używany tylko w jednej sekcji (filtry opinii, otwarta galeria) przenoszę razem z nią. Strona zostaje układem, który składa sekcje, a powtarzalną logikę wynoszę do custom hooków. Pracuję małymi krokami: jedna sekcja na commit, testy lub ręczne sprawdzenie po każdym kroku.

```tsx
<PageLayout sidebar={<PriceBox offerId={id} />}>
  <OfferGallery offerId={id} />
  <Reviews offerId={id} />
</PageLayout>
```

### Kiedy zamienić props konfiguracyjne na children lub sloty? {#react-composition-patterns-q2}

Gdy props opisują treść, a nie zachowanie. Sygnały: rosnąca liczba flag typu `showFooter` czy `footerText`, props, które mają sens tylko razem, i prośby o "jeszcze jeden wariant" od każdego zespołu. Wtedy komponent powinien przyjąć gotowy element (`footer={<Button />}`) albo `children` i zajmować się tylko układem i stylem. Props konfiguracyjne zostawiam dla rzeczy, które komponent musi kontrolować sam: rozmiar, wariant wizualny z design systemu, stan wyłączenia. Kompozycja przy okazji ogranicza prop drilling, bo rodzic przekazuje gotowy element zamiast danych do niego.

### Czym są compound components i jak współdzielą stan? {#react-composition-patterns-q3}

To zestaw komponentów, które razem tworzą jeden widget, np. `Tabs`, `Tabs.Tab` i `Tabs.Panel`. Komponent główny trzyma stan (aktywna zakładka) i udostępnia go przez Context, a części czytają go przez `use` lub `useContext`. Użytkownik składa strukturę w JSX i może dowolnie zmieniać kolejność, dodawać ikony czy owijać elementy. Context działa na każdej głębokości, w przeciwieństwie do starszego podejścia z `cloneElement`, które obsługuje tylko bezpośrednie dzieci. Dobrze jest rzucać czytelny błąd, gdy część zostanie użyta poza komponentem głównym.

### Po co wydzielać gałąź warunkową do osobnego komponentu? {#react-composition-patterns-q4}

Gdy gałąź ma własny stan, efekty lub zapytania, osobny komponent porządkuje kod: hooki są wywoływane tylko wtedy, gdy gałąź jest renderowana, a nie zawsze w rodzicu. Przy przełączeniu gałęzi React odmontowuje komponent, więc jego stan resetuje się sam. Rodzic zostaje krótki i czyta się go jak spis treści. Przy okazji łatwiej przetestować każdą gałąź osobno.

```tsx
return isEditing ? <OfferEditForm offer={offer} onDone={stopEditing} /> : <OfferView offer={offer} />;
```

## Quiz

### Dlaczego compound components opiera się dziś na Context, a nie na `cloneElement`? {#react-composition-patterns-z1}

- [ ] `cloneElement` został usunięty w React 19
- [x] `cloneElement` przekazuje props tylko bezpośrednim dzieciom, a Context działa na każdej głębokości
- [ ] Context nie powoduje żadnych re-renderów
- [ ] `cloneElement` nie działa z TypeScript

Owinięcie części w dodatkowy element przerywa wstrzykiwanie props przez `cloneElement`, a Context dociera do dowolnie zagnieżdżonych konsumentów.

### Gdzie po refaktoryzacji god componentu powinny trafić stany ładowania i błędu opinii? {#react-composition-patterns-z2}

- [ ] Do komponentu strony, razem ze stanami pozostałych sekcji
- [ ] Do globalnego store'a
- [x] Do sekcji opinii, która sama pobiera swoje dane
- [ ] Do Context dostępnego dla całej strony

Sekcja, która pobiera dane, sama pokazuje ich ładowanie i błąd, więc problem z opiniami nie blokuje reszty strony.
