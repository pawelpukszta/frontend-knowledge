---
title: Audyt zależności
priority: high
---

Regularne skanowanie podatności (`npm audit`, Dependabot, Renovate, Snyk) w CI, lockfile i instalacja przez `npm ci`, szybkie aktualizacje pakietów z krytycznymi lukami.

## Dlaczego to ważne

- Typowa aplikacja React ma setki zależności pośrednich; podatność w jednej z nich (np. w parserze lub bibliotece do uploadu) jest podatnością Twojej aplikacji (OWASP Top 10: Vulnerable and Outdated Components).
- Ataki na łańcuch dostaw są realne: we wrześniu 2025 przejęto konta opiekunów popularnych pakietów npm (m.in. `chalk` i `debug`) i opublikowano złośliwe wersje.
- Małe, regularne aktualizacje są tanie; nadrabianie dwóch lat zaległości to projekt na tygodnie i ryzykowne wdrożenie.

## Jak sprawdzić

Krok audytu w CI, alerty Dependabot w repozytorium; `npm audit signatures` sprawdza podpisy i atestacje pobranych pakietów.

## Kod

```yaml title="Krok w CI (GitHub Actions)"
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 24
  - run: npm ci                       # exact versions from package-lock.json
  - run: npm audit --omit=dev --audit-level=high
  - run: npm audit signatures         # verify registry signatures
```

```yaml title=".github/dependabot.yml"
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      minor-and-patch:
        update-types: ["minor", "patch"]
```

## Częste błędy

- Wyłączanie audytu w CI, bo "ciągle coś czerwone", zamiast ustalić próg i triage.
- `npm install` w CI zamiast `npm ci`, przez co build może pobrać inne wersje niż przetestowane.
