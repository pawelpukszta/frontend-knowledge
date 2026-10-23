---
title: Strategie wydań, feature flagi i rollback
level: senior
added: 2026-10-23
tags:
  - feature flags
  - canary
  - blue-green
  - OpenFeature
  - version skew
  - rollback
summary: "Deploy to wgranie kodu na serwery, release to udostępnienie funkcji użytkownikom. Feature flagi, canary i blue-green rozdzielają te dwa momenty, a zgodność starej i nowej wersji pozwala wycofać zmianę bez przestoju."
sources:
  - title: "Martin Fowler: Feature Toggles"
    url: https://martinfowler.com/articles/feature-toggles.html
  - title: "Martin Fowler: Canary Release"
    url: https://martinfowler.com/bliki/CanaryRelease.html
  - title: "Martin Fowler: Blue Green Deployment"
    url: https://martinfowler.com/bliki/BlueGreenDeployment.html
  - title: "Martin Fowler: Parallel Change"
    url: https://martinfowler.com/bliki/ParallelChange.html
  - title: "OpenFeature: Introduction"
    url: https://openfeature.dev/docs/reference/intro
  - title: "Next.js: Self-hosting (version skew, deploymentId)"
    url: https://nextjs.org/docs/app/guides/self-hosting
---

## Wyjaśnienie

**Deploy** to techniczne wgranie nowej wersji na produkcję. **Release** to moment, w którym użytkownicy dostają nową funkcję. Gdy te dwa momenty są rozdzielone, wdrażasz często i bez stresu, a o udostępnieniu decydujesz osobno, nawet bez nowego deployu.

**Feature flagi** według podziału Martina Fowlera:

| Rodzaj | Do czego | Jak długo żyje |
|---|---|---|
| release | ukrycie niedokończonej funkcji na `main` | dni, tygodnie |
| ops (kill switch) | szybkie wyłączenie kosztownej lub psującej się funkcji | krótko; kilka zostaje na stałe |
| experiment | test A/B, stały podział użytkowników na grupy | do uzyskania istotnego wyniku |
| permission | funkcja dla grupy: beta, premium, pracownicy | miesiące, lata |

Każda flaga to dług: dodatkowy `if`, dodatkowa ścieżka do testowania. Przy tworzeniu flagi release od razu dodaj zadanie jej usunięcia i datę wygaśnięcia. Niektóre zespoły dokładają test, który zaczyna padać po tej dacie. **OpenFeature** to otwarta specyfikacja i SDK z jednym API do odczytu flag. Dostawcę (LaunchDarkly, Unleash, flagd, własny backend) podpinasz jako provider, więc zmiana vendora nie wymaga przepisywania kodu aplikacji.

**Dark launch**: nowy kod działa na produkcji, ale użytkownik nie widzi wyniku. Przykład: nowa wyszukiwarka dostaje kopię zapytań w tle, a ty porównujesz wyniki i obciążenie.

Sposoby wdrażania:

- **Rolling**: instancje podmieniane po kolei. Tanio, ale przez chwilę obie wersje obsługują ruch.
- **Blue-green**: dwa identyczne środowiska; router przełącza cały ruch na nowe. Rollback to przełączenie z powrotem.
- **Canary**: nowa wersja najpierw dla małej części ruchu (pracownicy, 1%, jeden region). Gdy metryki są dobre, udział rośnie. Gdy rosną błędy, ruch wraca do starej wersji.

Rollback planujesz przed wdrożeniem: wiesz, kto podejmuje decyzję, jakim przyciskiem lub komendą i ile to trwa. Pamiętaj, że zmiana danych lub schematu bazy może uniemożliwić prosty powrót.

**Zgodność wersji.** Przy każdym z tych sposobów przez jakiś czas działają obie wersje. Niekompatybilną zmianę API robisz metodą expand-contract: dodaj nowe pole obok starego, przenieś klientów, a stare usuń dopiero wtedy, gdy nikt go nie używa. Front ma dodatkowy problem: **version skew**. Karta otwarta wczoraj trzyma stary bundle i woła nowy serwer. Next.js przy self-hostingu opisuje skutki: brakujące pliki JS i CSS, nierozpoznane Server Functions, nieudana nawigacja. Z ustawionym `deploymentId` wykrywa niezgodność i robi pełne przeładowanie strony zamiast nawigacji po stronie klienta.

**CDN i cache.** Pliki z hashem w nazwie (`app.3f9a1c.js`) dostają `Cache-Control: public, max-age=31536000, immutable`. HTML ma krótki cache lub `no-cache`, bo to on wskazuje aktualne pliki. Stare hashowane pliki trzymaj na CDN jeszcze jakiś czas po wdrożeniu, żeby otwarte karty mogły dociągnąć swoje chunki.

## Kod

