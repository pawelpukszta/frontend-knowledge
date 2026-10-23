---
title: Hydration
level: mid
added: 2026-10-20
tags:
  - hydration
  - SSR
  - hydrateRoot
  - mismatch
summary: 'Hydration to "ożywienie" HTML-a wygenerowanego na serwerze: React w przeglądarce podpina event handlery i stan do istniejącego DOM, zamiast budować go od nowa.'
sources:
  - title: "React: hydrateRoot"
    url: https://react.dev/reference/react-dom/client/hydrateRoot
  - title: "web.dev: Rendering on the Web"
    url: https://web.dev/articles/rendering-on-the-web
---

## Wyjaśnienie

1. Serwer renderuje HTML i wysyła go. Użytkownik od razu widzi treść (dobre FCP, LCP).
2. Przeglądarka pobiera JS.
3. React renderuje komponenty ponownie w pamięci i **dopasowuje** wynik do istniejącego DOM, podpinając zdarzenia. Od tej chwili strona jest interaktywna.

**Hydration mismatch**: HTML z serwera różni się od pierwszego renderu na kliencie. Przyczyny: `Date.now()`, `Math.random()`, `window`/`localStorage` w renderze, różna strefa czasowa lub locale, niepoprawne zagnieżdżenie HTML (`<div>` w `<p>`), rozszerzenia przeglądarki. Rozwiązania: wartości zależne od klienta ustawiaj w `useEffect`, przekaż dane z serwera, `suppressHydrationWarning` dla pojedynczych przypadków.

**Selective hydration** (React 18+): z `Suspense` React hydratuje fragmenty niezależnie i priorytetyzuje te, z którymi użytkownik wchodzi w interakcję.

Koszt: hydration wymaga pobrania i wykonania JS dla całej strony, co wpływa na INP i TBT. Server Components ograniczają ilość JS do hydracji.

## Kod

```tsx
// Causes a mismatch: server and client render different values
function Price() {
  return <span>{new Date().toLocaleTimeString()}</span>;
}

// Fix: render client-only values after mount
function ClientTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => setTime(new Date().toLocaleTimeString()), []);
  return <span>{time ?? '--:--'}</span>;
}
```

## Pytania

### Czym jest hydration? {#react-hydration-q1}

Procesem, w którym React po stronie klienta przejmuje HTML wygenerowany przez serwer: renderuje drzewo w pamięci, dopasowuje je do istniejącego DOM i podpina event handlery, bez odtwarzania DOM od zera.

### Co powoduje hydration mismatch i jak go naprawić? {#react-hydration-q2}

Różnica między HTML z serwera a pierwszym renderem klienta: losowe wartości, daty, dostęp do `window` lub `localStorage`, różne locale, błędny HTML. Naprawa: wartości klienckie ustawiać po montażu (`useEffect`), deterministyczny render, poprawny HTML.

## Quiz

### Czym jest hydration? {#react-hydration-z1}

- [ ] Generowaniem HTML w czasie buildu
- [x] Podpięciem przez React zdarzeń i stanu do HTML wygenerowanego przez serwer
- [ ] Pobieraniem danych z API
- [ ] Kompresją bundla

React dopasowuje render klienta do istniejącego DOM.
