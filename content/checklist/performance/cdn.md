---
title: Zasoby z CDN
priority: high
---

Serwery bliżej użytkownika skracają opóźnienia i odciążają serwer aplikacji. Dotyczy statycznych plików i obrazów, a coraz częściej też HTML cache'owanego na brzegu z krótkim czasem życia.

## Dlaczego to ważne

- Round-trip z Polski do serwera w USA to ok. 100 ms lub więcej; przy kilku połączeniach i handshake'u TLS daje to setki milisekund straty przed pierwszym bajtem.
- CDN przejmuje szczyty ruchu (np. start sprzedaży first minute, mailing), więc serwer aplikacji nie pada przy największym zainteresowaniu.
- Nowoczesne CDN dają przy okazji HTTP/3, kompresję Brotli, optymalizację obrazów i ochronę przed DDoS.

## Jak sprawdzić

Nagłówki CDN (np. `x-cache`, `cf-cache-status`, `age`), test z różnych lokalizacji (WebPageTest), współczynnik trafień cache w panelu CDN.

## Kod

```http title="HTML cache'owany na CDN, krótko w przeglądarce"
HTTP/2 200
content-type: text/html; charset=utf-8
cache-control: public, max-age=0, must-revalidate
cdn-cache-control: max-age=300, stale-while-revalidate=3600
cf-cache-status: HIT
age: 87
```

## Częste błędy

- Cache'owanie na CDN stron spersonalizowanych (koszyk, zalogowany użytkownik) bez odpowiedniego `Vary` lub `private`: jeden klient zobaczy dane drugiego.
