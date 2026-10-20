---
title: Przekierowanie HTTP na HTTPS
priority: critical
---

Każde żądanie `http://` dostaje 301 (lub 308) na odpowiedni adres `https://` z tą samą ścieżką i parametrami, bez łańcuchów przekierowań.

## Dlaczego to ważne

- Użytkownicy wpisują adres bez protokołu, a stare linki i zakładki prowadzą na `http://`; bez przekierowania trafiają na niezabezpieczoną wersję lub błąd.
- Przekierowanie stałe przenosi sygnały SEO na wersję HTTPS; 302 lub łańcuch `http` → `www` → `https` rozprasza je i dodaje opóźnienie przy każdej wizycie.
- Zachowanie ścieżki ma znaczenie: przekierowanie wszystkiego na stronę główną gubi link do konkretnej oferty z maila czy reklamy.

## Jak sprawdzić

`curl -I http://twoja-domena.pl/sciezka?x=1` powinien zwrócić jeden 301 z `Location` na ten sam adres w HTTPS; sprawdź też wariant z `www`.

## Kod

```http title="Pojedyncze przekierowanie z zachowaniem ścieżki"
GET /wakacje/grecja?termin=lipiec HTTP/1.1
Host: example.pl

HTTP/1.1 301 Moved Permanently
Location: https://example.pl/wakacje/grecja?termin=lipiec
```

```js title="Express 5 (za proxy lub load balancerem)"
app.set('trust proxy', 1); // read X-Forwarded-Proto from the load balancer

app.use((req, res, next) => {
  if (req.secure) return next();
  res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
});
```

## Częste błędy

- Przekierowanie wykonywane w JavaScripcie na stronie, czyli dopiero po załadowaniu treści przez HTTP.
- Łańcuch kilku przekierowań zamiast jednego bezpośrednio na adres docelowy.
