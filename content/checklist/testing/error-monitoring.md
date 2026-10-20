---
title: Monitoring błędów na produkcji
priority: high
sources:
  - title: "Sentry: Manual setup for Next.js"
    url: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
---

Nieobsłużone wyjątki i odrzucone Promise są zbierane, grupowane i alarmowane (Sentry, Datadog), z source mapami, wersją wydania i środowiskiem, bez wysyłania zbędnych danych osobowych.

## Dlaczego to ważne

- Użytkownicy rzadko zgłaszają błędy; po prostu odchodzą, np. do konkurencyjnego biura podróży. Monitoring pokazuje problem, zanim zrobią to recenzje.
- Source mapy zamieniają `a.b is not a function` w zminifikowanym chunku na konkretną linię w `BookingForm.tsx`.
- Wersja wydania (`release`) łączy błąd z konkretnym wdrożeniem, więc od razu widać, który deploy wprowadził błąd i co wycofać.

## Jak sprawdzić

Wywołaj testowy błąd na stagingu (np. przycisk z `throw new Error('Sentry test')`) i sprawdź, czy pojawia się w narzędziu z czytelnym stack trace, wersją i bez danych osobowych.

## Kod

```ts title="instrumentation-client.ts"
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV, // production | staging
  release: process.env.NEXT_PUBLIC_RELEASE,     // e.g. the git commit SHA set in CI
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  beforeSend(event) {
    // Strip e-mail addresses that may leak into error messages
    if (event.message) event.message = event.message.replace(/\S+@\S+/g, '[email]');
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
```

```ts title="next.config.ts"
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';

const nextConfig: NextConfig = {};

export default withSentryConfig(nextConfig, {
  org: 'example-travel',
  project: 'web',
  authToken: process.env.SENTRY_AUTH_TOKEN, // CI secret, uploads source maps during the build
  widenClientFileUpload: true,
  silent: !process.env.CI,
});
```

## Częste błędy

- Publiczne serwowanie source map na produkcji, choć wystarczy wysłać je do narzędzia monitorującego.
- Alerty na każde pojedyncze zdarzenie; zespół szybko zaczyna je ignorować. Lepiej alarmować o nowych problemach i nagłych skokach.
