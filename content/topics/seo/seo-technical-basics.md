---
title: "Techniczne SEO: title, meta, canonical, robots i sitemap"
level: mid
added: 2026-10-23
tags:
  - SEO
  - canonical
  - robots.txt
  - noindex
  - sitemap
  - hreflang
summary: "Front-end odpowiada za sygnały, z których Google składa wynik wyszukiwania: `<title>`, meta description, canonical, dyrektywy robots, sitemapę, kody HTTP i hreflang. Najczęstsze błędy to mylenie `noindex` z `Disallow` i canonical wskazujący nie tę stronę."
sources:
  - title: "Google Search Central: Influencing title links"
    url: https://developers.google.com/search/docs/appearance/title-link
  - title: "Google Search Central: Control your snippets in search results"
    url: https://developers.google.com/search/docs/appearance/snippet
  - title: "Google Search Central: How to specify a canonical URL"
    url: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
  - title: "Google Search Central: Block Search indexing with noindex"
    url: https://developers.google.com/search/docs/crawling-indexing/block-indexing
  - title: "Google Search Central: Introduction to robots.txt"
    url: https://developers.google.com/search/docs/crawling-indexing/robots/intro
  - title: "Google Search Central: Build and submit a sitemap"
    url: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
  - title: "Google Search Central: HTTP status codes and network errors"
    url: https://developers.google.com/search/docs/crawling-indexing/http-network-errors
  - title: "Google Search Central: Redirects and Google Search"
    url: https://developers.google.com/search/docs/crawling-indexing/301-redirects
  - title: "Google Search Central: Localized versions of your pages (hreflang)"
    url: https://developers.google.com/search/docs/specialty/international/localized-versions
---

## Wyjaśnienie

`<title>` jest głównym źródłem tytułu wyniku w Google, ale tylko jednym z kilku. Google bierze też pod uwagę `<h1>`, `og:title` czy tekst linków i może tytuł przepisać, gdy ten jest za ogólny ("Strona główna") albo przeładowany słowami kluczowymi. Meta description to propozycja opisu pod tytułem. Google używa jej, gdy lepiej opisuje stronę niż fragment treści, w innym razie buduje opis sam. Nie ma limitu długości, wynik jest po prostu przycinany do szerokości ekranu. Każda strona powinna mieć własny tytuł i opis.

Ta sama treść bywa dostępna pod wieloma adresami: `?utm_source=...`, `?sort=price`, z ukośnikiem na końcu i bez, `http` i `https`, z `www` i bez. Google wybierze wtedy jedną wersję sam. **Canonical** (`<link rel="canonical" href="...">`) to silna wskazówka, którą wersję uznać za główną. Przekierowanie 301 też jest silnym sygnałem, ale zabiera użytkownikowi duplikat. Canonical zostawia go dostępnym. Sitemapa to słaby sygnał. Strona kanoniczna powinna wskazywać samą siebie (self-referencing canonical).

`noindex` i `Disallow` działają na różnych etapach:

| | `<meta name="robots" content="noindex">` | `robots.txt`: `Disallow` |
|---|---|---|
| Co blokuje | indeksowanie | pobieranie (crawling) |
| URL w wynikach | znika po ponownym crawlu | może zostać, bez opisu, jeśli linkują do niego inne strony |
| Zastosowanie | strony, które mają nie trafić do wyników | oszczędzanie budżetu crawla, np. nieskończone filtry |

Łączenie obu na jednym URL nie działa: Googlebot nie pobierze strony zablokowanej w `robots.txt`, więc nigdy nie zobaczy `noindex`. Dla plików bez HTML (PDF, obrazy) ten sam efekt daje nagłówek `X-Robots-Tag: noindex`.

Plik `sitemap.xml` podpowiada, które URL-e są ważne. Limit to 50 000 adresów lub 50 MB na plik, adresy muszą być pełne (z protokołem i domeną). Google ignoruje `<priority>` i `<changefreq>`, a `<lastmod>` bierze pod uwagę tylko wtedy, gdy jest konsekwentnie prawdziwy. Sitemapę zgłaszasz w Search Console albo linią `Sitemap:` w `robots.txt`. Przy małym, dobrze podlinkowanym serwisie nie jest konieczna.

Kody HTTP też są sygnałem dla Google. 301 i 308 to przekierowania stałe, więc w wynikach pojawi się nowy adres. 302 i 307 są tymczasowe i Google traktuje je jako słabszy sygnał. Wszystkie 4xx poza 429 Google traktuje tak samo: treści nie ma, a zaindeksowany URL wypada z indeksu (410 nie ma osobnego traktowania). 5xx i 429 spowalniają crawl. **Soft 404** to strona błędu albo pusta strona zwracająca 200: Search Console ją oznaczy, a zanim to nastąpi, śmieci mogą trafić do indeksu.

Atrybut `hreflang` łączy wersje językowe tej samej strony. Każda wersja wymienia siebie i wszystkie pozostałe, a odnośniki muszą być wzajemne, inaczej Google je zignoruje. Kod to język ISO 639-1 z opcjonalnym regionem (`pl-PL`, `en-GB`). Wartość `x-default` wskazuje stronę dla pozostałych użytkowników, np. wybór języka.

## Kod

```html title="<head> strony oferty"
<head>
  <title>Wczasy na Krecie, hotel 4* z all inclusive | Biuro Podróży</title>
  <meta name="description" content="7 nocy w hotelu przy plaży w Chersonissos. Wylot z Warszawy, cena od 3499 zł za osobę." />
  <!-- Same canonical for ?sort=..., ?utm_source=... and the URL with a trailing slash -->
  <link rel="canonical" href="https://example.pl/oferty/kreta-hotel-aria" />
  <link rel="alternate" hreflang="pl-PL" href="https://example.pl/oferty/kreta-hotel-aria" />
  <link rel="alternate" hreflang="en-GB" href="https://example.pl/en/offers/crete-hotel-aria" />
  <link rel="alternate" hreflang="x-default" href="https://example.pl/en/offers/crete-hotel-aria" />
</head>
```

