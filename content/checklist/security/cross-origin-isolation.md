---
title: COOP, COEP i CORP, gdy potrzebne
priority: medium
sources:
  - title: "web.dev: Making your website cross-origin isolated"
    url: https://web.dev/articles/coop-coep
---

Cross-Origin-Opener-Policy, -Embedder-Policy i -Resource-Policy izolują stronę od innych originów (ochrona przed atakami typu Spectre); pełna izolacja jest wymagana m.in. do `SharedArrayBuffer` i precyzyjnych pomiarów pamięci.

## Dlaczego to ważne

- `Cross-Origin-Opener-Policy: same-origin` zrywa powiązanie z oknami otwartymi z innych domen, co chroni przed atakami przez `window.opener` i wyciekami między kartami; warto go ustawić nawet bez pełnej izolacji.
- `Cross-Origin-Resource-Policy` na Twoich zasobach (API, obrazy) uniemożliwia innym stronom wczytanie ich do swojego procesu.
- COEP `require-corp` blokuje zasoby z innych domen bez CORS lub CORP, więc może zepsuć reklamy, mapy i widgety partnerów; `credentialless` jest łagodniejszą alternatywą.

## Jak sprawdzić

Nagłówki odpowiedzi; `self.crossOriginIsolated` w konsoli zwraca `true` przy pełnej izolacji; panel Application > Frames pokazuje status izolacji.

## Kod

```http title="Strona wymagająca izolacji (np. edytor z WebAssembly)"
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp

# On your own static assets and API responses
Cross-Origin-Resource-Policy: same-site
```

```js title="Weryfikacja w kodzie"
if (self.crossOriginIsolated) {
  const shared = new SharedArrayBuffer(1024); // available only when isolated
} else {
  console.warn('Not cross-origin isolated: check COOP and COEP headers');
}
```

## Częste błędy

- Włączenie COEP na całym serwisie bez sprawdzenia zasobów zewnętrznych; znikają obrazy z CDN partnerów i ramki płatności.
- COOP `same-origin` na stronie, która otwiera okno płatności lub logowania przez popup i czeka na `postMessage`; wtedy `same-origin-allow-popups`.
