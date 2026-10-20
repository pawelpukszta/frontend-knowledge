---
title: "Linki tel: i mailto:"
priority: medium
---

Numery telefonów jako `<a href="tel:+48...">` w formacie międzynarodowym bez spacji, adresy e-mail jako `mailto:`. Na telefonie jedno dotknięcie uruchamia połączenie.

## Dlaczego to ważne

- Klient przed wyjazdem często dzwoni z telefonu; przepisywanie numeru z ekranu to tarcie, które kończy się rezygnacją.
- Format `+48` działa także dla klientów za granicą (np. dzwoniących z miejsca wypoczynku), a spacje i nawiasy w `href` bywają różnie interpretowane przez aplikacje.
- Czytelny tekst linku (numer w zwykłym zapisie) i godziny pracy obok numeru ograniczają nieudane połączenia.

## Jak sprawdzić

Przegląd stopki i strony kontaktu na urządzeniu mobilnym.

## Kod

```html
<address>
  <p>Infolinia (pn-pt 8:00-20:00):
    <a href="tel:+48221234567">+48 22 123 45 67</a></p>
  <p>Pomoc w podróży 24/7:
    <a href="tel:+48600123456">+48 600 123 456</a></p>
  <p>E-mail:
    <a href="mailto:rezerwacje@example.pl?subject=Pytanie%20o%20rezerwacj%C4%99">rezerwacje@example.pl</a></p>
</address>
```

## Częste błędy

- Numer telefonu jako obrazek lub zwykły tekst bez linku.
- Link `tel:` z tekstem "Zadzwoń" bez widocznego numeru, bezużyteczny na komputerze.
