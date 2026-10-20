---
title: Bez linków z HTTPS do HTTP
priority: medium
---

Linki wewnętrzne i zasoby wskazują `https://` (albo ścieżki względne). Linki do wersji HTTP generują zbędne przekierowania, a w przypadku zasobów: mixed content.

## Dlaczego to ważne

- Każdy link `http://` to dodatkowy skok 301 przed załadowaniem strony; bez HSTS pierwsze żądanie idzie niezaszyfrowane i może zostać przechwycone lub zmienione.
- Przeglądarki automatycznie podnoszą do HTTPS obrazy, audio i wideo, ale skrypty, style i iframe z HTTP blokują; strona może stracić wygląd lub funkcje.
- Sygnały z linków trafiają na adres przekierowujący zamiast bezpośrednio na kanoniczny.

## Jak sprawdzić

Crawler: linki ze schematem `http://`; konsola DevTools pokazuje ostrzeżenia mixed content; `grep -rn 'http://' src/` w kodzie.

## Kod

```html title="Źle"
<a href="http://example.pl/wakacje/grecja">Grecja</a>
<img src="http://cdn.example.pl/hotele/kreta.jpg" alt="Hotel na Krecie" />
<script src="http://cdn.example.pl/widget.js"></script>
<a href="http://partner.example.com/ubezpieczenia">Ubezpieczenia</a>
```

```html title="Dobrze"
<a href="/wakacje/grecja">Grecja</a>
<img src="https://cdn.example.pl/hotele/kreta.jpg" alt="Hotel na Krecie" />
<script src="https://cdn.example.pl/widget.js"></script>
<a href="https://partner.example.com/ubezpieczenia">Ubezpieczenia</a>
```

## Częste błędy

- Twarde adresy `http://` w treściach z CMS, które przetrwały migrację na HTTPS.
