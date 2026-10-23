---
title: "Cache w Next.js 16: use cache, cacheLife, cacheTag i invalidacja"
level: senior
added: 2026-10-23
tags:
  - Next.js
  - cache
  - use cache
  - revalidateTag
  - Partial Prerendering
  - Suspense
summary: "Z Cache Components (Next.js 16) nic z danych nie jest cache'owane domyślnie: cache włączasz jawnie przez `\"use cache\"`, czas życia ustawiasz `cacheLife`, a pojedyncze dane unieważniasz tagiem (`cacheTag` + `updateTag` lub `revalidateTag`). Reszta strony streamuje się przez `Suspense`."
sources:
  - title: "Next.js: Caching (Cache Components)"
    url: https://nextjs.org/docs/app/getting-started/caching
  - title: "Next.js: Revalidating"
    url: https://nextjs.org/docs/app/getting-started/revalidating
  - title: "Next.js: use cache"
    url: https://nextjs.org/docs/app/api-reference/directives/use-cache
  - title: "Next.js: cacheLife"
    url: https://nextjs.org/docs/app/api-reference/functions/cacheLife
  - title: "Next.js: updateTag"
    url: https://nextjs.org/docs/app/api-reference/functions/updateTag
  - title: "Next.js: revalidatePath"
    url: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
  - title: "Next.js: fetch (memoization)"
    url: https://nextjs.org/docs/app/api-reference/functions/fetch
  - title: "Next.js 16 release notes"
    url: https://nextjs.org/blog/next-16
  - title: "Next.js 15 docs: Caching (four mechanisms, previous model)"
    url: https://nextjs.org/docs/15/app/guides/caching
---

## Wyjaśnienie

Next.js 16 ma dwa modele cache. Ten opis dotyczy **Cache Components** (`cacheComponents: true` w `next.config.ts`; nowe projekty z `create-next-app` mają to włączone). Bez tej flagi działa poprzedni model z Next.js 15, opisany na końcu.

Domyślnie dane nie są cache'owane: `fetch`, zapytanie do bazy czy `cookies()` wykonują się przy każdym żądaniu, chyba że jawnie dodasz cache. Next.js za to sam prerenderuje to, co da się policzyć bez żądania: statyczny JSX, importy modułów, czyste obliczenia. Każdy komponent, który czeka na niecache'owane dane albo na API żądania (`cookies`, `headers`, `searchParams`, `params`), musi być w `use cache` albo pod `<Suspense>`. W przeciwnym razie dev overlay i build zgłaszają błąd "blocking route".

W czasie buildu powstaje **static shell** (Partial Prerendering): statyczny HTML, wyniki `use cache` i fallbacki `Suspense`. Shell idzie od razu z CDN, a części dynamiczne doklejają się w tym samym strumieniu odpowiedzi. Odczyt `cookies()` pod `Suspense` nie robi już całej trasy dynamiczną, co było regułą w starym modelu.

Dyrektywa `"use cache"` na początku funkcji, komponentu albo pliku zapisuje wynik. Klucz cache budują: ID buildu, hash funkcji, serializowalne argumenty i zmienne przechwycone z domknięcia. Wewnątrz nie wolno wołać `cookies()` ani `headers()`; odczytaj wartość wyżej i przekaż jako argument. Domyślnie wpisy żyją w pamięci jednej instancji, więc na serverless rzadko przetrwają między żądaniami. Na takie przypadki jest `"use cache: remote"` (współdzielony handler, np. Redis). `"use cache: private"` cache'uje dane zależne od cookies tylko w przeglądarce. Nowy deploy zaczyna z pustym cache.

`cacheLife` ustawia trzy czasy: `stale` (ile klient używa danych bez pytania serwera, minimum 30 s), `revalidate` (po tym czasie serwer odświeża w tle) i `expire` (po tym czasie bez ruchu następne żądanie czeka na świeże dane). Profile: `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`. Bez wywołania działa `default`: stale 5 min, revalidate 15 min, expire nigdy. Bardzo krótki cache (np. `seconds`) nie trafia do prerendera, tylko staje się dynamiczną dziurą.

Invalidacja na żądanie:

