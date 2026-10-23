---
title: "Next.js App Router: pliki, trasy i nawigacja"
level: mid
tags:
  - Next.js
  - App Router
  - layout
  - routing
  - Metadata API
  - Link
summary: "W App Routerze folder to segment URL, a pliki o specjalnych nazwach (`page`, `layout`, `loading`, `error`...) mówią, co wyrenderować. Layout przetrwa nawigację, template remontuje się przy każdej zmianie segmentu, a `params` i `searchParams` są Promise."
sources:
  - title: "Next.js: Project structure and organization"
    url: https://nextjs.org/docs/app/getting-started/project-structure
  - title: "Next.js: layout.js"
    url: https://nextjs.org/docs/app/api-reference/file-conventions/layout
  - title: "Next.js: template.js"
    url: https://nextjs.org/docs/app/api-reference/file-conventions/template
  - title: "Next.js: page.js (params, searchParams)"
    url: https://nextjs.org/docs/app/api-reference/file-conventions/page
  - title: "Next.js: Parallel Routes"
    url: https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes
  - title: "Next.js: Error Handling"
    url: https://nextjs.org/docs/app/getting-started/error-handling
  - title: "Next.js: Metadata and OG images"
    url: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
  - title: "Next.js: Link Component"
    url: https://nextjs.org/docs/app/api-reference/components/link
  - title: "Next.js 16 release notes"
    url: https://nextjs.org/blog/next-16
---

## Wyjaśnienie

W katalogu `app/` każdy folder to segment adresu URL. Trasa staje się publiczna dopiero wtedy, gdy w folderze leży `page.tsx` (UI) albo `route.ts` (endpoint HTTP). Inne pliki obok, np. komponenty czy helpery, nie tworzą tras, więc można je trzymać przy stronie.

Pliki specjalne jednego segmentu:

- `page`: UI tej konkretnej trasy, zawsze liść drzewa.
- `layout`: wspólna obudowa (nagłówek, menu). Przy nawigacji między podstronami nie renderuje się ponownie i zachowuje stan. Z tego powodu nie dostaje `searchParams` ani ścieżki; aktualny URL czytasz w Client Component przez `usePathname` lub `useSearchParams`. Root layout (`app/layout.tsx`) jest obowiązkowy i musi zawierać `<html>` i `<body>`.
- `template`: wygląda jak layout, ale Next.js nadaje mu unikalny `key`. Gdy zmienia się jego segment (także parametr dynamiczny), template montuje się od nowa: stan Client Components się resetuje, a efekty uruchamiają ponownie. Zmiana samych search params go nie remontuje.
- `loading`: automatyczna granica `Suspense` wokół strony. Fallback pojawia się od razu po kliknięciu linku.
- `error`: granica błędów, musi być Client Component. Dostaje `error` i `retry()` (stabilne od 16.3; starszy `reset()` nadal istnieje, ale nie pobiera danych ponownie). Nie łapie błędów z layoutu tego samego segmentu. Do root layoutu służy `global-error`.
- `not-found`: UI wyświetlane po wywołaniu `notFound()` z `next/navigation`.

Kolejność zagnieżdżenia w segmencie: `layout`, w nim `template`, potem `error`, `loading`, `not-found` i na końcu `page`.

| Folder | Przykładowy URL | Znaczenie |
|---|---|---|
| `blog/[slug]` | `/blog/rzym` | segment dynamiczny |
| `shop/[...slug]` | `/shop/buty/meskie` | catch-all, co najmniej jeden segment |
| `docs/[[...slug]]` | `/docs` lub `/docs/a/b` | opcjonalny catch-all |
| `(marketing)/about` | `/about` | route group: porządek i osobny layout bez zmiany URL |
| `_components` | brak | folder prywatny, poza routingiem |
| `@sidebar` | brak | slot parallel route |
| `(.)photo/[id]` | `/photo/7` | intercepting route |

