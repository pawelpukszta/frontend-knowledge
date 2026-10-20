---
title: Unikalne tytuły stron
priority: high
---

Każda strona ma inny `<title>`, opisujący jej własną treść. Dotyczy to także stron paginacji, wariantów filtrów i podstron ofert.

## Dlaczego to ważne

- Przy identycznych tytułach Google trudniej wybrać właściwą stronę, a użytkownik w wynikach nie odróżni dwóch linków o tej samej nazwie.
- Duplikaty często zdradzają głębszy problem: zduplikowane strony bez canonical albo szablon, który nie dostaje danych z API.
- Google może sam przepisać powtarzające się tytuły; tracisz wtedy kontrolę nad tekstem w wynikach.

## Jak sprawdzić

Raport duplikatów tytułów w crawlerze; w Search Console sprawdź, czy dla jednego zapytania nie pojawiają się na zmianę dwie strony.

## Kod

```tsx title="app/hotele/[slug]/page.tsx"
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const hotel = await getHotel(slug);
  const base = `${hotel.name}, ${hotel.city}: opinie i ceny`;
  // Paginated reviews get a distinct title instead of copying page 1
  return { title: page === '1' ? base : `${base}, strona ${page}` };
}
```

## Częste błędy

- Sam tytuł marki na stronach generowanych dynamicznie, gdy z API nie przyszły dane.
