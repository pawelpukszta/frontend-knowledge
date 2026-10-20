---
title: Bez upychania słów kluczowych
priority: medium
sources:
  - title: "Google: Spam policies (keyword stuffing)"
    url: https://developers.google.com/search/docs/essentials/spam-policies
---

Nienaturalne powtarzanie fraz w treści, nagłówkach, tekstach alternatywnych czy ukrytym tekście narusza zasady Google dotyczące spamu i pogarsza czytelność.

## Dlaczego to ważne

- Upychanie słów kluczowych jest wprost wymienione w politykach spamu Google; może skutkować spadkiem pozycji lub działaniem ręcznym.
- Współczesne systemy rozumieją synonimy i kontekst; dziesiąte powtórzenie "tanie wakacje Turcja" nic nie dodaje.
- Tekst pisany pod frazę zniechęca czytelnika i obniża konwersję.

## Jak sprawdzić

Przeczytaj tekst na głos; sprawdź gęstość fraz w narzędziu SEO i przejrzyj atrybuty `alt`, `title` oraz ukryte elementy.

## Kod

```html title="Źle"
<h1>Tanie wakacje Turcja: tanie wakacje w Turcji last minute</h1>
<p>Tanie wakacje Turcja to najlepsze tanie wakacje. Szukasz: tanie wakacje Turcja? Mamy tanie wakacje Turcja!</p>
<img src="/img/side.webp" alt="tanie wakacje turcja tanie wczasy turcja last minute turcja">
<div style="display:none">Antalya Side Alanya Kemer Bodrum Marmaris Belek</div>
```

```html title="Dobrze"
<h1>Tanie wakacje w Turcji: oferty do 3000 zł za osobę</h1>
<p>Zebraliśmy wyjazdy all inclusive do Side, Alanyi i Kemer z wylotem z Warszawy i Katowic.</p>
<img src="/img/side.webp" alt="Plaża w Side z widokiem na hotelowy basen">
```

## Częste błędy

- Listy miast lub fraz w stopce dodane "dla SEO".
