---
title: "Testy E2E w Playwright i niestabilne testy"
level: senior
added: 2026-10-23
tags:
  - Playwright
  - e2e
  - flaky tests
  - CI
  - sharding
summary: "E2E w Playwright pokrywają kilka krytycznych ścieżek w prawdziwej przeglądarce, resztę zostawiasz testom integracyjnym. Niestabilny test traktujesz jak błąd: odtwarzasz go powtórzeniami, szukasz źródła niedeterminizmu i naprawiasz przyczynę zamiast dokładać retry."
sources:
  - title: "Playwright: Best Practices"
    url: https://playwright.dev/docs/best-practices
  - title: "Playwright: Auto-waiting (actionability)"
    url: https://playwright.dev/docs/actionability
  - title: "Playwright: Retries"
    url: https://playwright.dev/docs/test-retries
  - title: "Playwright: Sharding"
    url: https://playwright.dev/docs/test-sharding
  - title: "Playwright: Command line"
    url: https://playwright.dev/docs/test-cli
  - title: "Vitest: Improving Performance"
    url: https://vitest.dev/guide/improving-performance
  - title: "Martin Fowler: Eradicating Non-Determinism in Tests"
    url: https://martinfowler.com/articles/nonDeterminism.html
  - title: "Martin Fowler: Test Coverage"
    url: https://martinfowler.com/bliki/TestCoverage.html
  - title: "Next.js: Setting up Vitest"
    url: https://nextjs.org/docs/app/guides/testing/vitest
---

## Wyjaśnienie

Proporcje między warstwami testów opisuje temat o strategii testów. Tu chodzi o praktykę: co konkretnie trafia do E2E i co robić, gdy test raz przechodzi, a raz nie.

W aplikacji React/Next.js testy integracyjne (Vitest + Testing Library + MSW) pokrywają logikę ekranów: stany ładowania i błędów, walidację formularzy, filtry, przypadki brzegowe odpowiedzi API. Są szybkie, więc może ich być dużo. E2E w Playwright uruchamiasz na zbudowanej aplikacji w prawdziwej przeglądarce. Sprawdzają to, czego nie zasymuluje jsdom: routing, SSR i hydratację, cookies i sesję, `proxy.ts`, Server Actions, przekierowania, różnice między Chromium, Firefoksem i WebKitem. Dokumentacja Next.js zaleca E2E także dla asynchronicznych Server Components, bo Vitest ich nie obsługuje. Jeden test E2E to zwykle cała ścieżka biznesowa: logowanie, wyszukiwanie, rezerwacja, płatność.

Niestabilne (flaky) testy mają zwykle jedno z tych źródeł:

- Czas: `new Date()` w kodzie, strefa czasowa runnera CI, oferty "ważne do jutra".
- Losowość: `Math.random()`, losowe dane z fakera bez stałego seeda.
- Sieć: prawdziwe API stagingu, zewnętrzne skrypty, banery cookies.
- Kolejność i współdzielony stan: wspólne konto testowe, dane w bazie po poprzednim teście, `localStorage`, handler MSW, który nie został zresetowany.
- Animacje i przejścia: element jeszcze się przesuwa albo zasłania go overlay.
- Sztywne czekanie: `waitForTimeout(2000)` lub `setTimeout` w teście. Na wolnym CI to za mało, lokalnie za dużo.
- Zasoby: przeciążona maszyna CI przy zbyt wielu workerach.

Część tych problemów Playwright ogranicza sam. Przed `click()` czeka, aż element jest widoczny, stabilny (bez ruchu przez dwie klatki animacji), aktywny i faktycznie odbiera kliknięcie. Asercje web-first, np. `await expect(locator).toBeVisible()`, ponawiają sprawdzenie do timeoutu. `expect(await locator.isVisible()).toBe(true)` sprawdza raz i od razu zwraca wynik.

Triage niestabilnego testu przebiega w czterech krokach:

1. Odtwórz: `npx playwright test offer.spec.ts --repeat-each=50`, więcej workerów (`--workers`), uruchomienie samego testu i całego pliku. W Vitest `--sequence.shuffle` ujawnia zależność od kolejności.
2. Zbierz dowody: trace z retry (`trace: 'on-first-retry'`), zrzuty ekranu, logi sieci. Porównaj przebieg udany z nieudanym.
3. Nazwij źródło niedeterminizmu z listy wyżej i usuń je: stały zegar (`page.clock`, `vi.setSystemTime`), seed, mock zewnętrznej usługi (`page.route`), osobne dane dla każdego testu, asercja web-first zamiast timeoutu.
4. Potwierdź poprawkę tym samym `--repeat-each`.

Retry (`retries: 2` na CI) ukrywają objaw, więc stosuj je z dyscypliną. Playwright oznacza test, który przeszedł dopiero przy powtórce, jako "flaky". Te raporty ktoś musi przeglądać, a `--fail-on-flaky-tests` pozwala zablokować merge. Kwarantanna to przeniesienie testu poza blokujący pipeline (np. tag `@quarantine` i `--grep-invert`). Wymaga właściciela i terminu, inaczej test zostaje tam na zawsze.

Pokrycie kodu (coverage) pokazuje, którego kodu nie wykonał żaden test. Nie mówi, czy asercje coś sprawdzają. Wymuszony próg, np. 100%, zachęca do testów pisanych pod liczbę.

Żeby CI było szybkie, Vitest i Playwright dzielą testy między maszyny flagą `--shard=1/4`, a każdy shard zapisuje raport `blob`. Na końcu łączysz je: `vitest --merge-reports` i `npx playwright merge-reports`. Vitest dzieli pliki, a Playwright z `fullyParallel: true` dzieli pojedyncze testy, więc shardy są bardziej wyrównane. Lokalnie `--only-changed` w Playwright i tryb watch w Vitest skracają pętlę.

