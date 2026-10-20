---
title: Flagi Secure, HttpOnly, SameSite
priority: high
sources:
  - title: "MDN: Set-Cookie"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie
---

Cookie sesyjne z `Secure` (tylko HTTPS), `HttpOnly` (niedostępne dla JS) i `SameSite=Lax` lub `Strict` (ochrona przed CSRF), najlepiej z prefiksem `__Host-` i `Path=/`.

## Dlaczego to ważne

- `HttpOnly` sprawia, że nawet udany atak XSS nie odczyta identyfikatora sesji przez `document.cookie` i nie wyśle go atakującemu.
- `Secure` gwarantuje, że cookie nie poleci otwartym tekstem po przypadkowym żądaniu `http://`.
- `SameSite=Lax` blokuje wysyłanie cookie przy żądaniach POST i `fetch` z obcych stron, więc ukryty formularz na innej domenie nie zmieni danych rezerwacji.
- Prefiks `__Host-` wymusza `Secure`, `Path=/` i brak `Domain`, więc subdomena (np. przejęty blog) nie nadpisze cookie sesji.

## Jak sprawdzić

DevTools, Application, Cookies: kolumny HttpOnly, Secure, SameSite; w konsoli `document.cookie` nie powinno zawierać sesji.

## Kod

```http title="Nagłówki odpowiedzi"
# After login
Set-Cookie: __Host-session=9f8c2e...; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=28800

# After logout: overwrite with the same attributes and expire immediately
Set-Cookie: __Host-session=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0
```

```js title="Express 5"
res.cookie('__Host-session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 8 * 60 * 60 * 1000, // 8 hours, in milliseconds
});
```

## Częste błędy

- `SameSite=None` bez potrzeby (np. "bo tak działało"); wtedy ochrona przed CSRF znika.
- Traktowanie `SameSite` jako jedynej ochrony przed CSRF przy operacjach zmieniających stan przez GET.
