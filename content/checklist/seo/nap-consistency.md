---
title: Spójne dane NAP
priority: medium
---

Nazwa, adres i telefon (Name, Address, Phone) muszą być identyczne na stronie, w danych strukturalnych, w Google Business Profile i w katalogach firm.

## Dlaczego to ważne

- Rozbieżne dane (inny numer w stopce, inny w profilu) osłabiają pewność, że chodzi o tę samą firmę, i mogą obniżać widoczność w wynikach lokalnych i Mapach.
- Klient dzwoniący pod stary numer z katalogu to utracona rezerwacja.
- Jedno źródło danych w kodzie eliminuje rozjazdy między stopką, stroną kontaktu i JSON-LD, np. po przeprowadzce biura.

## Jak sprawdzić

Porównaj dane w stopce, na stronie kontaktu, w JSON-LD, w Google Business Profile i w głównych katalogach (Panorama Firm, Facebook, Apple Maps).

## Kod

```tsx title="Jedno źródło danych NAP"
// lib/business.ts: single source of truth, used by the footer, contact page and JSON-LD
export const business = {
  name: 'Example Travel Warszawa Centrum',
  street: 'ul. Marszałkowska 100',
  postalCode: '00-026',
  city: 'Warszawa',
  phone: '+48 22 123 45 67',
} as const;

// components/FooterNap.tsx
import { business as b } from '@/lib/business';

export function FooterNap() {
  return (
    <address>
      {b.name}<br />{b.street}, {b.postalCode} {b.city}<br />
      <a href={`tel:${b.phone.replace(/\s/g, '')}`}>{b.phone}</a>
    </address>
  );
}
```

## Częste błędy

- Poprawienie adresu na stronie po przeprowadzce i zapomnienie o Google Business Profile oraz katalogach.
- Różne warianty nazwy firmy (z formą prawną i bez, stara marka) w różnych miejscach.
