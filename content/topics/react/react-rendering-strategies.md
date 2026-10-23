---
title: CSR, SSR, SSG, ISR
level: mid
added: 2026-10-20
tags:
  - CSR
  - SSR
  - SSG
  - ISR
  - Next.js
  - SEO
summary: "Strategie różnią się tym, gdzie i kiedy powstaje HTML: w przeglądarce (CSR), na serwerze przy każdym żądaniu (SSR), podczas buildu (SSG) lub podczas buildu z okresowym odświeżaniem (ISR)."
sources:
  - title: "web.dev: Rendering on the Web"
    url: https://web.dev/articles/rendering-on-the-web
  - title: "Next.js: Incremental Static Regeneration"
    url: https://nextjs.org/docs/app/guides/incremental-static-regeneration
  - title: "Next.js: Caching (Cache Components)"
    url: https://nextjs.org/docs/app/getting-started/caching
---

## Wyjaśnienie

| | Gdzie/kiedy HTML | Zalety | Wady | Przykład |
|---|---|---|---|---|
| **CSR** | przeglądarka, po pobraniu JS | prosty hosting, bogata interaktywność | pusty HTML na starcie, słabsze SEO i LCP | panel admina, dashboard za logowaniem |
| **SSR** | serwer, przy każdym żądaniu | aktualne dane, dobre SEO i FCP | koszt serwera, TTFB zależy od danych | wyniki wyszukiwania, personalizacja |
| **SSG** | build | najszybsze (CDN), tanie | dane aktualne tylko na moment buildu | blog, dokumentacja, landing |
| **ISR** | build + regeneracja w tle co X s lub na żądanie | szybkość SSG + świeższe dane | chwilowo nieaktualne dane, złożoność cache | karty ofert, katalog produktów |

W Next.js App Router strategia wynika z konfiguracji cache i danych: strony są statyczne, dopóki nie użyjesz dynamicznych API (cookies, headers, searchParams) lub nie wyłączysz cache. **Streaming SSR** z `Suspense` wysyła HTML w kawałkach: szybkie części od razu, wolne później. **Partial Prerendering / Cache Components** łączą statyczną "skorupę" strony z dynamicznymi fragmentami.

## Pytania

### Czym różni się SSR od SSG? {#react-rendering-strategies-q1}

SSR generuje HTML na serwerze przy każdym żądaniu (aktualne, spersonalizowane dane, wyższy koszt i TTFB). SSG generuje HTML raz, w czasie buildu, i serwuje go z CDN (bardzo szybkie, ale dane z momentu buildu).

### Czym jest ISR? {#react-rendering-strategies-q2}

Incremental Static Regeneration: strona jest statyczna, ale po upływie czasu `revalidate` lub po wywołaniu revalidacji na żądanie Next.js generuje nową wersję w tle. Użytkownicy dostają szybką stronę z CDN i dane odświeżane cyklicznie.

### Którą strategię wybrać dla strony oferty wycieczki? {#react-rendering-strategies-q3}

Najczęściej ISR lub SSG z revalidacją na żądanie: treść oferty zmienia się rzadko, a SEO i LCP są kluczowe. Dynamiczne elementy (cena na dziś, dostępność, koszyk) doładowujesz osobno (streaming lub klient). Za: szybkość i niski koszt. Przeciw: ryzyko chwilowo nieaktualnych danych, które trzeba zweryfikować przy rezerwacji.

## Quiz

### Strona bloga aktualizowana raz dziennie, ważne SEO. Najlepsza strategia: {#react-rendering-strategies-z1}

- [ ] CSR
- [x] SSG lub ISR
- [ ] SSR przy każdym żądaniu
- [ ] Tylko Client Components

Statyczny HTML z CDN z okresową regeneracją daje najlepszą szybkość przy niskim koszcie.
