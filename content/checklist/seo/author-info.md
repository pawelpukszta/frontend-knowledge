---
title: Dane strukturalne autora
priority: medium
---

`author` jako `Person` (lub `Organization`) z `name`, `url` prowadzącym do strony autora i opcjonalnie `sameAs` z profilami zewnętrznymi wiąże treść z konkretną osobą.

## Dlaczego to ważne

- Google zaleca wpisywanie w `name` tylko imienia i nazwiska, bez stanowiska czy nazwy serwisu; kilku autorów to osobne obiekty w tablicy.
- Strona autora z biogramem i linkami pozwala odróżnić osoby o tym samym nazwisku i wspiera ocenę doświadczenia (E-E-A-T) w tematach wymagających zaufania, np. ubezpieczenia podróżne czy wymogi wizowe.
- Spójne dane autora na wszystkich artykułach budują rozpoznawalność eksperta, także w systemach AI cytujących źródła.

## Jak sprawdzić

Rich Results Test na artykułach; adres z `url` autora zwraca 200 i jest indeksowalny.

## Kod

```json title="Fragment JSON-LD artykułu"
{
  "author": [
    {
      "@type": "Person",
      "name": "Anna Kowalska",
      "url": "https://example.pl/autorzy/anna-kowalska",
      "jobTitle": "Pilotka wycieczek i redaktorka",
      "sameAs": ["https://www.linkedin.com/in/anna-kowalska-travel"]
    },
    {
      "@type": "Person",
      "name": "Piotr Nowak",
      "url": "https://example.pl/autorzy/piotr-nowak"
    }
  ]
}
```

## Częste błędy

- `name` z dopiskiem typu "Anna Kowalska | Ekspertka od Grecji".
- `url` autora prowadzący do strony z noindex lub 404.
