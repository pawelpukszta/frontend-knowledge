---
title: Unikalne nazwy tabel
priority: medium
---

Gdy na stronie jest kilka tabel, ich `<caption>` lub `aria-label` powinny się różnić; `caption` i przestarzały atrybut `summary` nie powinny być identyczne.

## Dlaczego to ważne

- Lista tabel w czytniku z trzema pozycjami "Cennik" nie pozwala wybrać właściwej.
- Identyczne `caption` i `summary` sprawiają, że czytnik powtarza ten sam tekst dwa razy, nic nie dodając.

## Jak sprawdzić

axe (`table-duplicate-name`); przejrzyj wszystkie `caption` na stronie z wieloma tabelami.

## Kod

```html title="Dobrze"
<table>
  <caption>Cennik: hotel Stella Village, lipiec 2027</caption>
  <!-- ... -->
</table>
<table>
  <caption>Cennik: hotel Stella Village, sierpień 2027</caption>
  <!-- ... -->
</table>
```

## Częste błędy

- Używanie `summary` w nowym kodzie; atrybut jest przestarzały w HTML, opis umieść w `caption` lub tekście obok i powiąż przez `aria-describedby`.
