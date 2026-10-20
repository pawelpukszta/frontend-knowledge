---
title: Meta tagi geograficzne
priority: medium
---

`geo.region` (kod ISO 3166-2, np. `PL-14` dla Mazowieckiego), `geo.placename` i `geo.position` opisują lokalizację strony. To co najwyżej słaby sygnał pomocniczy: Google ich nie używa, opiera się na treści, danych strukturalnych, hreflang i profilu firmy.

## Dlaczego to ważne

- Tagi kosztują niewiele, jeśli generuje je ten sam szablon co dane LocalBusiness; wpisywane ręcznie szybko rozjeżdżają się z adresem.
- Błędny region lub współrzędne mogą wprowadzić w błąd narzędzia, które je czytają; lepiej brak tagu niż zły tag.
- Dla lokalnej widoczności w Google więcej daje spójny adres w treści, LocalBusiness i Google Business Profile niż jakiekolwiek meta tagi.

## Jak sprawdzić

Sprawdź `<head>` stron lokalnych i zgodność współrzędnych z adresem (np. wklejając je do mapy).

## Kod

```html title="Strona oddziału /biura/warszawa-centrum"
<meta name="geo.region" content="PL-14">
<meta name="geo.placename" content="Warszawa">
<meta name="geo.position" content="52.22977;21.01178">
<meta name="ICBM" content="52.22977, 21.01178">
```

## Częste błędy

- Stary kod `PL-MZ` z dawnych poradników; od 2018 r. ISO 3166-2 używa dla województw kodów liczbowych (`PL-02` do `PL-32`).
- Te same tagi geo na wszystkich stronach serwisu, także na stronach ofert zagranicznych.
