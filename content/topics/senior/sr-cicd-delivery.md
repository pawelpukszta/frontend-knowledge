---
title: CI/CD i dostarczanie zmian
level: senior
tags:
  - CI/CD
  - GitHub Actions
  - trunk-based development
  - DORA
  - preview deployments
summary: "Pipeline prowadzi zmianę od merge do produkcji bez ręcznych kroków: najpierw tanie sprawdzenia, potem jeden build i automatyczne wdrożenie. Małe zmiany, krótko żyjące branche i metryki DORA pokazują, czy zespół dostarcza szybko i stabilnie."
sources:
  - title: "DORA: Software delivery performance metrics"
    url: https://dora.dev/guides/dora-metrics/
  - title: "DORA: History of the metrics"
    url: https://dora.dev/guides/dora-metrics/history/
  - title: Trunk Based Development
    url: https://trunkbaseddevelopment.com/
  - title: "GitHub Docs: Workflow syntax for GitHub Actions"
    url: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
  - title: "Playwright: Sharding"
    url: https://playwright.dev/docs/test-sharding
  - title: "Vercel: Environments (preview deployments)"
    url: https://vercel.com/docs/deployments/environments
---

## Wyjaśnienie

**CI (continuous integration)** oznacza, że każdy push i PR przechodzi automatyczne sprawdzenia, a zmiany trafiają do głównej gałęzi często, najlepiej codziennie. **Continuous delivery**: każdy commit na `main` da się wdrożyć jednym ruchem. **Continuous deployment**: wdraża się sam, bez ręcznej decyzji.

Typowe etapy pipeline'u aplikacji front-endowej:

| Etap | Co robi | Uwagi |
|---|---|---|
| install | `pnpm install --frozen-lockfile` | cache pakietów kluczowany hashem lockfile'a |
| lint, typecheck | ESLint, `tsc` | szybkie, równolegle |
| testy jednostkowe | Vitest | równolegle z lintem |
| build | bundle produkcyjny | raz; ten sam artefakt idzie na staging i produkcję |
| e2e | Playwright na zbudowanej aplikacji | najwolniejsze, dzielone na shardy |
| deploy | preview dla PR, produkcja po merge | z identyfikatorem wydania (np. SHA commita) |

**Fail fast.** Tanie sprawdzenia idą pierwsze. Drogie e2e startują dopiero, gdy lint i testy przejdą. Niezależne kroki działają równolegle (matrix), a długi zestaw e2e dzielisz na shardy. Nowy push do tego samego PR anuluje nieaktualny przebieg.

**Preview environment.** Każdy PR dostaje własny URL z wdrożoną wersją. Reviewer, QA i product owner klikają działającą aplikację, a e2e mogą biec na prawdziwym wdrożeniu zamiast na `localhost`.

**Trunk-based development.** Jedna główna gałąź, branche żyjące godziny, najwyżej dzień lub dwa, małe PR-y. Niedokończoną funkcję chowasz za feature flagą, więc `main` zawsze da się wdrożyć. Długie branche kończą się bolesnym merge'em i dużym, ryzykownym wydaniem.

**Metryki DORA** dają zespołowi i managementowi wspólny język. Obecnie dora.dev opisuje pięć metryk w dwóch grupach:

- przepustowość: **change lead time** (od commita do działania na produkcji), **deployment frequency**, **failed deployment recovery time** (ile trwa naprawa wdrożenia, które wymagało pilnej interwencji);
- niestabilność: **change fail rate** (odsetek wdrożeń kończących się rollbackiem lub hotfixem), **deployment rework rate** (odsetek nieplanowanych wdrożeń wywołanych incydentem).

Starsze materiały mówią o "czterech kluczowych metrykach" i MTTR. W 2023 roku MTTR zastąpiono metryką failed deployment recovery time, a rework rate dołączył w 2024. Metryki opisują system dostarczania. Gdy robisz z nich ranking developerów, ludzie zaczynają poprawiać liczby zamiast procesu.

Wolne CI traktuj jak błąd w dostarczaniu. Przy 40-minutowym pipelinie ludzie sklejają zmiany w większe paczki, rzadziej integrują i dłużej czekają na hotfix. Konfiguracja pipeline'u to kod: leży w repo, przechodzi review, ma właściciela, a wersje akcji są przypięte.

## Kod

```yaml title=".github/workflows/ci.yml"
on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  # cancel outdated PR runs, never cancel a run on main
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  checks:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        task: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v5
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run ${{ matrix.task }}

  e2e:
    needs: checks # cheap checks fail first, e2e minutes are not wasted
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v5
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm exec playwright test --shard=${{ matrix.shard }}/4
```

