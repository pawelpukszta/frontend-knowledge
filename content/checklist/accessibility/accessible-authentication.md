---
title: Logowanie bez testów poznawczych
priority: high
sources:
  - title: "W3C Understanding 3.3.8: Accessible Authentication (Minimum)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
  - title: "web.dev: Sign in with a passkey through form autofill"
    url: https://web.dev/articles/passkey-form-autofill
---

Nie wymagaj zapamiętywania, przepisywania ani rozwiązywania zagadek bez alternatywy. Pozwól na wklejanie haseł, menedżery haseł, passkeys, link e-mail. WCAG 2.2 SC 3.3.8 (AA).

## Dlaczego to ważne

- Osoby z dysleksją, zaburzeniami pamięci lub dyskalkulią często nie przepiszą kodu z SMS-a ani nie rozwiążą zagadki obrazkowej bez pomocy.
- Menedżery haseł i passkeys usuwają test pamięci w całości; passkeys są przy tym odporne na phishing, więc dostępność i bezpieczeństwo idą w parze.
- To kryterium WCAG 2.2 poziomu AA, wymaganego m.in. przez European Accessibility Act dla e-commerce i usług rezerwacyjnych.

## Jak sprawdzić

Przejdź logowanie z menedżerem haseł i wklejaniem; sprawdź, czy kod jednorazowy można wkleić lub uzupełnić automatycznie i czy CAPTCHA ma dostępną alternatywę.

## Kod

```html title="Dobrze"
<form action="/login" method="post">
  <label for="username">E-mail</label>
  <!-- "webauthn" lets the browser offer saved passkeys in autofill -->
  <input id="username" name="username" type="email" autocomplete="username webauthn" />

  <label for="password">Hasło</label>
  <input id="password" name="password" type="password" autocomplete="current-password" />

  <label for="otp">Kod z SMS</label>
  <input id="otp" name="otp" inputmode="numeric" autocomplete="one-time-code" />
  <button type="submit">Zaloguj się</button>
  <a href="/login/magic-link">Wyślij mi link do logowania</a>
</form>
```

```ts title="Passkey w autouzupełnianiu (conditional UI)"
if (await PublicKeyCredential.isConditionalMediationAvailable?.()) {
  const options = await fetch("/api/passkey/options").then((r) => r.json());
  const credential = await navigator.credentials.get({
    mediation: "conditional", // shows passkeys in the username field's autofill
    publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(options),
  });
  await fetch("/api/passkey/verify", { method: "POST", body: JSON.stringify(credential) });
}
```

## Częste błędy

- Kod jednorazowy rozbity na 6 osobnych pól, z których żadne nie przyjmuje wklejenia całego kodu.
- "Wpisz 3. i 7. znak hasła"; to test pamięci, którego menedżer haseł nie obsłuży.
