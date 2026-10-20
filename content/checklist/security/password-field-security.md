---
title: Bezpieczne pola haseł
priority: high
sources:
  - title: "web.dev: Sign-in form best practices"
    url: https://web.dev/articles/sign-in-form-best-practices
---

`type="password"` z `autocomplete="current-password"` lub `new-password`, przycisk pokazania hasła, czytelne wymagania i wskaźnik siły, pozwolenie na wklejanie i współpraca z menedżerami haseł oraz passkeys.

## Dlaczego to ważne

- Menedżery haseł generują i wypełniają długie, unikalne hasła tylko wtedy, gdy rozpoznają pola po `autocomplete`; blokada wklejania wymusza krótkie, powtarzane hasła.
- WCAG 2.2 (3.3.8 Accessible Authentication) wymaga, by logowanie nie opierało się na zapamiętywaniu i przepisywaniu; wklejanie i autouzupełnianie spełniają ten warunek.
- Przycisk pokazania hasła zmniejsza liczbę błędów przy wpisywaniu na telefonie, więc użytkownik rzadziej porzuca rejestrację.

## Jak sprawdzić

Logowanie i rejestracja z menedżerem haseł (Chrome, 1Password, Bitwarden); test wklejania hasła; sprawdzenie, czy przeglądarka proponuje wygenerowanie silnego hasła w polu `new-password`.

## Kod

```html title="Rejestracja"
<form action="/api/register" method="post">
  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" autocomplete="username" required />

  <label for="new-password">Hasło</label>
  <input id="new-password" name="password" type="password" autocomplete="new-password"
         minlength="12" aria-describedby="password-hint" required />
  <button type="button" aria-controls="new-password" aria-pressed="false">Pokaż hasło</button>
  <p id="password-hint">Co najmniej 12 znaków. Możesz użyć menedżera haseł.</p>

  <button type="submit">Załóż konto</button>
</form>
```

## Częste błędy

- Blokowanie wklejania przez `onpaste="return false"` lub niski `maxlength` (np. 16), który ucina hasła z menedżera.
- Wymuszanie złożoności typu "wielka litera, cyfra, znak specjalny" zamiast minimalnej długości i sprawdzania haseł z wycieków.
