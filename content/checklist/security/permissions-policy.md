---
title: Nagłówek Permissions-Policy
priority: medium
sources:
  - title: "MDN: Permissions-Policy"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy
---

Wyłącza funkcje przeglądarki, których strona nie używa (kamera, mikrofon, geolokalizacja, płatności), także dla osadzonych ramek, a pozostałe ogranicza do zaufanych originów.

## Dlaczego to ważne

- Gdy skrypt zewnętrzny lub wstrzyknięty kod spróbuje użyć kamery czy geolokalizacji, przeglądarka odmówi bez pytania użytkownika.
- Ramki reklam i widgetów nie dostaną dostępu do funkcji, których Twoja strona im wprost nie przyznała.
- Jawna lista używanych funkcji jest dokumentacją dla zespołu i ułatwia audyt prywatności.

## Jak sprawdzić

Nagłówki odpowiedzi; test praktyczny: wywołanie zablokowanego API (np. `navigator.geolocation.getCurrentPosition` w ramce bez `allow`) powinno zakończyć się błędem, a konsola pokaże naruszenie polityki.

## Kod

```http title="Nagłówek"
# () = disabled everywhere, (self) = this origin only, quoted origins = explicit allow
Permissions-Policy: camera=(), microphone=(), usb=(),
  geolocation=(self), fullscreen=(self),
  payment=(self "https://pay.example.com")
# Sent as a single header line in practice; wrapped here for readability
```

```html title="Delegacja dla konkretnej ramki"
<!-- Map widget may use geolocation, nothing else -->
<iframe src="https://maps.partner.example/embed?hotel=48213"
        allow="geolocation" title="Mapa dojazdu do hotelu" width="600" height="400"></iframe>
```

## Częste błędy

- Kopiowanie starych wpisów typu `interest-cohort=()` (FLoC) zamiast dopasowania listy do realnych funkcji.
