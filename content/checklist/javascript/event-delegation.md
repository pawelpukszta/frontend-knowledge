---
title: Delegacja zdarzeń
priority: medium
---

Jeden listener na kontenerze zamiast setek na elementach listy: mniej pamięci i obsługa elementów dodanych dynamicznie.

## Dlaczego to ważne

- Lista 500 ofert z osobnym listenerem na każdym przycisku to 500 funkcji w pamięci i dłuższe przypinanie przy każdym przerenderowaniu.
- Elementy dociągnięte przy "pokaż więcej" automatycznie działają, bez ponownego podpinania handlerów.
- Jedno miejsce obsługi akcji upraszcza sprzątanie: usunięcie jednego listenera zamiast śledzenia setek.

## Jak sprawdzić

Przegląd kodu list i tabel; w DevTools Elements zakładka Event Listeners pokazuje, gdzie podpięto handlery.

## Kod

```js
const list = document.querySelector("#offers");

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || !list.contains(button)) return;

  const { action, offerId } = button.dataset;
  if (action === "favorite") toggleFavorite(offerId);
  if (action === "book") startBooking(offerId);
});
// focus/blur do not bubble: delegate with focusin/focusout instead
```

## Częste błędy

- Sprawdzanie `event.target.matches(...)` bez `closest()`; kliknięcie w ikonę wewnątrz przycisku nie zostanie obsłużone.
