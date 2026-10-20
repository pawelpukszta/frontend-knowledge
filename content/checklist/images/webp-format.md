---
title: WebP z fallbackiem
priority: high
---

WebP przez `<picture>` lub negocjację po nagłówku `Accept` na CDN, z JPEG/PNG jako zapasem dla nielicznych starych przeglądarek i klientów spoza przeglądarki.

## Dlaczego to ważne

- WebP działa we wszystkich głównych przeglądarkach od Safari 14 (2020), ale obrazy z serwisu trafiają też do klientów pocztowych, czytników RSS i podglądów linków, które nie zawsze go obsługują.
- Fallback w `<img>` sprawia, że przeglądarka bez wsparcia po prostu pobierze JPEG, zamiast pokazać pusty obszar.
- Negocjacja po `Accept` pozwala zachować jeden adres obrazu w HTML; wymaga jednak `Vary: Accept`, inaczej cache CDN poda WebP klientowi, który go nie rozumie.

## Jak sprawdzić

Network: kolumna Type i nagłówki odpowiedzi (`Content-Type`, `Vary`); test w przeglądarce lub kliencie bez WebP, np. przez `curl` z nagłówkiem `Accept: image/jpeg`.

## Kod

```html title="Fallback w znacznikach"
<picture>
  <source srcset="/img/hotel-kreta-basen.webp" type="image/webp" />
  <img src="/img/hotel-kreta-basen.jpg" alt="Basen hotelu przy plaży" width="1200" height="800" />
</picture>
```

```http title="Negocjacja na CDN"
GET /img/hotel-kreta-basen.jpg HTTP/2
Accept: image/avif,image/webp,image/apng,*/*;q=0.8

HTTP/2 200
Content-Type: image/webp
Vary: Accept
Cache-Control: public, max-age=31536000, immutable
```

## Częste błędy

- Brak `Vary: Accept` przy negocjacji formatu; cache pośredni miesza wersje.
