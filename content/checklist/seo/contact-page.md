---
title: Pełna strona kontaktowa
priority: medium
---

Kilka form kontaktu (formularz, telefon, e-mail, adres, godziny pracy infolinii) na jednej łatwo dostępnej stronie. To sygnał zaufania i wymóg przepisów dla sprzedaży online.

## Dlaczego to ważne

- Ustawa o świadczeniu usług drogą elektroniczną (art. 5) wymaga podania m.in. adresu e-mail i danych firmy, a ustawa o prawach konsumenta danych kontaktowych przed zawarciem umowy.
- Klient z problemem na wyjeździe szuka telefonu alarmowego; jego brak kończy się złą opinią w sieci i reklamacją.
- Wytyczne dla oceniających jakość wskazują brak informacji kontaktowych w serwisie sprzedażowym jako sygnał niskiej jakości.

## Jak sprawdzić

Sprawdź, czy strona kontaktu jest podlinkowana w stopce i nagłówku, dane są aktualne, a linki `tel:` i `mailto:` działają na telefonie.

## Kod

```html
<h1>Kontakt</h1>
<address>
  Example Travel sp. z o.o.<br>
  ul. Marszałkowska 100, 00-026 Warszawa<br>
  Infolinia: <a href="tel:+48221234567">+48 22 123 45 67</a> (pn-pt 8:00-20:00, sob. 9:00-15:00)<br>
  Telefon alarmowy dla klientów na wyjeździe (24/7): <a href="tel:+48600123456">+48 600 123 456</a><br>
  E-mail: <a href="mailto:rezerwacje@example.pl">rezerwacje@example.pl</a>
</address>
<p><a href="/kontakt/formularz">Napisz do nas przez formularz</a></p>
```

## Częste błędy

- Sam formularz kontaktowy, bez telefonu i e-maila.
- Numer telefonu jako obrazek; nie da się go kliknąć ani skopiować.