| API | Gdzie | Zachowanie |
|---|---|---|
| `cacheTag('offer-7')` | wewnątrz `use cache` | oznacza wpis tagiem |
| `updateTag(tag)` | tylko Server Action | wpis wygasa od razu, następny odczyt czeka na świeże dane (read-your-own-writes) |
| `revalidateTag(tag, 'max')` | Server Action, Route Handler | stale-while-revalidate: stara wersja leci od razu, nowa liczy się w tle; wersja bez drugiego argumentu jest deprecated |
| `revalidatePath(path)` | Server Action, Route Handler | unieważnia jedną ścieżkę; dokumentacja zaleca tagi jako precyzyjniejsze |
| `refresh()` | tylko Server Action | ponownie renderuje niecache'owane części, cache nie rusza |

Zostają jeszcze dwie warstwy. **Request memoization**: identyczne `fetch` GET w jednym renderze wykonują się raz (dla bazy danych użyj `cache` z React). Żyje tylko przez jeden render, więc nie trzeba jej unieważniać. **Client cache** routera to payload RSC w pamięci przeglądarki, ważny przez `stale`. Wywołanie `updateTag`, `revalidateTag`, `revalidatePath` lub `refresh` w Server Action czyści cały client cache.

Poprzedni model (Next.js 14 i 15, a w 16 bez Cache Components) miał cztery mechanizmy: Request Memoization, Data Cache (wyniki `fetch` z `force-cache` lub `next.revalidate`), Full Route Cache (HTML i RSC tras statycznych) i Router Cache w przeglądarce. Strategię wybierało się przez opcje `fetch`, `unstable_cache` i eksporty `dynamic` / `revalidate`. Next.js 15 zmienił domyślne wartości: `fetch`, `GET` Route Handlers i strony w Router Cache przestały być cache'owane.

## Kod

```tsx title="lib/offers.ts i app/actions.ts"
import { cacheLife, cacheTag } from 'next/cache';

export async function getOffer(id: string) {
  'use cache';
  cacheLife('days');
  cacheTag('offers', `offer-${id}`); // list tag + item tag
  return db.offer.findUnique({ where: { id } });
}

// app/actions.ts
'use server';
import { updateTag } from 'next/cache';

export async function renameOffer(id: string, title: string) {
  // auth and validation omitted for brevity
  await db.offer.update({ where: { id }, data: { title } });
  updateTag(`offer-${id}`); // only this offer, other cache entries stay
}
```

```tsx title="app/offers/[id]/page.tsx"
import { Suspense } from 'react';

export default async function OfferPage({ params }: PageProps<'/offers/[id]'>) {
  const { id } = await params;
  return (
    <>
      <OfferDescription id={id} /> {/* use cache: part of the static shell */}
      <Suspense fallback={<p>Sprawdzamy cenę...</p>}>
        <LivePrice id={id} /> {/* no cache: streams on every request */}
      </Suspense>
    </>
  );
}
```

## Częste błędy

- Wołanie `cookies()` lub `headers()` wewnątrz `use cache`. Next.js zgłasza błąd; wartość trzeba odczytać wyżej i przekazać argumentem.
- `revalidatePath('/', 'layout')` po każdej zmianie. Czyści wszystko, a zwykle wystarczy tag jednej encji.
- `revalidateTag` w akcji, po której użytkownik ma od razu zobaczyć swoją zmianę. Z profilem `'max'` dostanie starą wersję; tu pasuje `updateTag`.
- Liczenie na to, że `use cache` w pamięci przetrwa między żądaniami na serverless. Do współdzielonego cache potrzebny jest `use cache: remote`.

## Pytania

### Jakie warstwy cache ma Next.js i jak unieważnić jedną daną, nie ruszając reszty? {#next-caching-q1}

