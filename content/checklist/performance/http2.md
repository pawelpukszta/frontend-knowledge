---
title: HTTP/2 lub HTTP/3
priority: high
---

Serwer i CDN obsługują HTTP/2, a najlepiej także HTTP/3. HTTP/2 multipleksuje wiele zapytań w jednym połączeniu i kompresuje nagłówki; HTTP/3 (QUIC) dodatkowo szybciej nawiązuje połączenie i lepiej znosi utratę pakietów na niestabilnych sieciach.

## Dlaczego to ważne

- HTTP/1.1 pozwala na ok. 6 równoległych połączeń do domeny, więc przy kilkudziesięciu zasobach tworzy się kolejka.
- HTTP/3 pomaga szczególnie w sieciach komórkowych i przy zmianie sieci (Wi-Fi hotelowe na LTE), bo połączenie QUIC może przetrwać zmianę adresu IP.
- Stare optymalizacje pod HTTP/1.1 (domain sharding) przy HTTP/2 szkodzą, bo wymuszają dodatkowe połączenia.

## Jak sprawdzić

Kolumna Protocol w Network (`h2`, `h3`), insight o nowoczesnym HTTP w Lighthouse, nagłówek `alt-svc` z ogłoszeniem `h3`.

## Kod

```bash title="Sprawdzenie protokołu"
curl -sI https://example.pl | grep -i alt-svc   # expect: alt-svc: h3=":443"; ma=86400
curl -sI --http3-only https://example.pl | head -1  # requires curl built with HTTP/3
```

```js title="W konsoli przeglądarki"
performance.getEntriesByType('resource')
  .map((r) => `${r.nextHopProtocol}  ${r.name}`)
  .forEach((line) => console.log(line)); // h2 / h3 per resource
```

## Częste błędy

- HTTP/2 włączone na głównej domenie, ale zasoby z własnej, starej domeny statycznej serwowane przez HTTP/1.1.
