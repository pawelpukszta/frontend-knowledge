---
title: Speculation Rules dla następnych stron
priority: low
sources:
  - title: "Chrome: Prerender pages"
    url: https://developer.chrome.com/docs/web-platform/prerender-pages
---

Deklaratywny prefetch lub prerender prawdopodobnych nawigacji (`<script type="speculationrules">`) daje niemal natychmiastowe przejścia. Wyklucz strony z efektami ubocznymi (wylogowanie, koszyk) i uwzględnij koszt serwera.

## Dlaczego to ważne

- Prerenderowana strona wyświetla się po kliknięciu praktycznie od razu, a LCP takiej nawigacji jest bliski zeru.
- Ustawienie `eagerness: "moderate"` startuje spekulację po krótkim najechaniu kursorem lub przy tapnięciu, więc marnuje mało zasobów.
- To progressive enhancement: wspierają to przeglądarki oparte na Chromium, pozostałe po prostu ignorują skrypt.

## Jak sprawdzić

DevTools → Application → Speculative loads (lista reguł i stan spekulacji); w logach serwera nagłówek `Sec-Purpose: prefetch` lub `prefetch;prerender`.

## Kod

```html
<script type="speculationrules">
{
  "prerender": [{
    "where": {
      "and": [
        { "href_matches": "/hotele/*" },
        { "not": { "selector_matches": ".no-prerender" } }
      ]
    },
    "eagerness": "moderate"
  }],
  "prefetch": [{ "where": { "href_matches": "/wakacje/*" }, "eagerness": "conservative" }]
}
</script>
```

## Częste błędy

- Prerender stron, które przy otwarciu zliczają odsłonę, zmieniają stan lub zużywają limity API bez sprawdzenia `document.prerendering`.
