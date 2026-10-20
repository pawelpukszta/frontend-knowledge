---
title: Opisowy tekst linków
priority: high
---

Tekst linku mówi, dokąd prowadzi, także wyrwany z kontekstu (czytniki pokazują listę linków). Zamiast "Kliknij tutaj" lub "Więcej": "Zobacz oferty na Krecie".

## Dlaczego to ważne

- Użytkownicy czytników ekranu często przeglądają samą listę linków; dziesięć pozycji "Więcej" nie mówi nic o tym, która oferta jest która.
- Osoby sterujące głosem wypowiadają tekst linku ("kliknij Oferty na Krecie"); przy wielu linkach "Więcej" polecenie jest niejednoznaczne.
- Opisowy tekst kotwicy to też sygnał dla Google o treści strony docelowej, a dla wszystkich szybsze skanowanie wzrokiem.

## Jak sprawdzić

Wygeneruj listę linków w czytniku ekranu (NVDA: Insert+F7, VoiceOver: rotor VO+U) i oceń, czy każdy link jest zrozumiały bez otaczającego tekstu.

## Kod

```html title="Źle"
<h3>Kreta, Hersonissos</h3>
<p>7 nocy, all inclusive, od 3499 zł. <a href="/oferty/kreta-123">Kliknij tutaj</a></p>
<a href="/oferty/rodos-456">Więcej</a>
```

```html title="Dobrze"
<h3>Kreta, Hersonissos</h3>
<p>7 nocy, all inclusive, od 3499 zł.</p>
<a href="/oferty/kreta-123">Zobacz ofertę: Kreta, Hersonissos</a>

<!-- Short visible text, full name for screen readers via hidden suffix -->
<a href="/oferty/rodos-456">Więcej<span class="visually-hidden"> o ofercie Rodos, Lindos</span></a>
```

## Częste błędy

- Pełny adres URL jako tekst linku; czytnik literuje go znak po znaku.
- Ten sam tekst ("Szczegóły") dla linków prowadzących w różne miejsca.
