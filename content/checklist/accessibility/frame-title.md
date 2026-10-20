---
title: Ramki iframe mają tytuł
priority: medium
---

Każdy `<iframe>` z treścią ma unikalny, opisowy atrybut `title`, np. `title="Mapa dojazdu do hotelu"`. Bez niego czytnik ogłasza adres URL.

## Dlaczego to ważne

- Bez tytułu użytkownik słyszy np. "ramka, google.com/maps/embed?pb=..." i nie wie, czy warto do niej wchodzić.
- Lista ramek w czytniku pozwala szybko odróżnić mapę, wideo i widżet opinii; to wymóg WCAG 4.1.2 (A).
- Ramki czysto techniczne (analityka, tagi reklamowe) bez treści dla użytkownika ukryj, np. atrybutem `hidden`, żeby nie zaśmiecały nawigacji.

## Jak sprawdzić

axe (`frame-title`, `frame-title-unique`); lista ramek w czytniku ekranu.

## Kod

```html
<!-- Bad: announced as a URL -->
<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="400"></iframe>

<!-- Good: unique, descriptive titles -->
<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="400"
        title="Mapa dojazdu do hotelu Aegean Blue" loading="lazy"></iframe>
<iframe src="https://www.youtube-nocookie.com/embed/abc123" width="560" height="315"
        title="Wideo: spacer po hotelu Aegean Blue" allowfullscreen loading="lazy"></iframe>
```

## Częste błędy

- Ten sam tytuł "iframe" lub "mapa" dla kilku różnych ramek na stronie.
