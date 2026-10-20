---
title: Dostępna wyszukiwarka
priority: medium
---

`<search>` lub `role="search"`, `<input type="search">` z etykietą (może być wizualnie ukryta) i przyciskiem z nazwą.

## Dlaczego to ważne

- Landmark search pozwala czytnikom przeskoczyć prosto do wyszukiwarki (D w NVDA, rotor w VoiceOver).
- Element `<search>` jest obsługiwany we wszystkich głównych przeglądarkach od 2023 r. i ma wbudowaną rolę search, więc nie trzeba dopisywać `role`.
- Placeholder to nie etykieta: znika przy pisaniu i zwykle ma za słaby kontrast; przycisk z samą ikoną lupy potrzebuje nazwy dostępnej.
- `type="search"` daje na telefonie klawiaturę z klawiszem "Szukaj" i przycisk czyszczenia pola w części przeglądarek.

## Jak sprawdzić

Odczyt czytnikiem ekranu (landmark search); obsługa klawiaturą, Enter wysyła formularz.

## Kod

```html
<search>
  <form action="/szukaj">
    <label for="q" class="visually-hidden">Szukaj kierunku lub hotelu</label>
    <input id="q" name="q" type="search" placeholder="np. Kreta, Hurghada">
    <button type="submit" aria-label="Szukaj">
      <svg aria-hidden="true" focusable="false" width="20" height="20"><use href="#icon-search"/></svg>
    </button>
  </form>
</search>
```

```css
/* Hidden visually, still available to screen readers */
.visually-hidden {
  position: absolute; width: 1px; height: 1px;
  margin: -1px; padding: 0; overflow: hidden;
  clip-path: inset(50%); white-space: nowrap; border: 0;
}
```

## Częste błędy

- Etykieta ukryta przez `display: none`: znika także dla czytnika ekranu.
