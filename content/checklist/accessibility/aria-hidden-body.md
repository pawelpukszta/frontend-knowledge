---
title: Nie ustawiaj aria-hidden na body
priority: critical
---

`aria-hidden="true"` na `<body>` ukrywa całą stronę przed czytnikami ekranu, choć nadal da się ją obsługiwać klawiaturą. Zdarza się to przy źle zaimplementowanych modalach, które "ukrywają tło", lub w skryptach, które nie sprzątają po sobie.

## Dlaczego to ważne

- Dla niewidomego użytkownika serwis przestaje istnieć: czytnik nie ma czego ogłosić, a Tab nadal przesuwa niewidoczny dla niego focus.
- Modal renderowany przez portal wewnątrz `<body>` również znika, bo `aria-hidden` obejmuje wszystkich potomków i dziecko nie może się "odkryć" przez `aria-hidden="false"`.
- axe przypisuje regułę do WCAG 1.3.1 i 4.1.2 (poziom A).

## Jak sprawdzić

axe-core (reguła `aria-hidden-body`) lub ręcznie w panelu Elements przy otwartym i po zamknięciu modala.

## Kod

```html title="Źle"
<body aria-hidden="true">
  <main>...</main>
  <div role="dialog" aria-modal="true" aria-labelledby="t">...</div>
</body>
```

```html title="Dobrze"
<body>
  <!-- dialog.showModal() makes everything outside the dialog inert automatically -->
  <div id="app">...</div>
  <dialog id="booking-dialog" aria-labelledby="booking-title">
    <h2 id="booking-title">Potwierdź rezerwację</h2>
  </dialog>
  <!-- Custom modal instead: set inert on #app only while it is open -->
</body>
```

## Częste błędy

- Biblioteka modali ustawia `aria-hidden` na tle, ale nie usuwa go, gdy komponent zostanie odmontowany w trakcie animacji zamykania.
