---
title: Bez problematycznych znaków w URL
priority: medium
---

Spacje, wielkie litery, znaki specjalne i polskie znaki diakrytyczne bywają kodowane (`%C4%85`) i źle wyglądają przy udostępnianiu. Transliteruj (ą → a).

## Dlaczego to ważne

- `/wycieczki/łódź` w praktyce trafia do schowka jako `/wycieczki/%C5%82%C3%B3d%C5%BA` i tak wygląda w mailu czy komunikatorze.
- Różne systemy różnie normalizują Unicode (NFC i NFD), więc ten sam tytuł może dać dwa różne adresy.
- Znaki takie jak `&`, `?`, `#`, `%` w slugach psują parsowanie adresu i kończą się 404.

## Jak sprawdzić

Crawler: adresy z zakodowanymi znakami.

## Kod

```ts title="lib/slugify.ts"
const PL_MAP: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (ch) => PL_MAP[ch])
    .normalize("NFKD")                 // split other accents (é becomes e + mark)
    .replace(/[̀-ͯ]/g, "")   // drop combining marks
    .replace(/[^a-z0-9]+/g, "-")       // anything else becomes a hyphen
    .replace(/^-+|-+$/g, "");          // trim leading and trailing hyphens
}

slugify("Wycieczka: Łódź & Żółta Plaża 2026"); // "wycieczka-lodz-zolta-plaza-2026"
```

## Częste błędy

- Usuwanie polskich znaków zamiast ich transliteracji (`d` zamiast `lodz` z "Łódź").