## Kod

```ts title="playwright.config.ts"
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'blob' : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    timezoneId: 'Europe/Warsaw',
    locale: 'pl-PL',
    reducedMotion: 'reduce', // fewer animation-related flakes
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'pnpm build && pnpm start', url: 'http://localhost:3000' },
});
```

```ts title="Źle i dobrze"
// Bad: fixed sleep, real clock, manual assertion
await page.getByRole('button', { name: 'Rezerwuj' }).click();
await page.waitForTimeout(3000);
expect(await page.getByText('Potwierdzenie').isVisible()).toBe(true);

// Good: fixed time, web-first assertion that retries until timeout
await page.clock.setFixedTime(new Date('2026-07-01T10:00:00'));
await page.goto('/oferty/rzym');
await page.getByRole('button', { name: 'Rezerwuj' }).click();
await expect(page.getByRole('heading', { name: 'Potwierdzenie' })).toBeVisible();
```

## Częste błędy

- Testowanie w E2E każdego wariantu walidacji formularza. Taki zestaw jest wolny i kruchy, a test integracyjny zrobi to taniej.
- Wspólne konto i dane dla wszystkich testów. Przy równoległym uruchomieniu testy nadpisują sobie stan.
- Podbijanie `retries` lub timeoutów bez szukania przyczyny. Flaky test bywa też prawdziwym race condition w aplikacji.
- Kwarantanna bez właściciela i terminu, przez co niestabilny test po cichu przestaje cokolwiek chronić.

## Pytania

### Co testujesz w E2E, a co w testach integracyjnych w aplikacji Next.js? {#test-e2e-flaky-q1}

W testach integracyjnych (Vitest, Testing Library, MSW) sprawdzam logikę komponentów i stron: stany ładowania i błędów, walidację, filtry, przypadki brzegowe API. Są szybkie, więc pokrywam nimi większość scenariuszy. E2E w Playwright zostawiam dla kilku krytycznych ścieżek biznesowych na zbudowanej aplikacji, np. logowanie i rezerwacja z płatnością. Sprawdzam w nich to, czego jsdom nie pokaże: routing, SSR i hydratację, sesję w cookies, przekierowania w `proxy.ts`, Server Actions, zachowanie w różnych przeglądarkach. Asynchroniczne Server Components też testuję w E2E, bo Vitest ich nie renderuje. Za: wysoka pewność w miejscach, gdzie błąd kosztuje najwięcej. Przeciw: E2E są wolne i wymagają danych testowych oraz środowiska.

### Test E2E przechodzi lokalnie, a na CI pada co piąty raz. Co robisz? {#test-e2e-flaky-q2}

Najpierw odtwarzam problem: uruchamiam test z `--repeat-each=50`, z większą liczbą workerów i razem z resztą pliku. Na CI włączam trace przy retry i porównuję udany przebieg z nieudanym. Potem szukam źródła niedeterminizmu: czas i strefa czasowa, losowe dane, prawdziwa sieć, stan współdzielony z innym testem, animacja, sztywny `waitForTimeout`. Naprawiam przyczynę, np. stałym zegarem przez `page.clock`, osobnym użytkownikiem na test, mockiem zewnętrznego API przez `page.route` albo asercją web-first. Poprawkę potwierdzam tym samym powtarzaniem. Jeśli nie da się jej zrobić od razu, test idzie do kwarantanny z właścicielem i terminem, a nie dostaje kolejnego retry.

### Jak działa auto-waiting w Playwright i czym są asercje web-first? {#test-e2e-flaky-q3}

Przed akcją, np. `click()`, Playwright sprawdza, czy lokator wskazuje dokładnie jeden element i czy ten element jest widoczny, stabilny (nie porusza się), aktywny i faktycznie odbiera zdarzenie, czyli nie zasłania go overlay. Czeka na to do timeoutu akcji. Asercje web-first, np. `await expect(locator).toHaveText('...')`, ponawiają sprawdzenie, aż warunek zostanie spełniony. Dzięki temu nie potrzebuję `waitForTimeout`. Częsty błąd to `expect(await locator.isVisible()).toBe(true)`: `isVisible()` zwraca wynik od razu, bez czekania.

### Jaki próg pokrycia kodu ustawiłbyś w projekcie? {#test-e2e-flaky-q4}

Coverage traktuję jako sygnał, nie cel. Raport pokazuje kod, którego żaden test nie wykonał, i to jest przydatne przy code review. Wysoki procent nie mówi jednak, czy testy mają sensowne asercje. Wymuszony próg, zwłaszcza 100%, kończy się testami pisanymi pod licznik. Wolę pilnować, żeby pokrycie nie spadało w zmienianych plikach, i patrzeć, czy krytyczne ścieżki mają testy zachowania.

## Quiz

### Która asercja w Playwright czeka, aż element się pojawi? {#test-e2e-flaky-z1}

- [ ] `expect(await page.getByText('OK').isVisible()).toBe(true)`
- [x] `await expect(page.getByText('OK')).toBeVisible()`
- [ ] `await page.waitForTimeout(1000)`, potem `isVisible()`
- [ ] `expect(page.getByText('OK')).toBeTruthy()`

Asercje web-first ponawiają sprawdzenie do timeoutu; `isVisible()` zwraca stan z jednej chwili.

### Jak Playwright oznacza test, który nie przeszedł za pierwszym razem, ale przeszedł przy retry? {#test-e2e-flaky-z2}

- [ ] passed
- [x] flaky
- [ ] failed
- [ ] skipped

Taki test trafia do raportu jako "flaky", a `--fail-on-flaky-tests` pozwala oblać na tej podstawie cały przebieg.