```tsx title="Release flag z OpenFeature (React)"
import { OpenFeature, OpenFeatureProvider, useBooleanFlagValue } from '@openfeature/react-sdk';
import { vendorProvider } from './flags/provider'; // the only vendor-specific file

export function initFlags(user: { id: string; country: string }) {
  OpenFeature.setProvider(vendorProvider);
  return OpenFeature.setContext({ targetingKey: user.id, country: user.country });
}

function Checkout() {
  // default false: if the flag service is down, users get the old, proven path
  const newPayment = useBooleanFlagValue('checkout-new-payment', false);
  return newPayment ? <NewPaymentForm /> : <LegacyPaymentForm />;
}

export function App() {
  return (
    <OpenFeatureProvider>
      <Checkout />
    </OpenFeatureProvider>
  );
}
```

```ts title="next.config.ts"
import type { NextConfig } from 'next';

const config: NextConfig = {
  // same id on every instance of one deployment; a mismatch triggers a full reload
  deploymentId: process.env.DEPLOYMENT_VERSION,
};

export default config;
```

## Częste błędy

- Flagi, które nigdy nie znikają. Po roku nikt nie wie, które kombinacje są testowane i co się stanie po przełączeniu.
- Wartość domyślna flagi włączająca nową funkcję. Awaria serwisu flag wypuszcza wtedy niegotowy kod do wszystkich.
- Usunięcie starego pola API w tym samym wydaniu, w którym front przestaje go używać. Otwarte karty i canary nadal na nim polegają.
- Canary bez metryk podzielonych na wersje. Nie widzisz, czy błędy pochodzą z nowej wersji, więc nie wiesz, czy kontynuować.

## Pytania

### Czym różni się deploy od release? {#sr-release-strategies-q1}

Deploy to wgranie nowej wersji kodu na produkcję. Release to udostępnienie funkcji użytkownikom. Rozdzielasz je feature flagami albo stopniowym rolloutem: kod może leżeć na produkcji wyłączony tygodniami i zostać włączony dla 5% użytkowników bez nowego deployu. Dzięki temu deploy staje się rutyną, a decyzja biznesowa o premierze nie blokuje integracji kodu.

### Czym jest canary deploy i kiedy jest wart dodatkowej złożoności? {#sr-release-strategies-q2}

Nowa wersja trafia najpierw do małej części ruchu, np. pracowników albo 1% użytkowników. Porównujesz jej błędy, opóźnienia i metryki biznesowe ze starą wersją, a potem zwiększasz udział albo wycofujesz ruch. Koszt: routing ruchu, dwie wersje działające naraz, metryki z podziałem na wersje i zgodność API oraz bazy dla obu wersji. Opłaca się przy dużym ruchu i wysokim koszcie awarii, np. w checkout sklepu, bo błąd uderza w mały procent ludzi. Przy małym ruchu canary nie zbierze w rozsądnym czasie danych dających wiarygodne porównanie; wtedy wystarczą flagi i szybki rollback.

### Jak wprowadzić niekompatybilną zmianę API bez przestoju? {#sr-release-strategies-q3}

Expand-contract w trzech krokach. Najpierw backend dodaje nowy kształt obok starego i obsługuje oba. Potem front przechodzi na nowy, a ty czekasz, aż stare bundle znikną z otwartych kart i cache. Na końcu usuwasz stary kształt. Każdy krok to osobne, odwracalne wdrożenie. Przy Next.js dochodzi ochrona przed version skew przez `deploymentId`.

```ts
// expand: accept both shapes until every client sends the new one
const amount = body.amount ?? { value: body.price, currency: 'PLN' };
```

### Jak zarządzać długiem po feature flagach? {#sr-release-strategies-q4}

Każda flaga ma właściciela, typ i datę wygaśnięcia zapisaną przy tworzeniu. Po pełnym rollout usuwasz flagę i martwą gałąź kodu w osobnym, małym PR. Pomaga limit liczby aktywnych flag, raport flag starszych niż X tygodni i test, który pada po dacie wygaśnięcia. Flagi permission i kill switche są długowieczne z założenia, więc traktujesz je jak konfigurację.

## Quiz

### Jaki rodzaj flagi pozwala szybko wyłączyć funkcję, która przeciąża backend? {#sr-release-strategies-z1}

- [ ] Experiment flag
- [x] Ops flag (kill switch)
- [ ] Permission flag
- [ ] Release flag

Flagi ops służą operatorom do szybkiego wyłączenia lub degradacji funkcji na produkcji.

### Dlaczego po wdrożeniu warto zostawić na CDN stare pliki JS z hashem w nazwie? {#sr-release-strategies-z2}

- [ ] Bo przeglądarki nie respektują `immutable`
- [ ] Żeby Lighthouse nie zgłaszał błędów 404
- [x] Bo otwarte karty ze starym bundlem mogą jeszcze dociągać swoje chunki
- [ ] Bo nowy build korzysta ze starych plików

Bez nich lazy-loaded chunk w starej karcie kończy się błędem 404 i zepsutą nawigacją.