W Next.js 16 z Cache Components liczą się cztery miejsca. Pierwsze to memoizacja w jednym renderze: `fetch` GET i funkcje w `cache` z React. Drugie to wpisy `use cache` na serwerze, w pamięci lub w handlerze `remote`. Trzecie to prerenderowany static shell (HTML i RSC), a czwarte client cache routera w przeglądarce, ważny przez `stale` z `cacheLife`. Żeby unieważnić jedną daną, oznaczam ją tagiem z ID: `cacheTag('offer-7')`. Po zapisie w Server Action wołam `updateTag('offer-7')`. Wygasa wtedy tylko ten wpis i wszystko, co go użyło, a inne wpisy zostają. Z webhooka CMS używam `revalidateTag('offer-7', 'max')` w Route Handlerze. Memoizacji nie trzeba czyścić, bo żyje jeden render. Client cache czyści się sam, gdy Server Action wywoła rewalidację. W starym modelu (Next.js 14/15) odpowiednikami były Request Memoization, Data Cache, Full Route Cache i Router Cache. Tam też tagi (`next.tags` w `fetch`) były sposobem na precyzyjne unieważnienie.

### Strona ma statyczne treści marketingowe i widget z ceną na żywo. Jak to zbudujesz? {#next-caching-q2}

Treść marketingową renderuję bez danych zależnych od żądania albo w komponencie z `use cache` i długim `cacheLife` (np. `days`) oraz tagiem, żeby CMS mógł ją unieważnić webhookiem. Trafia do static shell i jest serwowana z CDN. Widget ceny to osobny async Server Component bez `use cache`, owinięty w `<Suspense>` z fallbackiem o stałym rozmiarze (żeby nie było CLS). Fallback jest częścią shella, a cena streamuje się przy każdym żądaniu. Jeśli cena ma się zmieniać bez przeładowania, w środku umieszczam mały Client Component z pollingiem lub WebSocketem. Cenę i tak weryfikuję na serwerze przy rezerwacji, bo wyświetlona wartość może być sprzed chwili.

### Czym różni się `updateTag` od `revalidateTag`? {#next-caching-q3}

`updateTag(tag)` działa tylko w Server Action i od razu wygasza wpis. Następny odczyt, łącznie z re-renderem wysyłanym w odpowiedzi akcji, czeka na świeże dane. To semantyka read-your-own-writes: użytkownik zapisał zmianę i od razu ją widzi. `revalidateTag(tag, profile)` działa w Server Action i Route Handlerze. Z profilem `'max'` oznacza wpis jako nieaktualny i przy kolejnej wizycie podaje starą wersję, a nową liczy w tle. Pasuje do webhooków i treści, gdzie chwilowe opóźnienie nie szkodzi. Jednoargumentowe `revalidateTag(tag)` jest w Next.js 16 deprecated.

### Dlaczego nie można czytać `cookies()` wewnątrz `use cache`? {#next-caching-q4}

Wynik `use cache` jest współdzielony przez wszystkich, którzy wywołają funkcję z tymi samymi argumentami. Gdyby funkcja czytała cookies, dane jednego użytkownika mogłyby trafić do innego. Next.js więc blokuje API żądania w cache'owanym zakresie, także w funkcjach wołanych głębiej. Poprawny wzorzec: odczytać cookie w komponencie pod `Suspense` i przekazać wartość jako argument, wtedy staje się częścią klucza cache. Gdy nie da się tego przerobić, zostaje `use cache: private`, które trzyma wynik tylko w przeglądarce.

## Quiz

### Użytkownik zmienił nazwę swojej oferty w formularzu (Server Action) i ma ją zobaczyć od razu po zapisie. Czego użyć? {#next-caching-z1}

- [x] `updateTag('offer-7')`
- [ ] `revalidateTag('offer-7', 'max')`
- [ ] `revalidatePath('/', 'layout')`
- [ ] `refresh()`

`updateTag` od razu wygasza tylko ten tag i następny odczyt czeka na świeże dane, a `revalidateTag` z `'max'` podałby jeszcze starą wersję.

### Jaki jest domyślny profil `cacheLife`, gdy w `use cache` nie wywołasz `cacheLife`? {#next-caching-z2}

- [ ] Brak cache, wynik liczony przy każdym żądaniu
- [x] `default`: stale 5 min, revalidate 15 min, expire nigdy
- [ ] `max`: revalidate 30 dni
- [ ] `seconds`: revalidate 1 s

Bez jawnego `cacheLife` obowiązuje profil `default`, dlatego dokumentacja zaleca zawsze podawać profil wprost.
