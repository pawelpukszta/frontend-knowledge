---
title: "Widoczność w asystentach AI: crawlery, robots.txt i llms.txt"
level: senior
added: 2026-10-23
tags:
  - SEO
  - AI
  - robots.txt
  - llms.txt
  - GEO
summary: "Asystenci AI korzystają z dwóch rodzajów botów: do trenowania modeli i do wyszukiwania odpowiedzi na bieżąco. Każdy ma własny token w `robots.txt`. Żeby być cytowanym, potrzebujesz tego samego co w klasycznym SEO: dostępnej dla botów, renderowanej na serwerze, dobrze opisanej treści."
sources:
  - title: "Google Search Central: AI features and your website"
    url: https://developers.google.com/search/docs/appearance/ai-features
  - title: "Google: Common crawlers (Google-Extended)"
    url: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
  - title: "OpenAI: Overview of OpenAI crawlers"
    url: https://developers.openai.com/api/docs/bots
  - title: "Anthropic: Does Anthropic crawl data from the web, and how can site owners block the crawler?"
    url: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
  - title: "Perplexity: Perplexity crawlers"
    url: https://docs.perplexity.ai/guides/bots
  - title: "llms.txt proposal"
    url: https://llmstxt.org/
---

## Wyjaśnienie

Asystenci (ChatGPT, Claude, Perplexity, AI Overviews i AI Mode w Google) odpowiadają na pytanie sami, a link do źródła jest przypisem. Optymalizację pod takie odpowiedzi nazywa się GEO (Generative Engine Optimization) albo AEO (Answer Engine Optimization). Technicznie opiera się na tych samych fundamentach co SEO.

Dostawcy AI używają dwóch rodzajów botów. **Boty treningowe** zbierają treść, która może posłużyć do trenowania modeli. **Boty wyszukiwania i pobierania** budują indeks albo pobierają stronę w chwili, gdy użytkownik zadaje pytanie. Blokada bota treningowego nie zabiera strony z odpowiedzi asystenta, a blokada bota wyszukiwania może ją z nich usunąć.

| Dostawca | Trening | Wyszukiwanie / indeks | Pobieranie na żądanie użytkownika |
|---|---|---|---|
| Google | `Google-Extended` (token kontrolny) | `Googlebot` | - |
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | - (PerplexityBot nie służy do treningu) | `PerplexityBot` | `Perplexity-User` |

Kilka szczegółów z dokumentacji dostawców:

- `Google-Extended` nie ma własnego user agenta. To token w `robots.txt`, który decyduje, czy treść pobrana przez Google może służyć do trenowania i groundingu Gemini. Nie wpływa na obecność w wyszukiwarce ani na ranking. AI Overviews i AI Mode korzystają ze zwykłego indeksu Google, więc steruje nimi `Googlebot` oraz `nosnippet`, `data-nosnippet`, `max-snippet` i `noindex`.
- Ustawienia botów OpenAI są niezależne: można wpuścić `OAI-SearchBot` i zablokować `GPTBot`.
- Boty pobierające na żądanie (`ChatGPT-User`, `Perplexity-User`) mogą nie stosować się do `robots.txt`, bo działają w imieniu konkretnego użytkownika.
- Anthropic zaznacza, że blokowanie adresów IP nie jest pewną metodą rezygnacji, bo bot nie odczyta wtedy `robots.txt`.

Plik **llms.txt** to propozycja społeczności (autor: Jeremy Howard, 2024): plik Markdown pod `/llms.txt` z nazwą serwisu, krótkim opisem i listami linków do najważniejszych treści, opcjonalnie z wersjami `.md` stron. To nie jest standard. Google pisze wprost, że do pojawienia się w funkcjach AI nie trzeba tworzyć plików tekstowych dla AI, specjalnego markupu ani nowych danych strukturalnych. Plik może pomóc agentom korzystającym z dokumentacji, ale nie zastąpi dostępnej treści.

Cytowanie ułatwiają:

- Treść w HTML z serwera. Nie każdy bot wykonuje JavaScript.
- Semantyczny HTML: nagłówki odpowiadające pytaniom, listy, tabele, `<article>`, `<time>`.
- Fragmenty, które same odpowiadają na pytanie: definicja w pierwszym zdaniu sekcji, konkretne liczby z jednostkami, bez "jak wspomniano wyżej".
- Stabilne URL-e i canonical, żeby cytat prowadził do właściwej strony.
- Dane strukturalne zgodne z widoczną treścią: nie są wymagane, ale porządkują fakty (cena, autor, data).

W Google ruch z AI Overviews i AI Mode wlicza się do raportu Skuteczność w Search Console (typ wyszukiwania "Internet", ang. Web), bez osobnego podziału. Ruch z innych asystentów widać w analityce po domenie referera i parametrach UTM, a aktywność botów w logach serwera po user agencie. User agenta łatwo podrobić, więc przed blokadami w WAF weryfikuj boty metodą opisaną przez dostawcę.

Podstawy są wspólne z klasycznym SEO: strona musi być crawlowalna, zaindeksowana i kwalifikować się do snippetu. Działają te same zasady: kody HTTP, canonical, linkowanie wewnętrzne, szybkość, treść pisana dla ludzi.

## Kod