## Częste błędy

- Osobny build dla stagingu i produkcji. Testujesz wtedy inny artefakt niż ten, który dostaje użytkownik.
- Flaky e2e, które wszyscy restartują. Zespół uczy się ignorować czerwony pipeline. Taki test trafia do kwarantanny i jest naprawiany albo usuwany.
- Sekrety produkcyjne dostępne w workflow, który uruchamia się dla PR z forków.
- Cel typu "deployment frequency x2 do końca kwartału". Zespół zaczyna dzielić wdrożenia na sztuczne kawałki, a lead time się nie zmienia.

## Pytania

### Opisz, co dzieje się od merge PR do momentu, gdy zmiana jest u użytkownika. {#sr-cicd-delivery-q1}

Po merge CI uruchamia się na `main`: instalacja z cache, lint, typecheck, testy i jeden build produkcyjny oznaczony SHA commita. Source mapy z tego buildu trafiają prywatnie do narzędzia error trackingu, powiązane z numerem wydania. Pipeline wdraża artefakt na staging albo od razu na produkcję, często stopniowo (canary) lub z funkcją ukrytą za flagą. Pliki statyczne z hashem w nazwie lecą na CDN z długim cache, HTML ma krótki cache. Po wdrożeniu smoke testy sprawdzają główne ścieżki, a monitoring porównuje błędy i Web Vitals nowego wydania ze starym. Użytkownik dostaje nową wersję przy następnym wczytaniu strony; otwarte karty mogą jeszcze chwilę działać na starym bundlu. Jeśli funkcja jest za flagą, właściwe wydanie następuje dopiero po jej włączeniu. Czas całej tej drogi to change lead time.

### Pipeline trwa 30 minut. Jak go skrócisz? {#sr-cicd-delivery-q2}

Najpierw mierzę, które kroki zabierają czas, bo intuicja często się myli. Potem: cache zależności i buildów (w monorepo zdalny cache i uruchamianie zadań tylko dla zmienionych pakietów), równoległe joby zamiast jednego długiego, sharding e2e, kolejność fail fast i anulowanie nieaktualnych przebiegów. Pełną regresję e2e można przenieść na noc, a w PR zostawić smoke testy krytycznych ścieżek. Usuwam też retry maskujące flaky testy, bo każdy retry wydłuża przebieg. Dopiero na końcu większe runnery, bo kosztują.

### Czym jest trunk-based development i jak pogodzić go z niedokończonymi funkcjami? {#sr-cicd-delivery-q3}

Wszyscy integrują się z jedną gałęzią główną, przez krótko żyjące branche i małe PR-y, co najmniej raz dziennie. `main` musi być zawsze gotowe do wdrożenia. Niedokończoną funkcję wdrażasz za feature flagą wyłączoną na produkcji albo przez branch by abstraction (nowa implementacja rośnie obok starej za wspólnym interfejsem). Zysk: mniej konfliktów, szybsze review i mniejsze, łatwiejsze do wycofania wydania.

### Jakie metryki DORA znasz i do czego ich używasz? {#sr-cicd-delivery-q4}

Change lead time, deployment frequency i failed deployment recovery time opisują przepustowość. Change fail rate i deployment rework rate opisują niestabilność. Używam ich jako trendu dla zespołu, żeby znaleźć wąskie gardło: długi lead time zwykle oznacza wolne review albo wolne CI, wysoki change fail rate to słabe testy albo za duże wydania. Nie porównuję nimi osób ani zespołów o różnym kontekście.

## Quiz

### Która metryka DORA mierzy czas od commita do działania zmiany na produkcji? {#sr-cicd-delivery-z1}

- [ ] Deployment frequency
- [x] Change lead time
- [ ] Failed deployment recovery time
- [ ] Change fail rate

Change lead time liczy drogę zmiany od commita do produkcji.

### Dlaczego job e2e ma `needs: checks`? {#sr-cicd-delivery-z2}

- [ ] Bo Playwright nie działa bez wyników ESLint
- [x] Żeby tanie sprawdzenia odrzuciły zmianę, zanim zapłacisz za wolne e2e
- [ ] Bo GitHub Actions nie pozwala uruchamiać jobów równolegle
- [ ] Żeby e2e korzystały z cache zbudowanego przez lint

To zasada fail fast: najpierw szybkie i tanie kroki, drogie dopiero po nich.
