---
title: Cache przeglądarki
priority: high
---

Statyczne zasoby z hashem w nazwie: `Cache-Control: public, max-age=31536000, immutable`; HTML krótko lub z walidacją (`no-cache` + `ETag`), żeby użytkownik zawsze dostał aktualną wersję strony.

## Dlaczego to ważne

- Powracający użytkownik (a w turystyce wraca się wiele razy przed decyzją) pobiera tylko HTML i zmienione pliki, więc strona ładuje się wyraźnie szybciej.
- Hash w nazwie pliku (`app.3f2a9c.js`) pozwala bezpiecznie cache'ować na rok: nowa wersja ma nową nazwę, więc nie ma ryzyka starego kodu.
- Długi cache HTML bez walidacji to ryzyko, że użytkownik zobaczy nieaktualne ceny lub HTML odwołujący się do usuniętych plików JS.

## Jak sprawdzić

Nagłówki odpowiedzi w Network, drugie wejście na stronę (kolumna Size: "disk cache" / "memory cache"), insight o czasie życia cache w Lighthouse.

## Kod

```http title="Zasób statyczny z hashem"
HTTP/2 200
content-type: text/javascript
cache-control: public, max-age=31536000, immutable
```

```http title="Dokument HTML"
HTTP/2 200
content-type: text/html; charset=utf-8
cache-control: no-cache
etag: "offer-8812-v42"
```

## Częste błędy

- `max-age=31536000` na plikach bez hasha (np. `/js/app.js`): użytkownicy utkną na starej wersji.
- `no-store` na wszystkim "na wszelki wypadek", co wyłącza cache i dodatkowo utrudnia korzystanie z bfcache.
