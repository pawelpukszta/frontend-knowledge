---
title: Bez konfliktu robots.txt i noindex
priority: high
sources:
  - title: "Google: Robots meta tag, data-nosnippet, and X-Robots-Tag specifications"
    url: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
---

Strona zablokowana w robots.txt nie zostanie pobrana, więc Google nie zobaczy jej `noindex` i może zaindeksować sam adres, jeśli prowadzą do niego linki. Aby usunąć stronę z indeksu, pozwól na crawl i ustaw `noindex` (meta lub `X-Robots-Tag`).

## Dlaczego to ważne

- Typowy objaw w wynikach: adres bez opisu, bo Google zna URL z linków, ale nie może przeczytać treści ani dyrektyw.
- Reguły robots.txt i noindex często ustawiają różne osoby (dev, SEO, admin serwera), więc konflikt powstaje niezauważony, np. przy blokowaniu wyników wyszukiwania wewnętrznego.
- Search Console oznacza takie strony jako "zaindeksowane, mimo blokady w robots.txt"; to sygnał, że blokada nie spełnia swojego celu.

## Jak sprawdzić

Porównaj reguły robots.txt ze stronami oznaczonymi noindex; sprawdź raport stron w Search Console.

## Kod

```txt title="Źle: robots.txt"
User-agent: *
# Googlebot never fetches these URLs,
# so the noindex they carry is never seen
Disallow: /szukaj
Disallow: /rezerwacja/
```

```http title="Dobrze: crawl dozwolony, noindex w nagłówku"
GET /szukaj?q=kreta HTTP/2
Host: example.pl

HTTP/2 200
content-type: text/html; charset=utf-8
x-robots-tag: noindex, follow
```

## Częste błędy

- Dodanie `Disallow` "dla pewności" do stron, które już mają noindex.
- Blokada w robots.txt jako sposób na usunięcie z indeksu stron, które już tam są.
