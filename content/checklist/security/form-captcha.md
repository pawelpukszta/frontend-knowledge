---
title: Ochrona publicznych formularzy przed botami
priority: medium
---

Formularze bez logowania (kontakt, rejestracja, newsletter, zapytanie o ofertę) chroń przez honeypot, rate limiting po stronie serwera lub niewidoczną CAPTCHA (Turnstile, reCAPTCHA v3). Pamiętaj o dostępności i zgodach RODO.

## Dlaczego to ważne

- Boty zapychają skrzynki spamem, zakładają fałszywe konta i wysyłają maile potwierdzające na cudze adresy, co psuje reputację domeny nadawczej.
- Rate limiting chroni też przed testowaniem wycieków haseł (credential stuffing) i masowym sprawdzaniem kodów rabatowych.
- Klasyczna CAPTCHA z obrazkami jest barierą dla osób z niepełnosprawnościami; WCAG 2.2 (3.3.8) wymaga dostępnej alternatywy, więc lepiej zacząć od mechanizmów niewidocznych.

## Jak sprawdzić

Próba wielokrotnej wysyłki formularza (oczekiwany status 429), wysyłka z wypełnionym polem honeypot; przegląd zabezpieczeń po stronie serwera, nie tylko w HTML.

## Kod

```html title="Honeypot"
<!-- Hidden from users and assistive tech; bots fill every field -->
<div class="visually-hidden" aria-hidden="true">
  <label for="website">Nie wypełniaj tego pola</label>
  <input id="website" name="website" type="text" tabindex="-1" autocomplete="off" />
</div>
```

```js title="Express 5 z express-rate-limit"
import { rateLimit } from 'express-rate-limit';

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false });

app.post('/api/contact', contactLimiter, async (req, res) => {
  if (req.body.website) return res.status(200).json({ ok: true }); // honeypot hit: pretend success
  await sendInquiry(req.body);
  res.status(201).json({ ok: true });
});
```

## Częste błędy

- Honeypot bez `aria-hidden` i `tabindex="-1"`; użytkownik klawiatury lub czytnika ekranu wypełni pole i zostanie potraktowany jak bot.
- Walidacja CAPTCHA tylko po stronie klienta bez weryfikacji tokenu na serwerze.
