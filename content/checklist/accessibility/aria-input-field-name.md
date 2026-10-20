---
title: Każde pole wejściowe ma dostępną nazwę
priority: critical
sources:
  - title: "W3C Understanding 4.1.2: Name, Role, Value"
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
---

Elementy z rolą pola (`combobox`, `listbox`, `searchbox`, `slider`, `spinbutton`, `textbox`) muszą mieć nazwę, inaczej czytnik ogłosi tylko "pole edycji" bez kontekstu.

## Dlaczego to ważne

- Czytnik ogłosi "pole edycji, puste" lub "suwak, 1500"; użytkownik nie wie, czy wpisuje miasto wylotu, czy datę powrotu.
- `<label for>` działa tylko z natywnymi polami, więc `div` z `role="combobox"` nie dostanie z niego nazwy; potrzebne jest `aria-labelledby` lub `aria-label`.
- Nazwa jest też celem komend głosowych ("kliknij Miasto wylotu" w Voice Control), więc jej brak wyklucza osoby sterujące komputerem głosem.

## Jak sprawdzić

Panel Accessibility w DevTools (Computed name) lub axe (reguła `aria-input-field-name`).

## Kod

```html title="Źle"
<span>Miasto wylotu</span>
<div role="combobox" aria-expanded="false" contenteditable="true"></div>

<label for="guests">Liczba gości</label>
<div id="guests" role="spinbutton" tabindex="0" aria-valuenow="2"></div>
```

```html title="Dobrze"
<span id="from-label">Miasto wylotu</span>
<div role="combobox" aria-labelledby="from-label" aria-expanded="false"
     aria-controls="from-list" contenteditable="true"></div>

<span id="guests-label">Liczba gości</span>
<div role="spinbutton" aria-labelledby="guests-label" tabindex="0"
     aria-valuenow="2" aria-valuemin="1" aria-valuemax="9"></div>
```

## Częste błędy

- Budowanie własnej kontrolki tam, gdzie wystarczy natywny `<input>`, `<select>` lub `<input type="range">` z `<label>`.
