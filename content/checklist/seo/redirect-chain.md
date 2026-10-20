---
title: Bez łańcuchów przekierowań
priority: high
sources:
  - title: "Google: Redirects and Google Search"
    url: https://developers.google.com/search/docs/crawling-indexing/301-redirects
  - title: "Google: How HTTP status codes and network errors affect Google Search"
    url: https://developers.google.com/search/docs/crawling-indexing/http-network-errors
---

Każde przekierowanie prowadzi od razu do adresu docelowego, który zwraca 200, bez pośrednich kroków A → B → C.

## Dlaczego to ważne

- Każdy skok to dodatkowe żądanie HTTP (przy innej domenie także DNS i TLS); na mobile to nawet setki milisekund gorszego TTFB i LCP.
- Roboty Google podążają za maksymalnie 10 przekierowaniami; dłuższy łańcuch kończy się błędem i strona docelowa nie zostanie pobrana.
- Łańcuchy narastają po każdej migracji (http → https, www → bez www, stara struktura → nowa); bez porządków po kilku latach jeden adres ma 3-4 skoki.

## Jak sprawdzić

`curl -sIL` pokazuje każdy skok; crawler ma raport łańcuchów przekierowań. Po migracji zaktualizuj stare reguły tak, by wskazywały bezpośrednio nowy cel.

## Kod

```bash title="Sprawdzenie łańcucha"
curl -sIL http://example.pl/Oferty/Grecja | grep -iE '^(HTTP|location)'
# HTTP/1.1 301 Moved Permanently
# location: https://example.pl/Oferty/Grecja
# HTTP/2 301
# location: https://example.pl/oferty/grecja
# HTTP/2 308
# location: https://example.pl/wakacje/grecja
# HTTP/2 200          <- three hops, should be one
```

```txt title="nginx: jeden skok do celu"
# Map legacy paths straight to final URLs
map $request_uri $new_uri {
    ~*^/oferty/grecja/?$   /wakacje/grecja;
    ~*^/oferty/kreta/?$    /wakacje/grecja/kreta;
}
server {
    listen 80;
    server_name example.pl www.example.pl;
    # http + legacy path resolved in a single 301
    if ($new_uri) { return 301 https://example.pl$new_uri; }
    return 301 https://example.pl$request_uri;
}
```

## Częste błędy

- Nowa reguła przekierowania dopisana "na końcu", tak że stary adres przechodzi przez wszystkie wcześniejsze reguły.
- Pętla przekierowań między wersją z ukośnikiem i bez.