```txt title="robots.txt"
User-agent: *
# Save crawl budget on endless filter combinations
Disallow: /szukaj?
# Do NOT disallow pages that carry noindex: Googlebot must fetch them to see it
Sitemap: https://example.pl/sitemap.xml
```

## Częste błędy

- `noindex` na stronie, która jednocześnie ma `Disallow` w `robots.txt`. Google nie widzi `noindex`, a URL może dalej wisieć w wynikach.
- Canonical wskazujący stronę główną albo pierwszą stronę listy dla wszystkich podstron. Google zignoruje taki sygnał albo wyrzuci z indeksu treść, która miała się w nim znaleźć.
- Strona "Nie znaleziono" zwracająca 200 (soft 404) i przekierowania 302 przy stałej zmianie adresów.
- Ten sam `<title>` i opis na setkach stron, np. "Oferta | Sklep".

## Pytania

### noindex vs Disallow: kiedy każde jest błędem? {#seo-technical-basics-q1}

`Disallow` w `robots.txt` blokuje pobieranie strony, a `noindex` blokuje jej indeksowanie. `Disallow` jest błędem, gdy chcesz usunąć stronę z wyników: Google jej nie pobierze, ale może zostawić sam URL w wynikach, jeśli prowadzą do niego linki. `noindex` jest błędem na stronach, które mają rankować, i bywa pomyłką w szablonie (np. zostaje po stagingu). Połączenie obu na jednym URL to klasyczna pułapka, bo crawler nie dotrze do `noindex`. Zasada: `noindex` do usuwania z indeksu, `Disallow` do oszczędzania crawla na stronach bez wartości, np. kombinacjach filtrów.

### Czym jest canonical URL i kiedy go potrzebujesz? {#seo-technical-basics-q2}

To adres, który Google ma uznać za główną wersję treści dostępnej pod wieloma URL-ami. Potrzebujesz go przy parametrach śledzących (`utm_*`, `gclid`), sortowaniu i filtrach, które nie zmieniają treści, wariantach z ukośnikiem i bez, `www` i bez, a także przy treści syndykowanej. Ustawiasz go przez `<link rel="canonical">` w `<head>` albo nagłówek HTTP `Link` (np. dla PDF). Strona kanoniczna powinna wskazywać samą siebie. To wskazówka, a nie polecenie: Google może wybrać inny adres, jeśli sygnały są sprzeczne, np. sitemapa i linki wewnętrzne prowadzą gdzie indziej.

### Kiedy użyć przekierowania 301, a kiedy rel="canonical"? {#seo-technical-basics-q3}

301 stosujesz, gdy stary adres ma zniknąć: zmiana struktury URL, migracja domeny, przejście na HTTPS. Użytkownik i bot trafiają od razu na nowy adres, a Google traktuje to jako silny sygnał. Canonical stosujesz, gdy duplikat ma pozostać dostępny, bo jest potrzebny użytkownikowi: lista posortowana po cenie albo URL z parametrem kampanii. Przekierowanie po stronie serwera jest pewniejsze niż przekierowanie w JavaScripcie, które działa tylko, jeśli renderowanie się powiedzie.

### Co to jest soft 404 i jak go uniknąć? {#seo-technical-basics-q4}

Soft 404 to strona, która dla użytkownika wygląda na błąd albo jest pusta, a serwer zwraca 200. Google może ją zaindeksować jak zwykłą treść, a w Search Console zgłosi ją jako soft 404. Naprawa: dla nieistniejącej treści zwracaj prawdziwy 404 (lub 410), dla przeniesionej 301. W SPA, gdzie serwer zawsze zwraca 200, przekieruj na adres, który zwraca 404, albo dodaj `<meta name="robots" content="noindex">` na widoku błędu.

```ts
// Express 5: real status codes instead of a 200 "not found" page
app.get('/oferty/:slug', async (req, res) => {
  const offer = await findOffer(req.params.slug);
  if (!offer) return res.status(404).render('not-found');
  if (offer.movedTo) return res.redirect(301, `/oferty/${offer.movedTo}`);
  res.render('offer', { offer });
});
```

## Quiz

### Strona ma `<meta name="robots" content="noindex">`, a jej URL jest zablokowany w robots.txt przez `Disallow`. Co się stanie? {#seo-technical-basics-z1}

- [ ] Google usunie stronę z indeksu, bo widzi obie dyrektywy
- [x] Google nie pobierze strony, więc nie zobaczy `noindex`, a URL może zostać w wynikach
- [ ] `Disallow` ma pierwszeństwo i automatycznie usuwa URL z indeksu
- [ ] Google zgłosi konflikt i zignoruje robots.txt

Crawler nie pobiera stron zablokowanych w robots.txt, więc dyrektywa `noindex` w ich HTML jest dla niego niewidoczna.

### Które pola sitemapy Google ignoruje? {#seo-technical-basics-z2}

- [ ] `<loc>` i `<lastmod>`
- [x] `<priority>` i `<changefreq>`
- [ ] Tylko `<lastmod>`
- [ ] Żadne, wszystkie wpływają na częstotliwość crawla

Google ignoruje `<priority>` i `<changefreq>`, a `<lastmod>` uwzględnia tylko wtedy, gdy jest konsekwentnie prawdziwy.
