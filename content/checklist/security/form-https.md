---
title: Formularze wysyłane przez HTTPS
priority: critical
---

Akcja każdego formularza (logowanie, płatność, kontakt) i każde żądanie `fetch` z danymi wskazuje adres HTTPS; przeglądarki ostrzegają przy wysyłce przez HTTP.

## Dlaczego to ważne

- Formularz na stronie HTTPS wysyłany na `http://` przesyła hasło, PESEL czy dane kontaktowe otwartym tekstem.
- Chrome pokazuje pełnoekranowe ostrzeżenie przed wysłaniem niezabezpieczonego formularza, co praktycznie zabija konwersję.
- Dyrektywa CSP `form-action` dodatkowo ogranicza, dokąd formularz może zostać wysłany, nawet gdy ktoś wstrzyknie własny `<form>`.

## Jak sprawdzić

Przegląd atrybutów `action` i zapytań w Network (kolumna Scheme); wyszukaj w kodzie `action="http:` i `fetch('http:`.

## Kod

```html title="Źle"
<form action="http://api.example.pl/newsletter" method="post">
```

```html title="Dobrze"
<!-- Relative URL inherits HTTPS from the page -->
<form action="/api/newsletter" method="post">
  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" autocomplete="email" required />
  <button type="submit">Zapisz się</button>
</form>
<!-- Response header: Content-Security-Policy: form-action 'self' -->
```

## Częste błędy

- Poprawny `action`, ale skrypt wysyłający dane do zewnętrznego narzędzia marketingowego przez `http://`.
