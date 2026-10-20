---
title: Logiczna hierarchia nagłówków
priority: critical
sources:
  - title: "W3C Understanding 2.4.6: Headings and Labels"
    url: https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html
---

Jeden `h1` z tematem strony, a pod nim `h2`, `h3` bez przeskakiwania poziomów. Użytkownicy czytników nawigują po nagłówkach jak po spisie treści.

## Dlaczego to ważne

- Według ankiet WebAIM większość użytkowników czytników ekranu szuka informacji na nowej stronie właśnie skacząc po nagłówkach (klawisz H w NVDA i JAWS).
- Nagłówki z `div class="title"` są dla czytnika zwykłym tekstem; strona wygląda na uporządkowaną, ale "spisu treści" nie ma.
- Czytelna hierarchia pomaga też wyszukiwarkom i narzędziom AI zrozumieć, o czym są poszczególne sekcje strony.

## Jak sprawdzić

Rozszerzenie typu HeadingsMap lub lista nagłówków w czytniku ekranu (NVDA: Insert+F7, zakładka Nagłówki); sprawdź, czy sam konspekt opisuje stronę.

## Kod

```html title="Dobrze"
<h1>Wakacje w Grecji 2027</h1>
  <h2>Najpopularniejsze kierunki</h2>
    <h3>Kreta</h3>
    <h3>Rodos</h3>
  <h2>Oferty last minute</h2>
    <h3>Korfu, 7 nocy od 2899 zł</h3>
  <h2>Praktyczne informacje</h2>
    <h3>Pogoda i najlepszy termin</h3>
    <h3>Dokumenty i waluta</h3>
```

## Częste błędy

- Wybieranie poziomu nagłówka po wielkości czcionki zamiast po miejscu w strukturze.
- Zakładanie, że `<section>` "resetuje" poziomy: algorytm outline z HTML5 nigdy nie zadziałał w przeglądarkach i został usunięty ze specyfikacji.
