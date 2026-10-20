---
title: UI odporny na wydłużenie tekstu
priority: medium
---

Tłumaczenia bywają o ok. 30% dłuższe od angielskiego, a krótkie etykiety nawet dwukrotnie. Potrzebne są elastyczne układy, brak stałych szerokości i wysokości elementów z tekstem, właściwości logiczne CSS i testy z pseudolokalizacją.

## Dlaczego to ważne

- Niemieckie słowa złożone, np. "Reiserücktrittsversicherung", nie mieszczą się w przycisku o stałej szerokości i albo wychodzą poza niego, albo są ucinane.
- Ucięty tekst w przycisku to nie kosmetyka: użytkownik nie wie, co kliknie, a tekst wychodzący poza kontener zasłania inne elementy.
- Właściwości logiczne (`padding-inline`, `margin-inline-start`) działają też dla języków zapisywanych od prawej do lewej (arabski, hebrajski) bez osobnego arkusza stylów.

## Jak sprawdzić

Pseudolokalizacja lub test z najdłuższą wersją językową (często niemiecką lub fińską); dodatkowo powiększenie tekstu do 200% w przeglądarce.

## Kod

```css
/* Bad: .btn-book { width: 120px; height: 40px; white-space: nowrap; overflow: hidden; } */
.btn-book {
  min-inline-size: 7.5rem;   /* grows with the label instead of clipping it */
  padding-block: 0.5rem;
  padding-inline: 1rem;
}
.card-title {
  overflow-wrap: anywhere;   /* long compound words do not overflow */
  hyphens: auto;             /* needs a correct lang attribute on <html> */
  text-wrap: balance;
}
.icon-arrow { margin-inline-start: 0.5rem; } /* flips automatically in RTL */
.filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
```

```ts title="scripts/pseudo-locale.ts"
// Accented characters reveal hard-coded strings,
// ~40% padding reveals layouts that break with longer translations
const map: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ö', u: 'ü', c: 'ç', n: 'ñ', s: 'š', z: 'ž' };

export function pseudo(text: string): string {
  // Keep simple placeholders like {name} untouched
  const parts = text.split(/(\{[^}]*\})/);
  const body = parts.map((p, i) => (i % 2 ? p : p.replace(/[a-z]/g, (ch) => map[ch] ?? ch))).join('');
  return `[${body}${'~'.repeat(Math.ceil(text.length * 0.4))}]`;
}

pseudo('Book now'); // "[Böök ñöw~~~~]"
```

## Częste błędy

- Projekt w Figmie tylko z angielskimi tekstami, bez sprawdzenia najdłuższej wersji językowej.
- `text-overflow: ellipsis` na kluczowych etykietach przycisków i nagłówków.
