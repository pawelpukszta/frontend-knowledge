---
title: Działanie mimo blokowanych domen śledzących
priority: low
---

Znaczna część użytkowników (szacunki: 20-40% na desktopie) ma bloker reklam. Strona nie może się psuć, gdy analityka, tag manager czy skrypty marketingowe zostaną zablokowane (np. brak obsługi błędu `gtag` blokuje przycisk).

## Dlaczego to ważne

- Najczęstszy scenariusz: wysyłka formularza lub przejście dalej czeka na callback analityki, który przy zablokowanym skrypcie nigdy nie nastąpi, więc przycisk "Rezerwuj" nic nie robi.
- Wywołanie nieistniejącej funkcji (`gtag is not defined`) przerywa cały handler, w tym logikę biznesową po nim.
- Użytkownicy z blokerami to często osoby technicznie świadome i wartościowi klienci; ich utracone rezerwacje nie pojawią się nawet w statystykach, bo analityka jest zablokowana.

## Jak sprawdzić

Test z uBlock Origin lub blokowaniem domen w DevTools (Network request blocking): kluczowe ścieżki (wyszukiwanie, rezerwacja, płatność) muszą działać.

## Kod

```js title="Źle"
form.addEventListener('submit', (e) => {
  e.preventDefault();
  gtag('event', 'begin_checkout', {
    event_callback: () => form.submit(), // never fires when gtag is blocked
  });
});
```

```js title="Dobrze"
function track(name, params) {
  try {
    window.gtag?.('event', name, { ...params, transport_type: 'beacon' });
  } catch {
    // analytics must never break the flow
  }
}

form.addEventListener('submit', () => {
  track('begin_checkout', { value: 3499, currency: 'PLN' });
  // no preventDefault: the form submits normally
});
```

## Częste błędy

- Ładowanie kluczowych funkcji (np. czatu obsługi klienta lub płatności) przez tag manager.
