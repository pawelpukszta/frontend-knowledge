---
title: Ogłaszaj dynamiczne zmiany przez regiony live
priority: high
sources:
  - title: "W3C Understanding 4.1.3: Status Messages"
    url: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
  - title: "MDN: ARIA live regions"
    url: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
---

Komunikaty pojawiające się bez przeładowania (wyniki wyszukiwania, błędy, "dodano do koszyka") powinny trafić do `aria-live="polite"`, `role="status"` lub `role="alert"`. Region musi istnieć w DOM, zanim zmieni się jego treść.

## Dlaczego to ważne

- Osoba niewidoma po kliknięciu "Dodaj do koszyka" nie widzi zmiany licznika; bez regionu live nie wie, czy akcja się udała, i klika ponownie.
- Region wstawiony do DOM razem z treścią zwykle nie zostaje ogłoszony, bo technologie asystujące reagują na zmiany w już zarejestrowanym regionie.
- `assertive` (i `role="alert"`) przerywa bieżący odczyt; nadużywany sprawia, że użytkownik gubi wątek, dlatego domyślnie używaj `polite` lub `status`, a `alert` tylko dla błędów.
- Wymaga tego WCAG 4.1.3 Status Messages (AA).

## Jak sprawdzić

Wywołaj akcję z włączonym NVDA lub VoiceOver i sprawdź, czy komunikat zostaje odczytany, i to tylko raz.

## Kod

```tsx title="React"
// The region is rendered once (empty) and only its text changes
export function SearchStatus({ count, loading }: { count: number; loading: boolean }) {
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {loading ? "" : `Znaleziono ${count} ofert`}
    </p>
  );
}

// Bad: {!loading && <p role="status">Znaleziono {count} ofert</p>}
// The region appears together with its text and is often not announced.
```

## Częste błędy

- `aria-live` dodane do `role="alert"`: VoiceOver na iOS może przeczytać komunikat dwukrotnie.
- Linki i przyciski w treści regionu: czytnik ogłosi tylko tekst, bez informacji, że można w nie kliknąć.
