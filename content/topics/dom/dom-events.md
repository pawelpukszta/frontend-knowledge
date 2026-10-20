---
title: "Zdarzenia: capturing, bubbling, delegacja"
level: mid
tags:
  - events
  - bubbling
  - capturing
  - delegation
  - preventDefault
summary: "Zdarzenie przechodzi trzy fazy: capturing (z góry w dół), target, bubbling (z dołu w górę). Delegacja zdarzeń wykorzystuje bubbling: jeden listener na rodzicu obsługuje wiele dzieci."
sources:
  - title: "MDN: Event bubbling"
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling
  - title: "MDN: addEventListener()"
    url: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  - title: "javascript.info: Bubbling and capturing"
    url: https://javascript.info/bubbling-and-capturing
---

## Wyjaśnienie

- **Capturing**: od `window` w dół do celu. Listener z `{ capture: true }`.
- **Target**: zdarzenie na elemencie docelowym.
- **Bubbling**: od celu w górę. Domyślna faza dla `addEventListener`. Nie wszystkie zdarzenia "bąbelkują" (np. `focus`, ale jest `focusin`).
- `event.target`: element, na którym zdarzenie wystąpiło. `event.currentTarget`: element z listenerem.
- `stopPropagation()`: zatrzymuje propagację. `preventDefault()`: blokuje domyślne zachowanie (np. wysłanie formularza).
- **Delegacja**: jeden listener na kontenerze + `event.target.closest('.item')`. Mniej listenerów, działa dla dynamicznie dodanych elementów.
- Opcje: `{ once: true }`, `{ passive: true }` (listener nie wywoła `preventDefault`, co poprawia płynność scrolla), `{ signal }` (usuwanie przez AbortController).

React podpina listenery na korzeniu aplikacji (delegacja) i używa własnego systemu zdarzeń syntetycznych.

## Kod

```js
document.querySelector('#offer-list').addEventListener('click', (e) => {
  const card = e.target.closest('[data-offer-id]');
  if (!card) return;
  openOffer(card.dataset.offerId);
});

const controller = new AbortController();
window.addEventListener('scroll', onScroll, { passive: true, signal: controller.signal });
controller.abort(); // removes the listener
```

## Pytania

### Czym jest event bubbling? {#dom-events-q1}

Po obsłużeniu zdarzenia na elemencie docelowym zdarzenie "wędruje" w górę drzewa DOM przez kolejnych przodków, uruchamiając ich listenery. Przed nim zachodzi faza capturing (z góry w dół).

### Czym jest delegacja zdarzeń i jakie ma zalety? {#dom-events-q2}

Podpięcie jednego listenera na wspólnym rodzicu zamiast na każdym dziecku; element źródłowy rozpoznaje się przez `event.target` (np. `closest()`). Zalety: mniej pamięci, obsługa elementów dodanych dynamicznie, prostsze sprzątanie.

### target vs currentTarget? {#dom-events-q3}

`target` to element, który zapoczątkował zdarzenie (np. `<span>` w przycisku). `currentTarget` to element, do którego podpięty jest aktualnie wykonywany listener.
