---
title: Pomoc zawsze w tym samym miejscu
priority: medium
---

Czat, telefon, FAQ czy formularz kontaktowy, powtarzane na wielu stronach, występują w tej samej kolejności względem innych elementów. WCAG 2.2 SC 3.2.6 (A).

## Dlaczego to ważne

- Osoby z niepełnosprawnościami poznawczymi lub w stresie (np. odrzucona płatność) szukają pomocy tam, gdzie widziały ją wcześniej; przestawiony czat to dla nich brak pomocy.
- Kryterium nie wymaga posiadania pomocy, tylko spójności, jeśli już ją oferujesz; najprościej spełnić je jednym wspólnym komponentem w layoucie.
- Szybko znaleziona infolinia na etapie płatności to szansa na dokończoną rezerwację zamiast porzuconego koszyka.

## Jak sprawdzić

Porównaj kilka stron jednego procesu (lista ofert, szczegóły, dane podróżnych, płatność) przy tej samej szerokości ekranu: mechanizmy pomocy mają tę samą kolejność względem reszty treści.

## Kod

```tsx title="app/rezerwacja/layout.tsx"
// One shared layout keeps help in the same relative order on every booking step
import { HelpLinks } from '@/components/help-links';

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main">{children}</main>
      <footer>
        <HelpLinks phone="+48 22 123 45 67" faqHref="/pomoc" withChat />
      </footer>
    </>
  );
}
```

## Częste błędy

- Czat w prawym dolnym rogu na liście ofert, a w koszyku przeniesiony do nagłówka.
- Ukrycie pomocy na etapie płatności: formalnie dozwolone, ale to właśnie tam użytkownik najczęściej jej potrzebuje.