**Parallel routes**: folder `@nazwa` to slot, który trafia jako prop do layoutu rodzica. Slot nie zmienia URL i może mieć własne `loading` i `error`, więc np. panele dashboardu ładują się niezależnie. Przy pełnym przeładowaniu niedopasowany slot renderuje `default.tsx`; od Next.js 16 build bez tego pliku się nie udaje. **Intercepting routes** (`(.)`, `(..)`, `(...)`) pozwalają przy nawigacji wewnątrz aplikacji pokazać inną trasę w bieżącym widoku, np. jako modal. Po odświeżeniu ten sam adres pokazuje pełną stronę, więc link do modala można komuś wysłać.

Od Next.js 15 `params` i `searchParams` są Promise. W Next.js 16 usunięto dostęp synchroniczny: w Server Component piszesz `await params`, w Client Component `use(params)`. Globalny helper `PageProps<'/blog/[slug]'>` daje typy z samej ścieżki. Odczyt `searchParams` oznacza renderowanie przy żądaniu, bo tych wartości nie da się znać w czasie buildu.

Metadata API: z `page` lub `layout` eksportujesz obiekt `metadata` albo asynchroniczną funkcję `generateMetadata`, gdy tytuł zależy od danych. Działa tylko w Server Components. Nie wpisuj ręcznie `<title>` w root layoucie. Ikony, obrazy OG, `sitemap` i `robots` mają własne konwencje plików.

`Link` robi nawigację po stronie klienta: wspólne layouty zostają, stan React przetrwa. Prefetch rusza, gdy link wejdzie w viewport (i ponownie na hover, jeśli dane się zestarzały), ale tylko w buildzie produkcyjnym. Domyślnie trasa statyczna jest pobierana w całości, a dynamiczna do najbliższego `loading`. `prefetch={false}` wyłącza prefetch, `prefetch={true}` pobiera pełną trasę.

Dla porównania Pages Router (katalog `pages/`): każdy plik to trasa, dane pobierasz w `getServerSideProps` lub `getStaticProps`, wszystkie komponenty są klienckie i hydratowane, a endpointy to API Routes w `pages/api`.

## Kod

```txt title="Struktura app/"
app/
  layout.tsx                 # root layout: html, body
  (shop)/
    layout.tsx               # layout only for the shop group
    offers/[id]/
      page.tsx               # /offers/123
      loading.tsx            # skeleton while the page streams
      error.tsx              # 'use client' error boundary
  @modal/
    default.tsx              # returns null when no modal is open
    (.)offers/[id]/page.tsx  # offer opened as a modal on client navigation
```

```tsx title="app/(shop)/offers/[id]/page.tsx"
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOffer } from '@/lib/offers'; // wrapped in React cache()

export async function generateMetadata(props: PageProps<'/offers/[id]'>): Promise<Metadata> {
  const { id } = await props.params;
  const offer = await getOffer(id);
  return { title: offer?.title ?? 'Oferta' };
}

export default async function OfferPage(props: PageProps<'/offers/[id]'>) {
  const { id } = await props.params; // params is a Promise
  const offer = await getOffer(id); // deduplicated with generateMetadata
  if (!offer) notFound();
  return <h1>{offer.title}</h1>;
}
```

## Częste błędy

- Czytanie aktualnej ścieżki lub query w layoucie. Layout się nie przerenderowuje, więc wartość byłaby nieaktualna; użyj Client Component z `usePathname` lub `useSearchParams`.
- Destrukturyzacja `params` bez `await` (styl z Next.js 14). W wersji 16 to już nie działa.
- Brak `'use client'` w `error.tsx` albo oczekiwanie, że `error.tsx` złapie błąd layoutu z tego samego folderu.
- Parallel route bez `default.tsx`: po odświeżeniu 404, a w Next.js 16 błąd buildu.

## Pytania

### Czym różni się `layout` od `template` w App Routerze? {#next-app-router-q1}

