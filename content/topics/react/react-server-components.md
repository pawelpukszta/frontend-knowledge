---
title: React Server Components
level: senior
tags:
  - RSC
  - Server Components
  - use client
  - Next.js App Router
summary: Server Components renderują się tylko na serwerze i nie wysyłają swojego kodu do przeglądarki. Client Components ('use client') obsługują interaktywność i są hydratowane.
sources:
  - title: "React: Server Components"
    url: https://react.dev/reference/rsc/server-components
  - title: "React: 'use client'"
    url: https://react.dev/reference/rsc/use-client
  - title: "Next.js: Server and Client Components"
    url: https://nextjs.org/docs/app/getting-started/server-and-client-components
---

## Wyjaśnienie

- **Server Component** (domyślnie w Next.js App Router): może być `async`, czytać bezpośrednio z bazy lub API, używać sekretów. Nie ma stanu, efektów ani event handlerów. Jego kod **nie trafia do bundla** klienta.
- **Client Component**: plik z dyrektywą `'use client'`. Może używać `useState`, `useEffect`, zdarzeń, API przeglądarki. Jest renderowany na serwerze (SSR) i hydratowany w przeglądarce.
- `'use client'` wyznacza **granicę**: wszystko importowane z takiego pliku też staje się kodem klienckim. Server Component może przekazać Client Componentowi serializowalne props lub inne Server Components jako `children`.
- **Server Functions / Server Actions** (`'use server'`): funkcje wywoływane z klienta, wykonywane na serwerze (np. obsługa formularzy).

To nie to samo co SSR: SSR dotyczy generowania HTML, RSC dotyczy tego, które komponenty w ogóle nie wysyłają JS do przeglądarki.

Wzorzec: Server Components jako "szkielet" z danymi, a małe Client Components jako "wyspy" interaktywności (np. przycisk "Dodaj do ulubionych"), osadzone możliwie nisko w drzewie.

## Kod

```tsx
// app/offers/[id]/page.tsx - Server Component (default)
export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = await db.offer.findUnique({ where: { id } }); // runs only on the server
  return (
    <article>
      <h1>{offer.title}</h1>
      <FavoriteButton offerId={id} /> {/* small interactive island */}
    </article>
  );
}

// FavoriteButton.tsx
'use client';
export function FavoriteButton({ offerId }: { offerId: string }) {
  const [fav, setFav] = useState(false);
  return <button aria-pressed={fav} onClick={() => setFav(!fav)}>Ulubione</button>;
}
```

## Pytania

### Czym różnią się Server Components od SSR? {#react-server-components-q1}

SSR to technika generowania HTML na serwerze dla komponentów, które potem są hydratowane (ich JS trafia do przeglądarki). Server Components renderują się tylko na serwerze i ich kod w ogóle nie jest wysyłany do klienta. W Next.js oba mechanizmy działają razem.

### Kiedy komponent musi być Client Component? {#react-server-components-q2}

Gdy używa stanu, efektów, event handlerów, API przeglądarki (`window`, `localStorage`) lub bibliotek, które tego wymagają. Resztę zostaw jako Server Components, żeby zmniejszyć bundle.

### Co oznacza 'use client' dla importów? {#react-server-components-q3}

Dyrektywa oznacza granicę: ten moduł i wszystko, co importuje, staje się częścią bundla klienta. Dlatego granice stawia się nisko w drzewie, na małych interaktywnych komponentach.

## Quiz

### Który komponent NIE wysyła swojego kodu JS do przeglądarki? {#react-server-components-z1}

- [x] Server Component
- [ ] Client Component
- [ ] Komponent w memo
- [ ] Komponent lazy

Kod Server Components zostaje na serwerze.
