---
title: Treść łatwa do przetworzenia przez modele AI
priority: medium
sources:
  - title: "Google: AI features and your website"
    url: https://developers.google.com/search/docs/appearance/ai-features
---

Semantyczne nagłówki, krótkie akapity, listy i tabele, zdania zrozumiałe bez kontekstu oraz treść obecna w początkowym HTML (nie tylko po JS) ułatwiają wykorzystanie strony w AI Overviews, AI Mode i asystentach AI.

## Dlaczego to ważne

- Google nie stawia osobnych wymagań dla funkcji AI: strona musi być zaindeksowana i kwalifikować się do snippetu, a ważna treść ma być dostępna jako tekst.
- Wiele crawlerów AI nie wykonuje JavaScriptu; treść renderowana wyłącznie po stronie klienta jest dla nich niewidoczna.
- Odpowiedź w pierwszym zdaniu sekcji ("Do Grecji wjedziesz na dowód osobisty") łatwo zacytować; ta sama informacja rozmyta w trzech akapitach przepada.

## Jak sprawdzić

Wyłącz JavaScript (DevTools, Command Menu, "Disable JavaScript") lub obejrzyj źródło strony; sprawdź hierarchię nagłówków i czy kluczowe fakty są tekstem, a nie obrazkiem.

## Kod

```html title="Źle"
<div class="content" id="docs"></div>
<script>
  // Content exists only after client-side fetch: invisible to non-JS crawlers
  fetch('/api/docs/grecja').then((r) => r.json()).then(renderDocs);
</script>
```

```html title="Dobrze"
<section>
  <h2>Jaki dokument jest potrzebny do Grecji?</h2>
  <p>Obywatel Polski wjedzie do Grecji na ważny dowód osobisty lub paszport.</p>
  <ul>
    <li>Dziecko potrzebuje własnego dokumentu, wpis w paszporcie rodzica nie wystarczy.</li>
    <li>Dokument musi być ważny przez cały pobyt.</li>
  </ul>
</section>
```

## Częste błędy

- Dodawanie schematu FAQPage "pod AI"; Google usunął wyniki rozszerzone FAQ w maju 2026 i nie wymaga specjalnego schema ani plików typu llms.txt dla funkcji AI.
- Blokowanie tokenu `Google-Extended` w robots.txt w przekonaniu, że wyłączy to AI Overviews; nie wpływa on na wyszukiwarkę.
