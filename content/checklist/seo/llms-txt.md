---
title: Plik llms.txt dla serwisów z dużą dokumentacją
priority: medium
sources:
  - title: "llmstxt.org: The /llms.txt file"
    url: https://llmstxt.org/
---

Proponowany standard `/llms.txt` z wyselekcjonowaną listą najważniejszych stron dla narzędzi AI. To dobrowolna konwencja: Google oficjalnie z niej nie korzysta, ale używają jej niektóre narzędzia i agenci.

## Dlaczego to ważne

- Asystenci i agenci AI mają ograniczony kontekst; krótka lista linków do wersji Markdown dokumentacji pozwala im szybciej trafić we właściwe strony zamiast parsować nawigację HTML.
- Plik nie wpływa na pozycje w Google, więc nie inwestuj w niego kosztem podstaw: indeksowalności, szybkości i jakości treści.
- Największy sens ma w serwisach z dokumentacją, API lub bazą wiedzy, np. warunki uczestnictwa i API ofert dla partnerów.

## Jak sprawdzić

Otwórz `/llms.txt` i sprawdź, czy linki zwracają 200.

## Kod

```md title="llms.txt"
# Example Podróże

> Biuro podróży online: wakacje, last minute i wycieczki objazdowe z wylotem z Polski.

## Dla klientów
- [Warunki uczestnictwa](https://example.pl/warunki.md): rezerwacja, płatności i rezygnacja
- [Ubezpieczenia](https://example.pl/ubezpieczenia.md): zakres polis w cenie wyjazdu

## Dla partnerów
- [API ofert](https://example.pl/docs/api.md): wyszukiwanie ofert i dostępności

## Optional
- [Blog](https://example.pl/blog): porady i przewodniki
```

## Częste błędy

- Linki w llms.txt do stron, które już nie istnieją lub wymagają logowania.
