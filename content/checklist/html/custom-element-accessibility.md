---
title: Dostępne Web Components
priority: medium
---

Własne elementy nie mają wbudowanej semantyki: muszą ustawić rolę i stany (np. przez `ElementInternals`), obsługę klawiatury i focusu oraz udostępnić etykietę.

## Dlaczego to ważne

- `<fav-toggle>` jest dla czytnika anonimowym kontenerem; bez roli i nazwy nie wiadomo, czy to przycisk, przełącznik, czy tekst.
- `ElementInternals` ustawia domyślną rolę i stany ARIA bez dopisywania atrybutów, które autor strony może nadpisać; obsługują to wszystkie główne przeglądarki.
- Shadow DOM przerywa relacje ID: `aria-labelledby` spoza komponentu nie widzi elementów w shadow root, więc etykietę trzeba przekazać atrybutem lub slotem.
- `static formAssociated = true` z `ElementInternals` sprawia, że własne pole działa z `label`, walidacją i wysyłką formularza.

## Jak sprawdzić

Panel Accessibility w DevTools (rola, nazwa, stany) i test klawiaturą oraz czytnikiem ekranu.

## Kod

```ts title="fav-toggle.ts"
// Accessible toggle button as an autonomous custom element
class FavToggle extends HTMLElement {
  #internals = this.attachInternals();

  connectedCallback() {
    this.#internals.role = 'button';
    this.#internals.ariaPressed = 'false';
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    this.addEventListener('click', () => this.toggle());
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(); }
    });
  }

  toggle() {
    const pressed = this.#internals.ariaPressed === 'true';
    this.#internals.ariaPressed = String(!pressed);
  }
}
customElements.define('fav-toggle', FavToggle);
// Usage: <fav-toggle aria-label="Dodaj hotel do ulubionych">♥</fav-toggle>
```

## Częste błędy

- Odtwarzanie zachowania przycisku od zera, gdy wystarczy natywny `<button>` wewnątrz shadow DOM.
- Customized built-ins (`<button is="...">`): Safari ich nie obsługuje.
