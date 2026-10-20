---
title: Kod niekrytyczny ładowany po interakcji
priority: high
sources:
  - title: "patterns.dev: Import On Interaction"
    url: https://www.patterns.dev/vanilla/import-on-interaction
---

Czat, mapa, edytor, odtwarzacz czy kalendarz z cenami ładują się dopiero po kliknięciu lub najechaniu na lekką fasadę (facade pattern), zamiast obciążać start strony.

## Dlaczego to ważne

- Widgety czatu i odtwarzacze wideo potrafią ważyć setki KB JS; większość odwiedzających nigdy ich nie otwiera, a wszyscy płacą za ich ładowanie w INP i LCP.
- Fasada (przycisk lub miniatura wyglądające jak widget) daje ten sam efekt wizualny przy ułamku kosztu.
- Rozpoczęcie pobierania przy `pointerenter` lub `focus` ukrywa większość opóźnienia, zanim użytkownik kliknie.

## Jak sprawdzić

Network: zasoby widgetu pojawiają się dopiero po akcji; porównanie TBT i wagi JS przed i po zmianie.

## Kod

```js title="Fasada czatu"
const chatButton = document.querySelector('#chat-facade');
let chatModule;
const loadChat = () => (chatModule ??= import('./chat-widget.js')); // load once

// Start downloading on intent, open on click
chatButton.addEventListener('pointerenter', loadChat, { once: true });
chatButton.addEventListener('focus', loadChat, { once: true });
chatButton.addEventListener('click', async () => {
  chatButton.setAttribute('aria-busy', 'true');
  const { openChat } = await loadChat();
  openChat({ topic: 'rezerwacja' });
  chatButton.removeAttribute('aria-busy');
});
```

## Częste błędy

- Fasada, która po kliknięciu tylko ładuje widget, ale wymaga drugiego kliknięcia, by go otworzyć.
