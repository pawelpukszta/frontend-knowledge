---
title: npm, yarn, pnpm, lockfile i semver
level: mid
added: 2026-10-20
tags:
  - npm
  - pnpm
  - yarn
  - semver
  - lockfile
  - monorepo
summary: Menedżery pakietów instalują zależności według package.json i zapisują dokładne wersje w lockfile. Semver określa, jakie aktualizacje są dozwolone.
sources:
  - title: "npm: About semantic versioning"
    url: https://docs.npmjs.com/about-semantic-versioning
  - title: "pnpm: Motivation"
    url: https://pnpm.io/motivation
  - title: semver.org
    url: https://semver.org/
---

## Wyjaśnienie

- **Semver** `MAJOR.MINOR.PATCH`: major = zmiany łamiące, minor = nowe funkcje kompatybilne wstecz, patch = poprawki.
- `^1.4.2`: pozwala na `1.x.x` (bez zmiany major). `~1.4.2`: pozwala na `1.4.x`. `1.4.2`: dokładnie ta wersja.
- **Lockfile** (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`): dokładne wersje całego drzewa. Commituj go. W CI używaj `npm ci` / `pnpm install --frozen-lockfile`.
- `dependencies` (runtime) vs `devDependencies` (build, testy) vs `peerDependencies` (np. biblioteka komponentów wymaga `react` od aplikacji).
- **pnpm**: globalny magazyn i dowiązania, oszczędza miejsce, ścisła izolacja (brak "phantom dependencies"), świetny dla monorepo (workspaces).
- **npx** / **pnpm dlx**: uruchomienie paczki bez instalacji globalnej.
- Bezpieczeństwo: `npm audit`, Dependabot/Renovate, ostrożność przy skryptach `postinstall`.

## Pytania

### Co oznacza ^ w wersji zależności? {#node-package-managers-q1}

Dozwolone są aktualizacje kompatybilne według semver: minor i patch, bez zmiany wersji major (np. `^2.3.1` pozwala na `2.9.0`, ale nie `3.0.0`). Dla wersji `0.x` zakres jest węższy.

### Po co commitować lockfile? {#node-package-managers-q2}

Gwarantuje identyczne drzewo zależności na każdej maszynie i w CI, więc build jest powtarzalny, a aktualizacje zależności są świadome i widoczne w code review.

### Czym różni się pnpm od npm? {#node-package-managers-q3}

pnpm trzyma pakiety w jednym globalnym magazynie i linkuje je do projektów (szybciej, mniej miejsca) oraz tworzy ścisłe `node_modules`, w którym kod ma dostęp tylko do zadeklarowanych zależności. Ma też dobre wsparcie monorepo.

## Quiz

### Wersja `^2.3.1` pozwala zainstalować: {#node-package-managers-z1}

- [ ] 3.0.0
- [x] 2.9.4
- [ ] 1.9.0
- [ ] Tylko 2.3.1

`^` dopuszcza zmiany minor i patch w obrębie tej samej wersji major.
