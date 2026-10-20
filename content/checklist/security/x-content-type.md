---
title: "X-Content-Type-Options: nosniff"
priority: high
sources:
  - title: "MDN: X-Content-Type-Options"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options
---

Nagłówek `X-Content-Type-Options: nosniff` zabrania przeglądarce zgadywania typu MIME, co chroni przed wykonaniem pliku (np. uploadu) jako skryptu lub HTML. Wymaga poprawnego `Content-Type` dla każdego zasobu.

## Dlaczego to ważne

- Bez `nosniff` plik tekstowy lub "obrazek" wgrany przez użytkownika, zawierający HTML i JavaScript, może zostać zinterpretowany jako strona i wykonać skrypt (XSS).
- Z `nosniff` przeglądarka blokuje skrypty i style podane z niewłaściwym typem MIME, więc pomyłka w konfiguracji serwera nie staje się furtką.
- To jeden nagłówek bez wpływu na wydajność; OWASP zaleca go dla wszystkich odpowiedzi.

## Jak sprawdzić

Nagłówki odpowiedzi HTML, skryptów i plików z uploadu; securityheaders.com.

## Kod

```http title="Plik wgrany przez użytkownika"
HTTP/2 200
Content-Type: application/pdf
Content-Disposition: attachment; filename="voucher-48213.pdf"
X-Content-Type-Options: nosniff
```

```js title="Express 5"
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});
// Or: app.use(helmet()) sets it together with other headers
```

## Częste błędy

- Serwowanie wszystkich uploadów jako `application/octet-stream` lub `text/plain` bez `nosniff`.
