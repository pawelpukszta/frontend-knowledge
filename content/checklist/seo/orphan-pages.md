---
title: Brak stron-sierot
priority: medium
---

Strona bez żadnych linków wewnętrznych jest trudna do odnalezienia dla robotów i użytkowników, nawet jeśli jest w sitemap.

## Dlaczego to ważne

- Google odkrywa i ocenia strony głównie przez linki; strona obecna tylko w sitemap dostaje mało sygnałów i bywa uznana za mało ważną.
- Sieroty powstają po przebudowie nawigacji, przy landingach kampanii i ofertach dodanych w CMS bez przypisania do kategorii.
- Użytkownik też jej nie znajdzie bez wyszukiwarki; często to treści, za które zapłacono, a które nie pracują.

## Jak sprawdzić

Porównaj adresy z sitemap/analityki z listą stron znalezionych przez crawler.

## Kod

```bash title="Adresy z sitemap nieosiągalne przez linki"
# crawl.txt: URLs exported from the crawler (internal, HTML, status 200)
curl -s https://example.pl/sitemap.xml | grep -oP '(?<=<loc>)[^<]+' | sort -u > sitemap.txt
sort -u crawl.txt > crawled.txt
# In the sitemap but never reached through links = orphan pages
comm -23 sitemap.txt crawled.txt
```

## Częste błędy

- Uznanie problemu za rozwiązany, bo strona "jest w sitemap".
