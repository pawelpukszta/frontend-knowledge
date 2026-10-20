---
title: Sygnały zaufania na kluczowych stronach
priority: medium
---

Dane rejestrowe firmy, gwarancje i zabezpieczenia, opinie klientów z informacją o weryfikacji, bezpieczne metody płatności. Najważniejsze na stronach ofert, koszyka i rezerwacji.

## Dlaczego to ważne

- Organizator turystyki w Polsce musi być wpisany do rejestru marszałka województwa (CEOTiPU) i mieć zabezpieczenie finansowe na wypadek niewypłacalności; numer wpisu i nazwa gwaranta to konkretny argument dla klienta.
- Od 2023 r. (dyrektywa Omnibus) sprzedawca musi informować, czy i jak weryfikuje opinie; fałszywe recenzje są nieuczciwą praktyką rynkową.
- Niepewność w momencie płatności to częsta przyczyna porzucenia koszyka; widoczne zabezpieczenia przy przycisku "Rezerwuję" ją zmniejszają.

## Jak sprawdzić

Przegląd stron oferty, koszyka i płatności na telefonie: czy sygnały zaufania są widoczne w miejscu decyzji, a nie tylko w stopce; sprawdź aktualność danych rejestrowych.

## Kod

```html title="Przy przycisku rezerwacji"
<ul class="trust" aria-label="Bezpieczna rezerwacja">
  <li>Organizator turystyki wpisany do rejestru Marszałka Województwa Mazowieckiego, nr 1234</li>
  <li>Gwarancja ubezpieczeniowa i składka na Turystyczny Fundusz Gwarancyjny</li>
  <li>Płatność BLIK-iem, kartą lub szybkim przelewem</li>
</ul>
<p class="reviews">
  4,7/5 z 2318 opinii.
  <a href="/jak-weryfikujemy-opinie">Opinie mogą wystawić tylko klienci po powrocie z wyjazdu.</a>
</p>
<button type="submit">Rezerwuję i płacę</button>
```

## Częste błędy

- Logo certyfikatów i nagród, których firma nie ma albo które wygasły.
- Opinie bez daty i bez informacji o sposobie weryfikacji.
