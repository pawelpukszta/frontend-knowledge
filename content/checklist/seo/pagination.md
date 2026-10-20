---
title: Canonical na stronach paginacji
priority: medium
sources:
  - title: "Google: Pagination best practices"
    url: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
---

Każda strona paginacji (`?page=2`) ma unikalny adres i canonical na siebie, a nie na stronę 1, bo zawiera inne oferty. Strony łączą zwykłe linki `<a href>`. Google nie używa już `rel=prev/next` jako sygnału indeksowania.

## Dlaczego to ważne

- Canonical na stronę 1 mówi Google, że strony 2 i dalsze są duplikatami; oferty widoczne tylko tam mogą nie zostać odkryte.
- Przycisk "Pokaż więcej" i nieskończone przewijanie bez prawdziwych linków do kolejnych stron ukrywają produkty przed robotem, który nie klika i nie przewija.
- Google ignoruje fragmenty adresu, więc `#page=2` nie tworzy osobnej strony; numer musi być w ścieżce lub parametrze zapytania.

## Jak sprawdzić

Sprawdź canonical na stronach 2, 3 itd.; wyłącz JS i upewnij się, że linki do kolejnych stron są w HTML.

## Kod

```html title="Strona 2 listy ofert"
<!-- https://example.pl/wakacje/grecja?page=2 -->
<link rel="canonical" href="https://example.pl/wakacje/grecja?page=2" />
<title>Wakacje w Grecji: oferty, strona 2</title>

<nav aria-label="Paginacja">
  <a href="/wakacje/grecja">1</a>
  <a href="/wakacje/grecja?page=2" aria-current="page">2</a>
  <a href="/wakacje/grecja?page=3">3</a>
</nav>
```

## Częste błędy

- Paginacja na `<button onClick>` bez adresów URL.
- Link do `?page=1` obok adresu bez parametru, co tworzy duplikat strony 1.
