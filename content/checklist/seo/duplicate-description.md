---
title: Bez zduplikowanych meta description
priority: medium
---

Ten sam lub prawie ten sam opis na wielu stronach nie pomaga ani użytkownikom, ani wyszukiwarkom. Lepiej brak opisu (Google zbuduje fragment z treści) niż kopia.

## Dlaczego to ważne

- Google wprost zaznacza, że identyczne lub podobne opisy na wszystkich stronach nie są pomocne, gdy kilka z nich pojawia się w wynikach.
- Duplikaty zwykle pochodzą z domyślnego opisu w layoucie, który "przecieka" na tysiące podstron ofert.
- Gdy brakuje danych do unikalnego opisu, pominięcie tagu pozwala Google dobrać fragment pasujący do konkretnego zapytania.

## Jak sprawdzić

Raport duplikatów meta description w crawlerze; sprawdź, czy opis strony głównej nie trafia na podstrony.

## Kod

```tsx title="Źle: app/layout.tsx"
// Every page without its own description inherits this one
export const metadata = {
  description: 'Example Travel: najlepsze wakacje w super cenach!',
};
```

```tsx title="Dobrze: app/oferty/[id]/page.tsx"
// Root layout has no default description; the home page sets its own in app/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const offer = await getOffer(id);
  // No editor-written summary: omit description and let Google build the snippet
  if (!offer.summary) return { title: offer.title };
  return { title: offer.title, description: offer.summary };
}
```

## Częste błędy

- Opis zbudowany z szablonu, w którym zmienia się tylko jedno słowo ("Hotel X na Krecie: najlepsze ceny").
