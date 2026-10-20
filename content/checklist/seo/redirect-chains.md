---
title: Linkuj bezpośrednio do adresów docelowych
priority: medium
---

Linki wewnętrzne powinny wskazywać aktualny URL, a nie adres, który przekierowuje (np. bez końcowego ukośnika lub po zmianie struktury).

## Dlaczego to ważne

- Każdy link do adresu przekierowującego to dodatkowe żądanie przy każdym kliknięciu i każdej wizycie robota.
- Typowe źródła: niespójny końcowy ukośnik, `http://` w linkach, stare ścieżki w menu i stopce po zmianie struktury.
- Przekierowanie przekazuje sygnały, ale bezpośredni link jest najczystszą informacją, który adres jest kanoniczny.

## Jak sprawdzić

Crawler: linki do przekierowań 3xx (lista stron źródłowych pokazuje, co poprawić).

## Kod

```html
<!-- Bad: server answers 308 to /wakacje/grecja (no trailing slash) -->
<a href="/wakacje/grecja/">Grecja</a>
<!-- Bad: old structure, 301 to /wakacje/grecja -->
<a href="/oferty/grecja">Grecja</a>
<!-- Good: final canonical URL -->
<a href="/wakacje/grecja">Grecja</a>
```

```ts title="lib/routes.ts"
// Single source of truth for internal URLs; components never build paths by hand
export const routes = {
  country: (country: string) => `/wakacje/${country}`,
  region: (country: string, region: string) => `/wakacje/${country}/${region}`,
  offer: (slug: string) => `/oferty/${slug}`,
} as const;
```

## Częste błędy

- Poprawienie przekierowań na serwerze bez aktualizacji linków w menu i treściach.
