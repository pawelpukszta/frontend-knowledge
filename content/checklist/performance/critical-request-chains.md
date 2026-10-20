---
title: Krótkie łańcuchy krytycznych zapytań
priority: high
---

HTML → CSS → `@import` → font to łańcuch, w którym każdy krok czeka na poprzedni. Spłaszcz go: deklaruj zasoby bezpośrednio w HTML, używaj preload dla późno odkrywanych plików, inline krytycznego CSS, bez `@import`.

## Dlaczego to ważne

- Każde ogniwo łańcucha to co najmniej jeden round-trip; łańcuch o długości 4 na sieci mobilnej może dodać sekundę do FCP.
- Przeglądarka nie wie o zasobie, dopóki nie pobierze pliku, który go wskazuje; preload scanner widzi tylko to, co jest w HTML.
- Typowe łańcuchy: CSS z `@import` fontów Google, skrypt ładujący inny skrypt, obraz hero wskazany w CSS lub ustawiany przez JS.

## Jak sprawdzić

Insight o drzewie zależności sieciowych w Lighthouse i panelu Performance, waterfall w Network (kolumna Initiator).

## Kod

```css title="Źle"
/* main.css: font CSS is discovered only after main.css downloads */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
@import url('./components.css');
```

```html title="Dobrze"
<!-- All critical files declared in HTML, fonts self-hosted and preloaded -->
<link rel="preload" href="/fonts/inter-latin-ext-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/main.4c2e.css">
<link rel="stylesheet" href="/css/components.91fa.css">
```

## Częste błędy

- Dodanie preload dla wszystkiego "na zapas", co zamiast skrócić łańcuch zabiera łącze obrazowi LCP.
