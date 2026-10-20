---
title: Sygnały aktualności treści
priority: medium
---

Regularnie aktualizuj treści zależne od czasu (ceny, przepisy, warunki wjazdu, terminy sezonu) i pokazuj datę ostatniej zmiany. Nie zmieniaj samej daty bez realnych zmian w treści.

## Dlaczego to ważne

- Przy zapytaniach o bieżące informacje ("ceny wycieczek 2027", "warunki wjazdu") użytkownicy i wyszukiwarka oczekują świeżych źródeł; nieaktualny tekst traci pozycje i zaufanie.
- Stara cena lub nieaktualny przepis to reklamacje i koszty obsługi; klient powołuje się na to, co przeczytał.
- Sztuczne "odświeżanie" daty bez zmian w treści wprowadza w błąd; według Google `dateModified` ma opisywać faktyczną aktualizację strony.

## Jak sprawdzić

Raport najczęściej odwiedzanych stron z najstarszym `dateModified`; harmonogram przeglądów (np. co kwartał dla YMYL) z przypisanym właścicielem treści.

## Kod

```ts title="dateModified tylko przy istotnej zmianie"
// Typo fixes and whitespace changes keep the old date; real updates bump it
type Revision = { body: string; substantive: boolean }; // editor ticks "substantive change"

const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();

export function nextDateModified(prevDate: string, prevBody: string, rev: Revision): string {
  const changed = normalize(prevBody) !== normalize(rev.body);
  return changed && rev.substantive ? new Date().toISOString() : prevDate;
}
```

## Częste błędy

- Automatyczne ustawianie `dateModified` na datę każdego deployu dla wszystkich stron.
- Zmiana roku w tytule ("2027") bez aktualizacji treści.
