---
title: Kierunek tekstu dla języków RTL
priority: medium
---

`dir="rtl"` dla arabskiego, hebrajskiego, perskiego itp. (na `html` lub fragmencie), `dir="auto"` dla treści od użytkowników w nieznanym języku, np. opinii i imion.

## Dlaczego to ważne

- Bez `dir` tekst RTL wyświetla się z przestawioną interpunkcją i liczbami w złych miejscach, więc zdanie staje się nieczytelne.
- Atrybut `dir`, a nie samo CSS `direction`, przekazuje kierunek także czytnikom ekranu, tłumaczom i wyszukiwarkom.
- Właściwości logiczne CSS (`padding-inline`, `margin-inline-start`, `inset-inline-end`) odwracają layout automatycznie, bez osobnego arkusza RTL.

## Jak sprawdzić

Podgląd wersji językowych RTL; ustaw `dir="rtl"` na `html` w DevTools i sprawdź, czy layout odwraca się lustrzanie.

## Kod

```html
<!-- Arabic version of the site -->
<html lang="ar" dir="rtl">

<!-- Polish page with user reviews in any language -->
<p dir="auto">فندق رائع وإطلالة جميلة على البحر</p>
<p><bdi>יעל כהן</bdi> oceniła hotel na 9/10</p>
```

```css
/* Logical properties flip automatically in RTL */
.offer-card__badge { position: absolute; inset-inline-end: 1rem; }
.offer-card__body { padding-inline: 1.5rem; }
.icon-arrow:dir(rtl) { transform: scaleX(-1); }
```

## Częste błędy

- `margin-left` i `left` na sztywno w komponentach, które mają działać w obu kierunkach.
