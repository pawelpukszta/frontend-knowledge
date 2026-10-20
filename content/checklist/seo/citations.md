---
title: Cytuj wiarygodne źródła
priority: medium
---

Linki do źródeł pierwotnych (urzędy, przepisy, badania, oficjalna dokumentacja) przy konkretnych twierdzeniach uwiarygadniają treść i pozwalają czytelnikowi ją sprawdzić.

## Dlaczego to ważne

- Wytyczne dla oceniających jakość traktują poparcie twierdzeń źródłami jako sygnał wiarygodności, zwłaszcza w tematach YMYL.
- Źródło pierwotne (np. rozporządzenie UE 261/2004 o prawach pasażerów) jest stabilniejsze niż cudzy wpis na blogu i łatwiej sprawdzić, czy przepis się zmienił.
- Przypisy ułatwiają redakcji okresową weryfikację: wiadomo, co sprawdzić, gdy zmienią się przepisy lub ceny.

## Jak sprawdzić

Przejrzyj kluczowe artykuły: czy każda liczba, przepis i obietnica ma link do źródła i czy linki działają (crawler: linki zewnętrzne z kodem 4xx/5xx).

## Kod

```html
<p>
  Przy opóźnieniu lotu o co najmniej 3 godziny przysługuje odszkodowanie od 250 do 600 euro
  <sup><a href="#zrodlo-1" id="ref-1">[1]</a></sup>.
</p>
<figure>
  <blockquote cite="https://www.gov.pl/web/dyplomacja/grecja">
    <p>Obywatele RP mogą wjechać do Grecji na podstawie dowodu osobistego.</p>
  </blockquote>
  <figcaption>Źródło: <cite><a href="https://www.gov.pl/web/dyplomacja/grecja">MSZ, Polak za granicą</a></cite></figcaption>
</figure>
<ol class="sources">
  <li id="zrodlo-1"><a href="https://eur-lex.europa.eu/eli/reg/2004/261/oj">Rozporządzenie (WE) nr 261/2004, art. 7</a></li>
</ol>
```

## Częste błędy

- Linkowanie do agregatora lub innego bloga zamiast do źródła pierwotnego.
- "Badania pokazują, że..." bez wskazania, jakie to badania.
