---
title: Pozwól wklejać do pól
priority: medium
---

Blokowanie wklejania (np. w polu hasła lub potwierdzenia e-maila) utrudnia korzystanie z menedżerów haseł i osobom z problemami motorycznymi, a nie poprawia bezpieczeństwa.

## Dlaczego to ważne

- Blokada wklejania zmusza do ręcznego przepisywania długich haseł, numerów rezerwacji czy IBAN-u, co łamie WCAG 3.3.8 przy logowaniu.
- Użytkownicy wybierają wtedy krótsze, słabsze hasła; NCSC i NIST odradzają blokowanie wklejania.
- Pole "Powtórz e-mail" z blokadą i tak nie łapie literówek, jeśli ktoś wkleja z tego samego źródła; lepsza jest walidacja formatu i wysłanie kodu potwierdzającego.

## Jak sprawdzić

Wklej wartość do każdego pola formularza; wyszukaj w kodzie `onpaste`, `preventDefault` w handlerach `paste` i `autocomplete="off"` na polach logowania.

## Kod

```html title="Źle"
<input type="password" onpaste="return false" autocomplete="off" />
<input type="email" id="email-confirm" onpaste="event.preventDefault()" />
```

```html title="Dobrze"
<label for="pwd">Hasło</label>
<input id="pwd" type="password" autocomplete="new-password" minlength="12" />
<label for="booking">Numer rezerwacji</label>
<input id="booking" inputmode="text" spellcheck="false" />
```
