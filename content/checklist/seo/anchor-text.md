---
title: Opisowy tekst kotwic linków
priority: medium
---

Tekst linku mówi, czego dotyczy strona docelowa ("oferty last minute do Grecji"), a nie "kliknij tutaj". Pomaga to wyszukiwarkom i użytkownikom, także czytników ekranu.

## Dlaczego to ważne

- Google wykorzystuje tekst kotwic do zrozumienia strony docelowej; to nawet jedno ze źródeł, z których powstaje tytuł w wynikach.
- Użytkownicy czytników ekranu często przeglądają samą listę linków; dziesięć razy "więcej" nic im nie mówi (WCAG 2.4.4 Link Purpose).
- Opisowe kotwice ułatwiają skanowanie tekstu wzrokiem: czytelnik wie, dokąd prowadzi link, zanim kliknie.

## Jak sprawdzić

Crawler (np. Screaming Frog) z raportem tekstów kotwic: szukaj "kliknij tutaj", "więcej", "link" oraz pustych kotwic (np. same ikony).

## Kod

```html title="Źle"
<p>Szukasz tanich wakacji? <a href="/grecja/last-minute">Kliknij tutaj</a>.</p>
<!-- Icon-only link: empty accessible name and no anchor text -->
<a href="/kreta"><svg aria-hidden="true"><use href="#icon-arrow"/></svg></a>
```

```html title="Dobrze"
<p>Zobacz <a href="/grecja/last-minute">oferty last minute do Grecji</a> z wylotem w tym tygodniu.</p>
<a href="/kreta">
  <svg aria-hidden="true"><use href="#icon-arrow"/></svg>
  <span class="visually-hidden">Wakacje na Krecie</span>
</a>
```

## Częste błędy

- Upychanie dokładnej frazy w każdej kotwicy ("tanie wakacje Grecja tanie") wygląda na manipulację.
