---
title: Bez stylów inline i osadzonych
priority: high
---

Style w atrybutach `style` i blokach `<style>` w treści strony są trudne w utrzymaniu, nie są cache'owane i komplikują CSP. Wyjątek: wygenerowany w buildzie krytyczny CSS w head.

## Dlaczego to ważne

- Atrybut `style` ma najwyższą specyficzność poza `!important`, więc nadpisanie go z arkusza wymaga kolejnych `!important` i rozpoczyna wyścig specyficzności.
- Restrykcyjne CSP (`style-src 'self'`) blokuje atrybuty `style` i bloki `<style>`; inline style zmuszają do dodania `'unsafe-inline'`, co osłabia ochronę przed wstrzykiwaniem treści.
- Style w zewnętrznym pliku są pobierane raz i cache'owane między stronami; te same reguły wklejone w HTML są przesyłane przy każdym wejściu.

## Jak sprawdzić

Wyszukaj `style=` i `<style>` w szablonach i komponentach (np. `rg 'style="' src/`); w DevTools Elements reguły inline są oznaczone jako `element.style`.

## Kod

```html title="Źle"
<div class="offer" style="padding: 16px; color: #c00; font-weight: 700">
  Last minute: Kreta, 2 499 zł
</div>
```

```css title="Dobrze"
/* offer.css: one class, reusable and cacheable */
.offer--last-minute {
  padding: var(--space-4);
  color: var(--color-danger);
  font-weight: 700;
}
/* Dynamic values: set a custom property from JS (el.style.setProperty), CSP-safe */
.progress-bar { inline-size: var(--progress, 0%); }
```

## Częste błędy

- Przekazywanie wartości dynamicznych przez `style={{...}}` tam, gdzie wystarczy klasa modyfikatora lub atrybut `data-*`.
- Ręcznie wklejony "krytyczny CSS", który z czasem rozjeżdża się z arkuszem głównym.
