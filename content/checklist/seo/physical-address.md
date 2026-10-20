---
title: Widoczny adres fizyczny
priority: medium
---

Adres siedziby lub biura obsługi klienta jest widoczny na stronie (zwykle w stopce i na stronie kontaktu), oznaczony elementem `<address>` i zgodny z danymi rejestrowymi.

## Dlaczego to ważne

- Ustawa o świadczeniu usług drogą elektroniczną i ustawa o prawach konsumenta wymagają podania adresu przedsiębiorcy; jego brak to naruszenie obowiązków informacyjnych.
- Spółki muszą na swojej stronie podawać m.in. siedzibę i adres, sąd rejestrowy, numer KRS, NIP, a sp. z o.o. także kapitał zakładowy (art. 206 Kodeksu spółek handlowych).
- Prawdziwy adres odróżnia firmę od oszukańczych sklepów i biur "widm", a do tego jest podstawą wpisu w Google Business Profile.

## Jak sprawdzić

Sprawdź stopkę i stronę kontaktu; porównaj adres z KRS lub CEIDG oraz z danymi w JSON-LD.

## Kod

```html
<footer>
  <address>
    Example Travel sp. z o.o., ul. Marszałkowska 100, 00-026 Warszawa<br>
    Sąd Rejonowy dla m.st. Warszawy, XII Wydział Gospodarczy KRS<br>
    KRS 0000123456, NIP 5250000000, kapitał zakładowy 500 000 zł<br>
    <a href="/kontakt">Wszystkie dane kontaktowe</a>
  </address>
</footer>
```

## Częste błędy

- Adres tylko jako obrazek albo wyłącznie w regulaminie w PDF.
