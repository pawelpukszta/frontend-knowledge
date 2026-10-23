---
title: "SEO a JavaScript: jak Google renderuje SPA"
level: mid
added: 2026-10-23
tags:
  - SEO
  - SPA
  - Googlebot
  - SSR
  - Search Console
summary: "Google pobiera HTML, renderuje stronę w headless Chromium i indeksuje wynik renderu. SPA renderowane tylko po stronie klienta działa, dopóki nic nie zawiedzie: treść, linki i kody HTTP najlepiej mieć już w HTML z serwera."
flow: [Crawling, Kolejka renderowania, Rendering, Indeksowanie]
sources:
  - title: "Google Search Central: Understand JavaScript SEO basics"
    url: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
  - title: "Google Search Central: Fix Search-related JavaScript problems"
    url: https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript
  - title: "Google Search Central: Make your links crawlable"
    url: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
  - title: "Google Search Central: Pagination, incremental page loading"
    url: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
  - title: "Google Search Central: Understanding page experience"
    url: https://developers.google.com/search/docs/appearance/page-experience
  - title: "Search Console Help: URL Inspection tool"
    url: https://support.google.com/webmasters/answer/9012289
  - title: "Next.js: Streaming (HTTP contract, bots and crawlers)"
    url: https://nextjs.org/docs/app/guides/streaming
---

## Wyjaśnienie

Google przetwarza stronę z JavaScriptem w trzech fazach:

1. **Crawling**: Googlebot sprawdza `robots.txt`, pobiera HTML i wyciąga z niego linki `<a href>`.
2. **Rendering**: strony ze statusem 200 trafiają do kolejki. Headless Chromium wykonuje JS i z wyrenderowanego HTML zbiera kolejne linki. W kolejce strona może czekać kilka sekund albo dłużej. Strony z 404 mogą w ogóle nie być renderowane.
3. **Indeksowanie**: do indeksu trafia wyrenderowany HTML.

Google renderuje JS, ale SSR albo prerendering nadal się opłaca: strona jest szybsza, a nie każdy bot wykonuje JavaScript. Dynamic rendering (osobny HTML dla botów) Google opisuje jako obejście, nie zalecane rozwiązanie.

Typowe pułapki SPA renderowanego tylko po stronie klienta:

- Pusty HTML na starcie (`<div id="root"></div>`). Wszystko zależy od udanego renderu. Błąd JS, zablokowany w `robots.txt` bundle albo timeout API oznacza pustą stronę w indeksie.
- Linki bez `href`. Google niezawodnie odczytuje tylko `<a>` z `href`. `<span onClick>`, `<a routerLink>` bez `href` i `href="javascript:..."` nie są pewnymi linkami.
- Treść dostępna dopiero po interakcji. Googlebot nie klika "Pokaż więcej", nie przewija jak człowiek i odrzuca prośby o uprawnienia. Między wczytaniami stron czyści `localStorage`, `sessionStorage` i cookies.
- Routing na `#` (`/#/oferty`). Google ignoruje fragment, więc wszystkie widoki są dla niego jednym URL-em. Używaj History API.
- Kody HTTP. Serwer SPA zwraca 200 dla każdej ścieżki, co daje soft 404. Rozwiązania: przekierowanie JS na URL zwracający 404 albo `noindex` na widoku błędu. `noindex` usuwany przez JS nie zadziała: Google może pominąć renderowanie, gdy widzi `noindex` w HTML.

SSR, SSG, ISR i RSC sprawiają, że treść i linki są w HTML od pierwszego bajtu (szczegóły strategii w temacie o CSR, SSR, SSG i ISR). Zostają dwa wymagania. Pierwsze to zgodność (parity): to, co widzi bot w HTML z serwera, ma się zgadzać z DOM po hydracji. Canonical, `<title>` czy `noindex` podmieniane po stronie klienta dają sprzeczne sygnały. Drugie to status przy streamingu: gdy odpowiedź zaczęła się strumieniować, status 200 jest już wysłany. W Next.js `notFound()` wywołane w trakcie streamingu nie zmieni go na 404, tylko doda `noindex`.

Przy paginacji każda strona listy dostaje własny URL (`?page=2`) i link `<a href>` do następnej. Każda ma własny canonical, nie wskazujący na stronę 1. Google nie używa już `rel="next"`/`rel="prev"`. Infinite scroll i "Załaduj więcej" wystarczą ludziom, a botowi trzeba dać zwykłe linki do kolejnych stron.

Core Web Vitals są używane przez systemy rankingowe, ale ważniejsza jest trafność treści. Dobre wyniki nie gwarantują wysokiej pozycji, a Google wprost pisze, że dążenie do idealnego wyniku tylko dla SEO może nie być najlepszym użyciem czasu.

## Kod

```tsx title="Źle"
// Not a crawlable link, and the product list exists only after a click
<span onClick={() => navigate('/oferty/grecja')}>Grecja</span>
<button onClick={loadMore}>Pokaż więcej</button>
```

