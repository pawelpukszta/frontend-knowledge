---
title: Bez skryptów inline
priority: high
---

Kod w zewnętrznych plikach jest cache'owany, łatwiejszy w utrzymaniu i pozwala na restrykcyjne CSP bez `unsafe-inline`. Wyjątki obsłuż przez nonce.

## Dlaczego to ważne

- CSP z `'unsafe-inline'` praktycznie nie chroni przed XSS, bo wstrzyknięty `<script>` lub `onerror=` wykona się tak samo jak Twój kod.
- Atrybuty `onclick=` mieszają logikę z HTML, działają w zasięgu globalnym i nie da się ich testować ani sprawdzać linterem.
- Zewnętrzny plik z hashem w nazwie może być cache'owany długo (`immutable`), a skrypt inline jest pobierany z każdą stroną.

## Jak sprawdzić

Wyszukaj `<script>` bez `src` i atrybuty `on*=` w HTML; w konsoli sprawdź naruszenia CSP po włączeniu nagłówka w trybie `Content-Security-Policy-Report-Only`.

## Kod

```html title="Źle"
<button onclick="addToCart(1234)">Dodaj</button>
<script>window.config = { apiUrl: "/api" };</script>
```

```html title="Dobrze"
<button type="button" data-offer-id="1234" class="js-add-to-cart">Dodaj</button>
<script type="application/json" id="app-config">{ "apiUrl": "/api" }</script>
<script type="module" src="/assets/app.3f9c2a.js"></script>
<!-- Unavoidable inline script: nonce generated per request -->
<script nonce="r4nd0mN0nc3">/* analytics bootstrap */</script>
```

```http
Content-Security-Policy: script-src 'nonce-r4nd0mN0nc3' 'strict-dynamic'; object-src 'none'; base-uri 'none'
```

## Częste błędy

- Stała wartość nonce wpisana w szablon; nonce musi być losowy dla każdego żądania.
