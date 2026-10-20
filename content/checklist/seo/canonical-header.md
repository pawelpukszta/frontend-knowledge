---
title: Spójny canonical w HTML i nagłówku Link
priority: medium
sources:
  - title: "Google: How to specify a canonical URL"
    url: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
---

Canonical można podać w `<link rel="canonical">` albo w nagłówku HTTP `Link` (jedyna opcja dla PDF i innych plików). Jeśli są oba, muszą wskazywać ten sam, bezwzględny URL.

## Dlaczego to ważne

- Sprzeczne sygnały canonical sprawiają, że Google traktuje je jako niewiarygodne i sam wybiera wersję strony.
- Nagłówek bywa dodawany przez CDN, wtyczkę lub proxy niezależnie od szablonu HTML; po zmianie adresów jedno z miejsc zostaje nieaktualne.
- Dla plików PDF (cenniki, katalogi) nagłówek `Link` to jedyny sposób, by wskazać preferowaną kopię, gdy ten sam plik jest pod kilkoma adresami.

## Jak sprawdzić

Porównaj nagłówek i HTML poleceniami poniżej; Search Console (Inspekcja adresu URL) pokaże canonical wybrany przez Google.

## Kod

```http title="Odpowiedź serwera dla PDF"
HTTP/2 200
content-type: application/pdf
link: <https://example.pl/katalogi/lato-2027.pdf>; rel="canonical"
```

```bash title="Porównanie nagłówka i HTML"
url="https://example.pl/wakacje/grecja"
curl -sI "$url" | grep -i '^link:.*canonical'
curl -s "$url" | grep -oi '<link[^>]*rel="canonical"[^>]*>'
```

## Częste błędy

- Względny URL w nagłówku `Link`.
- Canonical w HTML wskazujący wersję z `https://`, a w nagłówku z `http://` lub bez `www`.
