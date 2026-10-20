---
title: Mechanizm usunięcia danych
priority: medium
---

Użytkownik może łatwo zażądać usunięcia konta i danych (art. 17 RODO), np. przyciskiem w ustawieniach konta, a dane są faktycznie usuwane lub anonimizowane także w systemach powiązanych.

## Dlaczego to ważne

- Na żądanie trzeba odpowiedzieć bez zbędnej zwłoki, najpóźniej w ciągu miesiąca (art. 12 ust. 3 RODO); ręczna obsługa maili nie skaluje się i łatwo o przeoczenie.
- Prawo do usunięcia nie jest absolutne: faktury i dane rozliczeniowe trzeba przechowywać przez okres wymagany przepisami podatkowymi, więc usuwasz resztę, a te dane ograniczasz do celu archiwalnego.
- Usunięcie musi objąć kopie: listę newslettera, CRM, narzędzia analityczne i dostawców, którym przekazano dane.

## Jak sprawdzić

Przejdź ścieżkę usunięcia konta jako użytkownik, a potem sprawdź bazę, listę mailingową i CRM; ścieżka nie powinna wymagać telefonu na infolinię.

## Kod

```ts title="app/api/account/route.ts"
import { NextResponse } from 'next/server';
import { auth, hasRecentLogin } from '@/lib/auth';
import { db } from '@/lib/db';
import { newsletter, crm } from '@/lib/integrations';

export async function DELETE() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Require a recent login so a stolen session cannot wipe the account
  if (!hasRecentLogin(session)) {
    return NextResponse.json({ error: 'Reauthentication required' }, { status: 403 });
  }
  const userId = session.user.id;
  await db.$transaction([
    // Invoices stay in the billing system; bookings lose the link to the person
    db.booking.updateMany({ where: { userId }, data: { userId: null, guestName: null, guestEmail: null } }),
    db.user.delete({ where: { id: userId } }),
  ]);
  await Promise.all([newsletter.unsubscribe(userId), crm.erase(userId)]);
  return new NextResponse(null, { status: 204 });
}
```

## Częste błędy

- "Usunięcie" konta, które tylko ustawia flagę `isActive = false`, a dane zostają na zawsze.
- Zapomnienie o kopiach zapasowych i eksportach; trzeba mieć opisaną zasadę ich wygasania.