Oba owijają strony segmentu, ale zachowują się inaczej przy nawigacji. Layout zostaje zamontowany: nie renderuje się ponownie, stan jego Client Components i np. pozycja przewinięcia w menu przetrwają przejście między podstronami. Template dostaje unikalny `key`, więc przy zmianie segmentu montuje się od nowa. Stan się resetuje, a `useEffect` uruchamia ponownie. Template wybierasz rzadko: do resetu pola formularza przy przejściu, animacji wejścia albo logowania wejścia na podstronę. Zmiana samych search params go nie remontuje.

### Jakie pliki specjalne może mieć segment i w jakiej kolejności się zagnieżdżają? {#next-app-router-q2}

Najważniejsze to `page` (UI trasy), `layout` (wspólna obudowa), `template`, `loading` (granica `Suspense`), `error` (granica błędów, Client Component), `not-found` (UI dla `notFound()`) i `route` (endpoint HTTP, nie może leżeć obok `page`). Kolejność od zewnątrz: `layout`, `template`, `error`, `loading`, `not-found`, `page`. Dlatego `error.tsx` nie złapie błędu z layoutu tego samego segmentu, bo layout jest nad nim. Taki błąd obsłuży `error` w segmencie rodzica, a dla root layoutu `global-error`.

### Do czego służą parallel routes i intercepting routes? {#next-app-router-q3}

Parallel routes (`@slot`) renderują kilka niezależnych widoków w jednym layoucie, np. panele dashboardu z osobnymi stanami ładowania i błędów. Slot trafia do layoutu jako prop i nie zmienia URL. Intercepting routes (`(.)folder`, `(..)folder`) przechwytują nawigację wewnątrz aplikacji i pokazują docelową trasę w bieżącym kontekście. Razem dają modal z własnym adresem: kliknięcie zdjęcia w galerii otwiera modal, a wejście na ten sam URL z zewnątrz pokazuje pełną stronę zdjęcia. Każdy slot potrzebuje `default.tsx`, który zwykle zwraca `null`.

### Dlaczego `params` jest Promise i co to zmienia w kodzie? {#next-app-router-q4}

Od Next.js 15 `params`, `searchParams`, `cookies()` i `headers()` są asynchroniczne, a w Next.js 16 usunięto dostęp synchroniczny. Dzięki temu framework wie, w którym miejscu drzewa kod czeka na dane z żądania. Wszystko, co jest wyżej i nie czeka, może zostać wyrenderowane wcześniej, nawet w czasie buildu. W Server Component piszesz `const { id } = await params`, w Client Component `use(params)`. Do typów wygodny jest globalny `PageProps<'/offers/[id]'>`.

```tsx
export default async function Page({ params }: PageProps<'/offers/[id]'>) {
  const { id } = await params;
  return <OfferDetails id={id} />;
}
```

## Quiz

### Gdzie najlepiej trzymać nawigację z polem wyszukiwania, która ma zachować wpisany tekst przy przejściach między podstronami sekcji? {#next-app-router-z1}

- [x] W `layout.tsx` tej sekcji
- [ ] W `template.tsx` tej sekcji
- [ ] W `page.tsx` każdej podstrony
- [ ] W `loading.tsx` sekcji

Layout nie montuje się ponownie przy nawigacji, więc stan jego komponentów przetrwa, a template by go zresetował.

### Co się stanie po odświeżeniu strony, gdy slot `@modal` nie ma dopasowanej trasy ani pliku `default.tsx`? {#next-app-router-z2}

- [ ] Slot pokaże ostatnio otwarty modal
- [ ] Slot zostanie po cichu pominięty
- [x] Next.js wyrenderuje 404
- [ ] Next.js przekieruje na stronę główną

Przy pełnym przeładowaniu niedopasowany slot renderuje `default.tsx`, a bez niego 404; dlatego Next.js 16 wymaga tego pliku już w buildzie.
