---
title: Adresy w sitemap z właściwej domeny
priority: medium
---

Wszystkie URL w sitemap muszą należeć do tej samej domeny i protokołu (np. bez adresów stagingu czy `http://`).

## Dlaczego to ważne

- Adresy z innego hosta niż ten, na którym leży sitemap, są pomijane, chyba że obie właściwości są zweryfikowane w Search Console i zgłoszone celowo.
- Adresy stagingu w produkcyjnej sitemap to wyciek nieopublikowanych treści i zaproszenie dla robota do indeksowania kopii serwisu.
- Wersje `http://` lub z `www.` tam, gdzie kanoniczna jest inna, dodają przekierowania i rozmywają sygnał kanoniczny.

## Jak sprawdzić

Przegląd sitemap; skrypt poniżej w CI.

## Kod

```bash title="Wszystkie adresy z jednej domeny i przez HTTPS"
foreign=$(curl -s https://example.pl/sitemap.xml \
  | grep -oP '(?<=<loc>)[^<]+' \
  | grep -vE '^https://example\.pl(/|$)')
# Fail the build on staging hosts, www or plain http
if [ -n "$foreign" ]; then echo "Unexpected URLs:"; echo "$foreign"; exit 1; fi
echo "OK"
```

## Częste błędy

- Domena sitemap budowana z nagłówka `Host` żądania, więc na stagingu i produkcji powstają różne adresy.
