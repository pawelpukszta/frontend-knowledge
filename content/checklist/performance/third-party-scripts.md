---
title: Zoptymalizowane skrypty zewnętrzne
priority: high
---

Analityka, czaty, reklamy i A/B testy są ładowane asynchronicznie, po interakcji lub w czasie bezczynności; regularnie audytuj, czy wszystkie są potrzebne. Rozważ przeniesienie do Web Workera (Partytown) lub na serwer (server-side tagging).

## Dlaczego to ważne

- Skrypty firm trzecich to często największa część JS na stronach e-commerce; ich długie zadania na wątku głównym bezpośrednio pogarszają INP.
- Nie kontrolujesz ich rozmiaru ani wydajności: aktualizacja po stronie dostawcy może z dnia na dzień spowolnić twoją stronę lub ją zepsuć.
- Każdy dodatkowy skrypt to też ryzyko bezpieczeństwa i prywatności (dostęp do DOM, formularzy, cookies) oraz obowiązki wynikające z RODO.

## Jak sprawdzić

Insight o firmach trzecich w Lighthouse, grupowanie po domenach w panelu Performance (kolumna "1st / 3rd party"), Network z filtrem `-domain:example.pl`; blokowanie domen w DevTools, by zmierzyć zysk.

## Kod

```html
<!-- Analytics: async, does not block parsing -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>

<!-- A/B testing tool loaded later, not in <head> blocking render -->
<script defer src="https://ab.example-vendor.com/sdk.js"></script>

<!-- Partytown: run a heavy marketing tag in a Web Worker -->
<script>partytown = { forward: ['dataLayer.push'] };</script>
<script src="/~partytown/partytown.js"></script>
<script type="text/partytown" src="https://pixel.example-ads.com/tag.js"></script>
```

## Częste błędy

- A/B testy ukrywające całą stronę (anti-flicker snippet) do czasu załadowania skryptu, co bezpośrednio opóźnia FCP i LCP.
- Partytown dla skryptów intensywnie korzystających z DOM w czasie rzeczywistym (czaty, odtwarzacze): komunikacja z wątkiem głównym bywa wtedy wolniejsza i zawodna; testuj każdy skrypt osobno.
