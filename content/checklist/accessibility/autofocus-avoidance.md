---
title: Unikaj autofocusu w formularzach
priority: low
---

`autofocus` przenosi użytkownika czytnika w środek strony, z pominięciem kontekstu, a na mobile od razu otwiera klawiaturę. Wyjątek: strony, których jedynym celem jest pole (np. logowanie, wyszukiwarka) oraz pierwszy element w otwartym oknie dialogowym.

## Dlaczego to ważne

- Czytnik zaczyna od pola w środku formularza i pomija nagłówek, opis oferty czy instrukcje nad nim.
- Na telefonie klawiatura ekranowa zasłania pół ekranu, zanim użytkownik zobaczy, co jest na stronie.
- Pole z `autoFocus` w React dostaje focus dopiero po zamontowaniu komponentu; użytkownik, który zaczął już czytać lub przewijać, nagle traci pozycję.

## Jak sprawdzić

Wyszukaj atrybut `autofocus` (w JSX `autoFocus`) w kodzie i oceń każde użycie.

## Kod

```html title="Źle"
<!-- Offer page: focus jumps past the description straight into the form -->
<h1>Kreta, Hersonissos</h1>
<p>Opis oferty...</p>
<input id="promo" autofocus placeholder="Kod rabatowy" />
```

```html title="Dobrze"
<!-- Inside a dialog the first useful control may get focus -->
<dialog id="search-dialog">
  <label for="q">Szukaj kierunku</label>
  <input id="q" type="search" autofocus />
</dialog>
```
