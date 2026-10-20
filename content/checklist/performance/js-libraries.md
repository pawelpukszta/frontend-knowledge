---
title: Bezpieczne, aktualne biblioteki JS
priority: medium
---

Przestarzałe biblioteki (np. stare jQuery, nieutrzymywane pluginy) mają znane podatności i często zbędną wagę. Aktualizuj je regularnie lub zastępuj natywnymi API przeglądarki.

## Dlaczego to ważne

- Znane podatności (np. XSS w starszych wersjach jQuery) są publicznie opisane i łatwe do wykorzystania przez automatyczne skanery.
- Wiele dawnych zastosowań jQuery, Moment.js czy bibliotek AJAX pokrywają dziś natywne `querySelectorAll`, `fetch`, `Intl.DateTimeFormat`, co pozwala zejść o dziesiątki KB.
- Odkładanie aktualizacji sprawia, że skok o kilka wersji głównych staje się dużym, ryzykownym projektem zamiast rutyny.

## Jak sprawdzić

`npm audit`, Retire.js, Dependabot lub Renovate w repozytorium; przegląd bundla pod kątem bibliotek, które da się zastąpić natywnym API.

## Kod

```bash title="Audyt zależności"
npm audit --omit=dev      # known vulnerabilities in production dependencies
npx retire --path dist    # scans built JS for vulnerable library versions
npm outdated              # versions behind latest
```

```js title="Natywne API zamiast jQuery"
// Before: $('.offer-card').addClass('is-visible'); $.getJSON('/api/offers', render);
document.querySelectorAll('.offer-card').forEach((el) => el.classList.add('is-visible'));
const offers = await fetch('/api/offers').then((r) => r.json());
const price = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(2499);
```

## Częste błędy

- Ładowanie jQuery z CDN tylko dla jednego pluginu karuzeli.
