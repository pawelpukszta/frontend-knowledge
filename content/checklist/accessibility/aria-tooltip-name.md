---
title: Tooltip ma dostępną nazwę
priority: medium
---

Element z `role="tooltip"` musi zawierać tekst lub mieć `aria-label`, a element wywołujący powinien wskazywać go przez `aria-describedby`.

## Dlaczego to ważne

- Tooltip wypełniany treścią dopiero po najechaniu myszą jest pusty dla klawiatury i czytnika; `aria-describedby` wskazuje wtedy na nic.
- Tooltip opisuje element, a nie go nazywa: przycisk z samą ikoną nadal potrzebuje własnej nazwy.
- axe przypisuje regułę do WCAG 4.1.2 (A).

## Jak sprawdzić

axe (`aria-tooltip-name`); w panelu Accessibility sprawdź pole Description elementu wywołującego.

## Kod

```html title="Źle"
<button aria-describedby="tip-fee">Opłata serwisowa</button>
<div role="tooltip" id="tip-fee"></div>
<!-- Text injected only on mouseenter -->
```

```html title="Dobrze"
<button aria-describedby="tip-fee">Opłata serwisowa</button>
<!-- Referenced text is used as the description even while hidden -->
<div role="tooltip" id="tip-fee" hidden>Pobierana jednorazowo, 49 zł za rezerwację.</div>
```

## Częste błędy

- Ważne warunki (np. zasady zwrotu) tylko w tooltipie; lepiej pokazać je jako widoczny tekst.
