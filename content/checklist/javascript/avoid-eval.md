---
title: Nigdy eval() ani new Function()
priority: critical
---

Wykonywanie kodu ze stringów otwiera drogę do XSS, uniemożliwia restrykcyjne CSP i optymalizacje silnika. Dotyczy też `setTimeout('string')`.

## Dlaczego to ważne

- Jeśli do `eval` trafi choćby fragment danych od użytkownika lub z URL, atakujący wykonuje dowolny kod w kontekście zalogowanej sesji: kradnie dane, składa zamówienia.
- Użycie `eval` wymaga `'unsafe-eval'` w CSP, co osłabia ochronę całej aplikacji, także w miejscach bez `eval`.
- Silnik JS nie może zoptymalizować funkcji zawierającej `eval`, bo nie wie, jakie zmienne zostaną odczytane.

## Jak sprawdzić

ESLint (`no-eval`, `no-implied-eval`, `no-new-func`); CSP bez `'unsafe-eval'` w trybie report-only pokaże naruszenia także z bibliotek.

## Kod

```js title="Źle"
const value = eval("booking." + fieldName);
setTimeout("refreshPrices()", 1000);
const fn = new Function("a", "b", userFormula);
```

```js title="Dobrze"
const value = Object.hasOwn(booking, fieldName) ? booking[fieldName] : undefined;
setTimeout(refreshPrices, 1000);
// Map of allowed operations instead of executing user-provided code
const operations = { sum: (a, b) => a + b, max: Math.max };
const result = operations[op]?.(a, b);
```

## Częste błędy

- Biblioteki szablonów lub walidatorów, które w środku używają `new Function`; sprawdź je przy wprowadzaniu CSP.
