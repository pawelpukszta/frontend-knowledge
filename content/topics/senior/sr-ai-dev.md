---
title: AI w pracy front-end developera
level: senior
added: 2026-10-20
tags:
  - AI
  - Copilot
  - Cursor
  - Claude
  - MCP
  - agenty
  - LLM
  - prompt engineering
summary: Asystenci AI przyspieszają pisanie kodu, testów i dokumentacji, ale odpowiedzialność za poprawność, bezpieczeństwo i architekturę zostaje po stronie developera.
sources:
  - title: "Model Context Protocol: Introduction"
    url: https://modelcontextprotocol.io/docs/getting-started/intro
  - title: "Anthropic: Prompt engineering overview"
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
  - title: Vercel AI SDK
    url: https://ai-sdk.dev/docs/introduction
  - title: "OWASP: Top 10 for LLM Applications"
    url: https://genai.owasp.org/llm-top-10/
---

## Wyjaśnienie

**Narzędzia**: GitHub Copilot, Cursor, Windsurf, Claude Code, ChatGPT. Tryby: podpowiedzi w edytorze, czat z kontekstem repo, **agenty** wykonujące wieloetapowe zadania (zmiany w wielu plikach, uruchamianie testów).

**MCP (Model Context Protocol)**: otwarty standard łączenia modeli AI z narzędziami i danymi (repozytorium, Figma, Jira, bazy, przeglądarka). Zamiast osobnej integracji dla każdego narzędzia AI jest jeden protokół: serwer MCP udostępnia narzędzia, a klient (IDE, asystent) z nich korzysta.

**Dobre praktyki**:

- Dawaj kontekst: cel, ograniczenia, konwencje projektu (pliki instrukcji typu `CLAUDE.md`, `.cursor/rules`, `copilot-instructions.md`).
- Małe kroki i weryfikacja: czytaj i rozumiej kod przed commitem, uruchamiaj testy.
- Test-first: niech AI pisze implementację pod testy, które rozumiesz.
- Nie wklejaj sekretów ani danych osobowych; sprawdź politykę firmy.
- Uważaj na zmyślone API i przestarzałe wzorce; weryfikuj w dokumentacji.

**AI w produkcie** (Next.js + LLM): streaming odpowiedzi (Vercel AI SDK), RAG (wyszukiwanie w bazie wiedzy + generowanie), walidacja wyjść modelu (np. Zod), ochrona przed prompt injection, koszty i limity, obsługa błędów i fallbacki.

## Pytania

### Jak używasz AI w codziennej pracy i jak dbasz o jakość? {#sr-ai-dev-q1}

Do boilerplate'u, testów, refaktoryzacji, eksploracji nieznanego kodu i dokumentacji. Daję kontekst (konwencje projektu, pliki instrukcji), pracuję małymi krokami, czytam każdą zmianę i uruchamiam testy oraz lint. Nie przekazuję sekretów. Traktuję wynik jak PR od juniora: przydatny, ale wymaga review.

### Czym jest MCP? {#sr-ai-dev-q2}

Model Context Protocol: otwarty protokół, który standaryzuje sposób, w jaki aplikacje AI łączą się z zewnętrznymi narzędziami i źródłami danych. Serwer MCP wystawia narzędzia i zasoby (np. dostęp do Jiry, bazy, przeglądarki), a klient AI może z nich korzystać bez osobnej integracji dla każdego narzędzia.

### Jakie są ryzyka integracji LLM w aplikacji webowej? {#sr-ai-dev-q3}

Halucynacje (błędne odpowiedzi), prompt injection (dane użytkownika lub dokumenty zmieniające instrukcje modelu), wyciek danych, nieprzewidywalne koszty i opóźnienia, zależność od dostawcy. Mitygacje: walidacja wyjścia, ograniczone uprawnienia narzędzi, RAG z cytowaniem źródeł, limity, monitoring i ludzka weryfikacja przy krytycznych akcjach.

## Quiz

### Czym jest MCP? {#sr-ai-dev-z1}

- [ ] Biblioteką React do czatów
- [x] Otwartym protokołem łączenia modeli AI z narzędziami i danymi
- [ ] Modelem językowym
- [ ] Formatem plików konfiguracyjnych

Model Context Protocol standaryzuje integracje AI z zewnętrznymi systemami.
