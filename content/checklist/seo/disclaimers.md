---
title: Zastrzeżenia przy treściach wrażliwych
priority: medium
---

Porady medyczne, prawne, finansowe czy ubezpieczeniowe mają widoczną informację, że nie zastępują konsultacji ze specjalistą, oraz wskazanie, gdzie szukać wiążących informacji.

## Dlaczego to ważne

- Czytelnik może podjąć decyzję zdrowotną lub finansową na podstawie tekstu; zastrzeżenie kieruje go do lekarza, ubezpieczyciela czy MSZ.
- Ogranicza ryzyko prawne serwisu, choć nie zwalnia z rzetelności samej treści.
- Jasne granice porady to oczekiwany element treści YMYL; pokazują, że redakcja rozumie swoją odpowiedzialność.

## Jak sprawdzić

Przegląd treści YMYL: czy zastrzeżenie jest przy treści (a nie tylko w regulaminie) i czy wskazuje konkretne, wiążące źródło.

## Kod

```html
<aside class="disclaimer" role="note" aria-label="Zastrzeżenie">
  <p>
    Artykuł ma charakter informacyjny i nie zastępuje konsultacji z lekarzem medycyny podróży.
    Zalecenia dotyczące szczepień się zmieniają; aktualne informacje znajdziesz w
    <a href="https://www.gov.pl/web/dyplomacja/informacje-dla-podrozujacych">serwisie MSZ Polak za granicą</a>.
  </p>
  <p>Konsultacja merytoryczna: lek. Jan Kowalski, specjalista chorób zakaźnych. Stan na 1 października 2026.</p>
</aside>
```

## Częste błędy

- Zastrzeżenie ukryte w regulaminie albo w drobnym szarym druku pod stopką.
