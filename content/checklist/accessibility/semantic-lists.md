---
title: Powiązane elementy jako listy
priority: medium
---

Menu, listy ofert, kroki procesu oznaczaj jako `ul`/`ol`/`dl`. Czytnik ogłosi "lista, 8 elementów", co pomaga zorientować się w treści.

## Dlaczego to ważne

- Informacja o liczbie elementów pozwala zdecydować, czy przeglądać wyniki, czy od razu zawęzić filtry.
- Czytniki pozwalają przeskoczyć całą listę jednym klawiszem (NVDA: L), zamiast przechodzić 20 kart po kolei.
- `ol` dla kroków procesu (np. rezerwacji) przekazuje kolejność, a nie tylko wygląd numerków.

## Jak sprawdzić

Przegląd DOM: powtarzające się elementy w samych `<div>` to sygnał do poprawy.

## Kod

```html title="Dobrze"
<h2>Wyniki wyszukiwania: 24 oferty</h2>
<ul class="offer-list" role="list"> <!-- role="list" restores semantics in Safari when list-style is none -->
  <li><article><h3>Kreta, Hersonissos</h3><p>od 3499 zł</p></article></li>
  <li><article><h3>Rodos, Lindos</h3><p>od 3199 zł</p></article></li>
</ul>

<ol class="steps">
  <li aria-current="step">Wybór pokoju</li>
  <li>Dane podróżnych</li>
  <li>Płatność</li>
</ol>
```

## Częste błędy

- Zapominanie, że Safari z VoiceOver może nie ogłaszać listy z `list-style: none`; jeśli liczba elementów jest ważna, dodaj `role="list"`.