```txt title="robots.txt: bez trenowania, z wyszukiwaniem"
# Opt out of model training
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
Disallow: /

# Stay visible in AI search and answers.
# A bot follows only its most specific group, so repeat rules from "*"
User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
Disallow: /koszyk/

# Everyone else, including Googlebot
User-agent: *
Disallow: /koszyk/
Sitemap: https://example.pl/sitemap.xml
```

```md title="llms.txt (propozycja, nie standard)"
# Biuro Podróży Example

> Wycieczki objazdowe i wczasy w Europie. Ceny w PLN, wyloty z 8 polskich lotnisk.

## Informacje dla klientów

- [Warunki rezerwacji](https://example.pl/warunki.md): zaliczka, terminy płatności, rezygnacja
- [Ubezpieczenia](https://example.pl/ubezpieczenia.md): co obejmuje pakiet podstawowy

## Optional

- [Blog](https://example.pl/blog.md): poradniki i relacje z podróży
```

## Częste błędy

- Blokowanie wszystkich botów AI jednym wpisem "dla bezpieczeństwa" i zdziwienie, że strona znika z odpowiedzi asystentów. Najpierw decyzja biznesowa: trening, wyszukiwanie, oba czy żadne.
- Przekonanie, że `Disallow` dla `Google-Extended` usuwa stronę z AI Overviews. Tym sterują `Googlebot` i dyrektywy snippetów.
- Traktowanie `llms.txt` jako czynnika rankingu albo wymogu Google.
- Treść ładowana wyłącznie po stronie klienta, za interakcją albo w obrazkach.

## Pytania

### Czym różni się bot treningowy od bota wyszukiwania AI i jak sterować nimi w robots.txt? {#seo-ai-discoverability-q1}

Bot treningowy zbiera treść, która może trafić do danych treningowych modelu, np. `GPTBot` czy `ClaudeBot`. Bot wyszukiwania buduje indeks, z którego asystent bierze źródła i linki do odpowiedzi, np. `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`. Każdy ma własny token, więc w `robots.txt` możesz zablokować trening i zostawić wyszukiwanie. Osobną grupą są fetchery uruchamiane przez użytkownika (`ChatGPT-User`, `Perplexity-User`), które mogą nie respektować `robots.txt`. U Google trening i grounding Gemini kontroluje token `Google-Extended`, a funkcje AI w wyszukiwarce zwykły `Googlebot`.

### Czy warto dodać llms.txt? {#seo-ai-discoverability-q2}

To tania zmiana, ale trzeba znać jej status. `llms.txt` to propozycja społeczności, nie standard, i nie ma gwarancji, że dany asystent go czyta. Google mówi, że do pojawienia się w AI Overviews i AI Mode nie są potrzebne żadne pliki dla AI. Sensowne zastosowanie to dokumentacja techniczna i produkty, z których korzystają agenci programistyczni: plik wskazuje najważniejsze strony w czystym Markdownie. Nie zastąpi dostępnego HTML, sitemapy ani poprawnego indeksowania.

### Jak przygotować treść, żeby asystent AI ją zacytował? {#seo-ai-discoverability-q3}

Najpierw dostępność: wpuszczone boty wyszukiwania, treść w HTML z serwera, poprawne kody HTTP i canonical. Potem struktura: nagłówki, które odpowiadają na konkretne pytania, i akapity zrozumiałe bez kontekstu reszty strony. Konkretne fakty (ceny, daty, parametry) w tekście, a nie tylko w obrazkach czy widgetach JS. Dane strukturalne zgodne z widoczną treścią porządkują te fakty. Nie ma specjalnych trików: Google podkreśla, że obowiązują te same zasady co w zwykłym wyszukiwaniu.

### Jak zmierzysz, czy asystenci AI przyprowadzają ruch? {#seo-ai-discoverability-q4}

W Google ruch z AI Overviews i AI Mode jest wliczony w raport skuteczności w Search Console razem ze zwykłym wyszukiwaniem w sieci (typ "Web"), bez osobnego filtra. Dla innych asystentów segmentuję sesje w analityce po domenie referera (np. `chatgpt.com`, `perplexity.ai`) i parametrach UTM. W logach serwera sprawdzam, czy boty wyszukiwania pobierają kluczowe strony i jakie kody dostają.

## Quiz

### Firma blokuje `Google-Extended` w robots.txt. Co się stanie z widocznością w Google? {#seo-ai-discoverability-z1}

- [ ] Strona zniknie z wyników wyszukiwania
- [ ] Strona zniknie z AI Overviews, ale zostanie w zwykłych wynikach
- [x] Wyniki i ranking się nie zmienią; treść nie posłuży do trenowania i groundingu Gemini
- [ ] Googlebot przestanie renderować JavaScript na stronie

`Google-Extended` to token kontrolny dla Gemini; Google zapewnia, że nie wpływa na obecność w wyszukiwarce ani na ranking.

### Chcesz, żeby treść nie trafiała do treningu modeli OpenAI, ale strona była widoczna w wyszukiwaniu ChatGPT. Co blokujesz? {#seo-ai-discoverability-z2}

- [x] Tylko `GPTBot`
- [ ] Tylko `OAI-SearchBot`
- [ ] `GPTBot` i `OAI-SearchBot`
- [ ] `ChatGPT-User`

`GPTBot` zbiera treść do treningu, a `OAI-SearchBot` do wyszukiwania; OpenAI traktuje te ustawienia niezależnie.
