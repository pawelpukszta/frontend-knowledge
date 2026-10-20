---
title: Bez niepoprawnych linków
priority: medium
---

Puste `href`, `href="#"` bez funkcji, literówki w schemacie (`htp://`), `javascript:` jako nawigacja. Roboty i czytniki ekranu potrzebują prawdziwych adresów w `<a href>`.

## Dlaczego to ważne

- Google odkrywa linki tylko z elementów `<a>` z atrybutem `href` zawierającym adres URL; nawigacja przez `onclick` lub `javascript:void(0)` nie zostanie przez robota podjęta.
- Czytnik ekranu ogłasza `<a href="#">` jako link, a po aktywacji strona przewija się na górę; element udaje coś, czym nie jest. Akcje bez zmiany adresu to `<button>`.
- Literówka w schemacie (`https//`) zamienia link w ścieżkę względną i tworzy 404 w obrębie Twojej domeny.

## Jak sprawdzić

Crawler, axe, wyszukanie w kodzie wzorca `href="(#|javascript:)?"`.

## Kod

```html title="Źle"
<a href="#" onclick="openGallery()">Zobacz zdjęcia</a>
<a href="javascript:void(0)" onclick="goTo('/oferty/kreta')">Kreta</a>
<a href="">Regulamin</a>
<a href="https//example.pl/warunki">Warunki uczestnictwa</a>
```

```html title="Dobrze"
<button type="button" onclick="openGallery()">Zobacz zdjęcia</button>
<a href="/oferty/kreta">Kreta</a>
<a href="/regulamin">Regulamin</a>
<a href="https://example.pl/warunki">Warunki uczestnictwa</a>
```

## Częste błędy

- Komponent `Link` renderowany jako `<span>` w trakcie ładowania danych i nigdy niezamieniany na `<a>` w SSR.
