---
title: Prosty, zrozumiały język
priority: medium
---

Krótkie zdania, znane słowa, objaśnione skróty. Pomaga osobom z niepełnosprawnościami poznawczymi, obcokrajowcom i wszystkim czytającym w pośpiechu.

## Dlaczego to ważne

- Większość ludzi skanuje stronę zamiast ją czytać; krótkie zdania z najważniejszą informacją na początku są zrozumiane od razu.
- Żargon branżowy ("OWU", "TFG", "dopłata paliwowa wg taryfy") rodzi pytania do infolinii i porzucone rezerwacje.
- Prosty język to część wytycznych WCAG 3.1 (np. 3.1.4 skróty, 3.1.5 poziom czytania, AAA) i wymóg dla wielu serwisów publicznych.

## Jak sprawdzić

Oceń czytelność (np. indeks FOG dla polskiego, narzędzie Jasnopis) i poproś kogoś spoza projektu o przeczytanie kluczowych ekranów.

## Kod

```html title="Źle"
<p>Zgodnie z OWU rezygnacja z imprezy turystycznej po terminie wskazanym w § 7 ust. 3 skutkuje
  naliczeniem kosztów anulacji w wysokości uzależnionej od terminu złożenia dyspozycji.</p>
```

```html title="Dobrze"
<p>Możesz zrezygnować z wyjazdu w każdej chwili. Opłata zależy od tego, ile dni zostało do wylotu:</p>
<ul>
  <li>30 dni lub więcej: 10% ceny,</li>
  <li>mniej niż 30 dni: 50% ceny.</li>
</ul>
<p>Szczegóły: <a href="/owu#rezygnacja"><abbr title="Ogólne Warunki Uczestnictwa">OWU</abbr>, rezygnacja z wyjazdu</a>.</p>
```

## Częste błędy

- Upraszczanie przez usuwanie ważnych informacji zamiast przez lepszą strukturę (listy, nagłówki, przykłady).
