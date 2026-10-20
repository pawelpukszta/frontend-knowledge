---
title: Reset lub normalize CSS
priority: medium
---

Ujednolica domyślne style przeglądarek (marginesy, `box-sizing: border-box`, dziedziczenie fontów w formularzach). Nowoczesne resety są małe i nie usuwają przydatnych stylów (np. focusu).

## Dlaczego to ważne

- Przeglądarki mają różne domyślne marginesy, rozmiary nagłówków i style kontrolek; bez resetu ten sam komponent wygląda inaczej w Chrome i Safari.
- `box-sizing: border-box` sprawia, że `width: 100%` z paddingiem nie wychodzi poza kontener, co usuwa częstą przyczynę poziomego przewijania.
- Agresywne stare resety (`* { outline: none }`, usuwanie list-style bez zamiennika) psują dostępność; nowoczesny reset poprawia tylko to, co trzeba.

## Jak sprawdzić

Sprawdź pierwszą warstwę stylów projektu (np. `@layer reset`) i czy nie usuwa focusu ani semantyki list.

## Kod

```css
@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
  body { min-block-size: 100dvh; line-height: 1.5; }
  img, picture, video, canvas, svg { display: block; max-inline-size: 100%; }
  input, button, textarea, select { font: inherit; }
  p, h1, h2, h3 { overflow-wrap: break-word; }
  :where(ul, ol)[role="list"] { list-style: none; padding: 0; }
}
```

## Częste błędy

- Reset ładowany po stylach komponentów, który nadpisuje ich marginesy.
