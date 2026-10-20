---
title: Minimalizacja danych
priority: medium
---

Zbieraj tylko dane niezbędne do konkretnego celu (art. 5 ust. 1 lit. c RODO). Każde pole formularza i każdy parametr wysyłany do analityki powinien mieć uzasadnienie, a pola opcjonalne muszą być wyraźnie oznaczone.

## Dlaczego to ważne

- Danych, których nie masz, nie da się wykraść; wyciek niepotrzebnie zbieranych numerów PESEL czy dat urodzenia oznacza zgłoszenie do UODO i zawiadamianie klientów.
- Każde zbędne pole wydłuża wypełnianie formularza i obniża konwersję, szczególnie na telefonie.
- Dane osobowe w adresach URL (`?email=...`) i zdarzeniach analitycznych trafiają do logów, historii przeglądarki i narzędzi firm trzecich; Google Analytics wprost zabrania wysyłania danych identyfikujących osobę.

## Jak sprawdzić

Przegląd formularzy (dla każdego pola: cel i podstawa prawna), zapytań do analityki w panelu Network oraz logów serwera pod kątem e-maili i numerów telefonów.

## Kod

```tsx title="Formularz zapytania o ofertę"
// Bad: PESEL, birth date and home address are not needed to send an offer
// <input name="pesel" /> <input name="birthDate" /> <input name="address" />

// Good: only what the inquiry needs; the phone number is clearly optional
<form action={sendInquiry}>
  <label htmlFor="name">Imię</label>
  <input id="name" name="name" autoComplete="given-name" required />
  <label htmlFor="email">E-mail</label>
  <input id="email" name="email" type="email" autoComplete="email" required />
  <label htmlFor="phone">Telefon (opcjonalnie, jeśli wolisz kontakt telefoniczny)</label>
  <input id="phone" name="phone" type="tel" autoComplete="tel" />
  <button>Wyślij zapytanie</button>
</form>
```

```ts title="Zdarzenia analityczne"
// Bad: personal data in analytics events
track('booking_completed', { email: user.email, phone: user.phone });

// Good: non-identifying, aggregated properties
track('booking_completed', { destination: 'GR', nights: 7, priceBucket: '3000-4000' });
```

## Częste błędy

- Zbieranie danych "na zapas", bo kiedyś mogą się przydać marketingowi.
- Wysyłanie formularza metodą GET, przez co dane lądują w URL-u i logach.
