---
title: Bezpieczeństwo zależności (supply chain)
level: senior
tags:
  - npm audit
  - dependencies
  - supply chain
  - Dependabot
summary: Każda paczka npm to kod, który uruchamiasz u siebie i u użytkowników. Ataki na łańcuch dostaw (przejęte konta, złośliwe wersje, typosquatting) są realnym zagrożeniem.
sources:
  - title: "npm Docs: npm audit"
    url: https://docs.npmjs.com/cli/v11/commands/npm-audit
  - title: "OWASP: NPM Security Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html
  - title: "MDN: Subresource Integrity"
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
---

## Wyjaśnienie

- Commituj lockfile i instaluj w CI deterministycznie (`npm ci`).
- Automatyczne aktualizacje z review: Dependabot, Renovate. `npm audit` / `pnpm audit` w CI.
- Ogranicz skrypty instalacyjne (`ignore-scripts`, w pnpm domyślnie trzeba je jawnie dopuścić), zwłaszcza w CI.
- Sprawdzaj nowe zależności: popularność, utrzymanie, rozmiar, liczbę zależności przechodnich. Czy naprawdę potrzebujesz paczki do 10 linii kodu?
- Opóźnij przyjmowanie świeżo opublikowanych wersji (np. ustawienia minimalnego wieku wydania w menedżerze pakietów lub Renovate), bo złośliwe wersje są zwykle szybko wykrywane.
- Skrypty third-party na stronie: Subresource Integrity (`integrity`) dla plików z CDN, CSP.

## Pytania

### Jak ograniczasz ryzyko związane z zależnościami npm? {#sec-supply-chain-q1}

Lockfile i `npm ci`, automatyczne aktualizacje z review (Renovate/Dependabot), audyt w CI, ograniczenie skryptów instalacyjnych, weryfikacja nowych paczek przed dodaniem, minimalizacja liczby zależności, SRI i CSP dla skryptów zewnętrznych.
