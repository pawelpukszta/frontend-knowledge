---
title: Przełączniki mają dostępną nazwę
priority: medium
---

Elementy z rolą `checkbox`, `switch`, `radio`, `menuitemcheckbox` czy `menuitemradio` muszą mieć nazwę opisującą, co przełączają.

## Dlaczego to ważne

- Czytnik ogłosi "przełącznik, wyłączony" bez informacji, co jest wyłączane; przy kilku przełącznikach w ustawieniach powiadomień użytkownik zgaduje.
- Opis obok przełącznika nie wystarczy, jeśli nie jest z nim powiązany przez `<label>` lub `aria-labelledby`; bliskość na ekranie nic nie znaczy dla czytnika.
- axe przypisuje regułę do WCAG 4.1.2 (A).

## Jak sprawdzić

axe (`aria-toggle-field-name`).

## Kod

```html title="Źle"
<span>Powiadomienia SMS o zmianie ceny</span>
<button role="switch" aria-checked="false"></button>
```

```html title="Dobrze"
<span id="sms-label">Powiadomienia SMS o zmianie ceny</span>
<button role="switch" aria-checked="false" aria-labelledby="sms-label"></button>

<!-- Native checkbox exposed as a switch -->
<label><input type="checkbox" role="switch"> Powiadomienia e-mail</label>
```

## Częste błędy

- Nazwa opisująca stan zamiast funkcji ("Włączone"); stan ogłasza `aria-checked`, nazwa ma mówić, czego dotyczy.