```tsx title="Dobrze"
// Real href for crawlers, client-side navigation for users
<Link href="/oferty/grecja">Grecja</Link>
<a href={`/oferty?page=${page + 1}`} onClick={loadMoreInPlace}>
  Pokaż więcej
</a>
// loadMoreInPlace calls event.preventDefault() and appends the next page
```

## Częste błędy

- Sprawdzanie SEO przez "Pokaż źródło" albo `curl` i wniosek "Google nic nie widzi". Liczy się wyrenderowany HTML z narzędzia Sprawdzanie adresu URL.
- Blokowanie w `robots.txt` katalogu z bundlami JS lub API, z którego strona pobiera treść. Google nie wyrenderuje treści z zablokowanych plików.
- Bundle bez hasha w nazwie. Google cache'uje zasoby agresywnie i może ignorować nagłówki cache, więc wyrenderuje stronę starym JS.
- Wywoływanie `notFound()` albo `redirect()` wewnątrz `<Suspense>` i oczekiwanie prawdziwego 404 lub 301.

## Pytania

### Jak Google indeksuje stronę zbudowaną w React bez SSR? {#seo-rendering-spa-q1}

Googlebot pobiera HTML, w którym jest tylko pusty kontener i skrypty. Strona trafia do kolejki renderowania, gdzie headless Chromium wykonuje JS. Dopiero z wyrenderowanego HTML Google bierze treść do indeksu i linki do dalszego crawla. Działa to, ale z opóźnieniem i z ryzykiem: błąd JS, zablokowany zasób albo wolne API dają pustą stronę. Część botów, np. te generujące podglądy linków, JS w ogóle nie wykonuje. Dlatego dla stron publicznych lepszy jest SSR lub SSG.

### Sklep jest SPA i nie pojawia się w Google. Jak to zdiagnozujesz? {#seo-rendering-spa-q2}

Zaczynam od Search Console i narzędzia Sprawdzanie adresu URL. Sprawdzam, czy URL jest zaindeksowany i jaki canonical wybrał Google. Potem robię test na żywo: oglądam wyrenderowany HTML, zrzut ekranu, błędy z konsoli JS i zasoby, których nie udało się pobrać. Dalej sprawdzam `robots.txt` (czy nie blokuje JS lub API), linki (czy to `<a href>`, a nie `onClick`), routing (History API, nie `#`) i kody HTTP dla nieistniejących produktów. Na koniec raport stron w Search Console pokaże, czy problem dotyczy jednej strony, czy całego szablonu.

### Czym jest parity między HTML z serwera a DOM po hydracji i dlaczego ma znaczenie dla SEO? {#seo-rendering-spa-q3}

To zgodność sygnałów w obu wersjach strony. Google może podjąć decyzję na podstawie pierwszego HTML, zanim wykona JS. Na przykład gdy widzi `noindex`, może pominąć renderowanie. Jeśli serwer wysyła jeden canonical, a klient po hydracji wstawia inny, dostajesz sprzeczne sygnały i Google wybierze sam. Zasada: `<title>`, meta robots, canonical, hreflang i główna treść mają być poprawne już w HTML z serwera, a JS ich nie nadpisuje.

### Jak zrobić infinite scroll przyjazny dla SEO? {#seo-rendering-spa-q4}

Każda porcja wyników ma odpowiednik w postaci strony z własnym URL-em, np. `?page=3`, dostępnej także przy wejściu bezpośrednim. Z każdej strony prowadzi `<a href>` do następnej, a JS przechwytuje kliknięcie lub scroll i dokleja wyniki na miejscu. Przy przewijaniu można aktualizować adres przez `history.pushState`. Każda strona ma własny canonical, nie wskazujący na stronę 1. Nie używaj fragmentów `#page=3`, bo Google je ignoruje.

## Quiz

### Który link Google najpewniej odkryje i przejdzie? {#seo-rendering-spa-z1}

- [ ] `<span onClick={() => navigate('/oferty')}>`
- [ ] `<a href="javascript:goTo('oferty')">`
- [x] `<a href="/oferty">` z dodatkowym `onClick`
- [ ] `<a routerLink="/oferty">` bez `href`

Google niezawodnie wyciąga adresy tylko z elementów `<a>` z atrybutem `href` wskazującym prawdziwy URL; dodatkowy `onClick` mu nie przeszkadza.

### W Next.js `notFound()` wywołano wewnątrz `<Suspense>`, gdy streaming już ruszył. Co dostanie crawler? {#seo-rendering-spa-z2}

- [ ] Status 404, bo Next.js podmienia nagłówki
- [x] Status 200 i `<meta name="robots" content="noindex">` w HTML
- [ ] Status 500
- [ ] Przekierowanie 301 na stronę główną

Status jest wysyłany z pierwszym fragmentem odpowiedzi, więc Next.js może już tylko dopisać `noindex` do strumieniowanego HTML.
