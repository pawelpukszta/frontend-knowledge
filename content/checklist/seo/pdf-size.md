---
title: Linkowane PDF-y poniżej 64 MB
priority: medium
sources:
  - title: "Google: File types indexable by Google"
    url: https://developers.google.com/search/docs/crawling-indexing/indexable-file-types
  - title: "Google: Googlebot"
    url: https://developers.google.com/search/docs/crawling-indexing/googlebot
---

Googlebot pobiera tylko pierwsze 64 MB pliku PDF; reszta jest pomijana przy indeksowaniu. Kompresuj PDF-y, a ważną treść publikuj też jako HTML.

## Dlaczego to ważne

- Katalog lub warunki uczestnictwa w PDF powyżej limitu zostaną zindeksowane tylko częściowo.
- Duży PDF to długie pobieranie na mobile; użytkownik z wyników często rezygnuje, a strona HTML ładuje się od razu, jest responsywna i lepiej działa z czytnikami ekranu.
- PDF ze skanu (sam obraz) nie zawiera tekstu do indeksowania; potrzebna jest warstwa OCR lub wersja HTML.

## Jak sprawdzić

Sprawdź rozmiary plików (`Content-Length`) i czy PDF zawiera tekst (zaznacz fragment w przeglądarce).

## Kod

```bash
# Size of a linked PDF without downloading it
curl -sI https://example.pl/pliki/katalog-lato-2026.pdf | grep -i content-length

# Recompress with Ghostscript (images downsampled to ~150 dpi)
gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -dQUIET \
   -sOutputFile=katalog-lato-2026-min.pdf katalog-lato-2026.pdf
```

## Częste błędy

- Cennik dostępny wyłącznie jako PDF, bez odpowiednika HTML.
