---
title: Tryb ciemny z prefers-color-scheme
priority: medium
sources:
  - title: "web.dev: prefers-color-scheme"
    url: https://web.dev/articles/prefers-color-scheme
---

Kolory zdefiniowane jako tokeny i nadpisane w `@media (prefers-color-scheme: dark)`, plus `color-scheme: light dark`, żeby kontrolki formularzy i scrollbary też się dopasowały.

## Dlaczego to ważne

- Wielu użytkowników ma ciemny motyw systemowy; jasna strona po zmroku razi, a niedopasowane pola formularzy (białe na ciemnym tle) wyglądają jak błąd.
- Na ekranach OLED ciemne piksele zużywają mniej energii, co wydłuża czas pracy baterii.
- Gdy kolory są tokenami, tryb ciemny to kilkanaście nadpisanych zmiennych zamiast kopii całego arkusza.

## Jak sprawdzić

Emulacja `prefers-color-scheme` w DevTools (Rendering); sprawdź kontrast tekstu, pól formularzy, focusu i obrazków z przezroczystym tłem w obu motywach.

## Kod

```css
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --text: #1c1f24;
  --surface: #f4f5f7;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #121417; --text: #e8eaed; --surface: #1d2025; }
}
/* Alternative for single values: light-dark() (needs color-scheme set) */
.badge { background: light-dark(#e6f0ff, #1a2a44); }

body { background: var(--bg); color: var(--text); }
```

## Częste błędy

- Czysta czerń `#000` z czysto białym tekstem; zbyt duży kontrast męczy oczy, lepsze są ciemne szarości.
- Brak przełącznika w UI dla osób, które chcą innego motywu niż systemowy.
