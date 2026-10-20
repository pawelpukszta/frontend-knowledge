---
title: Link "Przejdź do treści"
priority: high
sources:
  - title: "W3C Understanding 2.4.1: Bypass Blocks"
    url: https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
---

Pierwszy fokusowalny element strony pozwala pominąć powtarzalną nawigację i przejść do `<main>`. Może być ukryty, ale pojawia się przy focusie.

## Dlaczego to ważne

- Bez skip linka użytkownik klawiatury musi na każdej podstronie przejść przez 30-50 linków menu, zanim dotrze do treści.
- Pomaga też osobom widzącym, które korzystają z klawiatury lub przełączników, a nie tylko użytkownikom czytników.
- Link ukryty na stałe (`display: none`) nie działa; musi być widoczny po otrzymaniu focusu.

## Jak sprawdzić

Naciśnij Tab zaraz po załadowaniu strony: link powinien się pojawić, a Enter przenieść widok i focus do treści głównej.

## Kod

```html
<body>
  <a class="skip-link" href="#main">Przejdź do treści</a>
  <header>...</header>
  <main id="main" tabindex="-1">...</main>
</body>
```

```css
.skip-link {
  position: absolute; left: 1rem; top: 1rem; z-index: 1000;
  padding: 0.75rem 1rem; background: #0b3d91; color: #fff;
  transform: translateY(-200%); /* off-screen until focused */
}
.skip-link:focus { transform: none; }
#main:focus { outline: none; } /* focus target only, not interactive */
```
