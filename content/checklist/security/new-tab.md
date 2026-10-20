---
title: Bezpieczne linki target="_blank"
priority: medium
sources:
  - title: "OWASP: HTML5 Security Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
---

`rel="noopener noreferrer"` przy linkach otwieranych w nowej karcie, a dla `window.open` cecha `noopener`. Współczesne przeglądarki stosują `noopener` domyślnie dla `target="_blank"`, ale jawny atrybut nie zaszkodzi, a `noreferrer` chroni też przed wyciekiem adresu.

## Dlaczego to ważne

- Bez `noopener` otwarta strona dostaje `window.opener` i może przekierować Twoją kartę na fałszywą stronę logowania (tabnabbing); użytkownik po powrocie nie zauważy podmiany.
- Domyślne `noopener` nie obejmuje `window.open()` bez odpowiedniej cechy ani starszych przeglądarek i webview.
- Otwieranie nowych kart bez ostrzeżenia dezorientuje użytkowników czytników ekranu; warto to zasygnalizować w treści lub ikoną z tekstem alternatywnym.

## Jak sprawdzić

Wyszukaj `target="_blank"` i `window.open(` w kodzie; lintery (np. ESLint `react/jsx-no-target-blank`) wychwytują brak `rel`.

## Kod

```html title="Link do serwisu zewnętrznego"
<a href="https://www.gov.pl/web/dyplomacja/grecja" target="_blank" rel="noopener noreferrer">
  Informacje MSZ dla podróżujących
  <span class="visually-hidden">(otwiera się w nowej karcie)</span>
</a>
```

```js title="window.open"
// Bad: the new page gets window.opener and can redirect this tab
window.open('https://partner.example.com/ubezpieczenie', '_blank');

// Good: with noopener the call returns null, the new page has no handle to this tab
window.open('https://partner.example.com/ubezpieczenie', '_blank', 'noopener,noreferrer');
```

## Częste błędy

- Dodanie `noreferrer` do linków partnerskich, które rozliczają się po nagłówku `Referer`, bez uzgodnienia innego sposobu atrybucji.
