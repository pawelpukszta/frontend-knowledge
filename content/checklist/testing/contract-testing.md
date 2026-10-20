---
title: Testy kontraktowe API
priority: medium
sources:
  - title: "Pact JS: Consumer tests"
    url: https://docs.pact.io/implementation_guides/javascript/docs/consumer
---

Kontrakty konsumenckie (Pact) lub wspólny schemat OpenAPI z generowanymi typami wykrywają niezgodność frontu i backendu przed wdrożeniem, a nie na produkcji.

## Dlaczego to ważne

- Zmiana nazwy pola `price` na `totalPrice` przechodzi testy backendu i testy frontu z mockami, a psuje stronę u użytkowników; kontrakt wyłapuje to w CI.
- Front i backend mogą wdrażać się niezależnie: `can-i-deploy` w Pact Broker sprawdza, czy konkretne wersje obu stron są zgodne.
- Mocki (np. handlery MSW) budowane z tego samego kontraktu przestają rozjeżdżać się z rzeczywistym API.

## Jak sprawdzić

Testy konsumenta publikują kontrakt do brokera, a pipeline dostawcy go weryfikuje; przy OpenAPI: generowanie typów (`npx openapi-typescript`) w CI i `tsc --noEmit` bez błędów.

## Kod

```ts title="src/api/offers.pact.test.ts"
import path from 'node:path';
import { expect, test } from 'vitest';
import { Pact, MatchersV3, SpecificationVersion } from '@pact-foundation/pact';
import { fetchOffer } from './offers-client';

const { like, decimal, string } = MatchersV3;
const provider = new Pact({
  consumer: 'travel-web',
  provider: 'offers-api',
  dir: path.resolve(process.cwd(), 'pacts'),
  spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
});

test('fetches a single offer', async () => {
  await provider
    .addInteraction()
    .given('offer 123 exists')
    .uponReceiving('a request for offer 123')
    .withRequest('GET', '/api/offers/123')
    .willRespondWith(200, (builder) => {
      builder.jsonBody({ id: string('123'), title: like('Hotel Lindos'), price: decimal(3499.99) });
    })
    .executeTest(async (mockServer) => {
      const offer = await fetchOffer('123', { baseUrl: mockServer.url });
      expect(offer.price).toBe(3499.99);
    });
});
```

## Częste błędy

- Kontrakt opisujący całą odpowiedź API zamiast pól, których front faktycznie używa; każda zmiana po stronie backendu niepotrzebnie go łamie.
