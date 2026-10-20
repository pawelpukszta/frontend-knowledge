---
title: Bez mixed content
priority: high
sources:
  - title: "MDN: Mixed content"
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Mixed_content
---

Strona HTTPS nie ładuje zasobów przez HTTP. Przeglądarki blokują takie skrypty, style i ramki, a obrazy oraz media automatycznie podnoszą do HTTPS, co psuje je, gdy serwer nie obsługuje HTTPS.

## Dlaczego to ważne

- Zablokowany skrypt lub arkusz stylów z adresu `http://` potrafi wyłączyć kalendarz rezerwacji czy koszyk bez widocznego komunikatu dla użytkownika.
- Zasób przez HTTP może zostać podmieniony w sieci, co niweczy ochronę całej strony.
- Mixed content często wraca razem z treściami z CMS (wklejone obrazy z `http://`) i starymi skryptami partnerów.

## Jak sprawdzić

Konsola przeglądarki (ostrzeżenia Mixed Content), crawler szukający adresów `http://` w źródłach; tymczasowo nagłówek CSP w trybie Report-Only do zbierania naruszeń.

## Kod

```html title="Źle"
<script src="http://widgets.partner.example/booking.js"></script>
<img src="http://cdn.example.pl/img/hotel.jpg" alt="Hotel nad morzem" width="800" height="533" />
```

```html title="Dobrze"
<script src="https://widgets.partner.example/booking.js" defer></script>
<img src="/img/hotel.jpg" alt="Hotel nad morzem" width="800" height="533" />
<!-- Safety net for legacy CMS content, sent as a response header:
     Content-Security-Policy: upgrade-insecure-requests -->
```

## Częste błędy

- Poleganie wyłącznie na `upgrade-insecure-requests` zamiast poprawienia adresów w kodzie i CMS.
