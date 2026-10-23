---
title: XMLHttpRequest, fetch i AJAX
level: mid
added: 2026-10-20
tags:
  - XMLHttpRequest
  - XHR
  - fetch
  - AJAX
  - axios
summary: XMLHttpRequest to starsze API do asynchronicznych zapytań HTTP bez przeładowania strony (fundament AJAX). Nowoczesny odpowiednik to fetch oparty na Promise.
sources:
  - title: "MDN: XMLHttpRequest"
    url: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  - title: "WHATWG: XMLHttpRequest Living Standard"
    url: https://xhr.spec.whatwg.org/
  - title: "MDN: Using the Fetch API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  - title: "WHATWG: Fetch Living Standard"
    url: https://fetch.spec.whatwg.org/
  - title: "MDN Glossary: AJAX"
    url: https://developer.mozilla.org/en-US/docs/Glossary/AJAX
---

## Wyjaśnienie

**AJAX** (Asynchronous JavaScript and XML) to technika, a nie konkretne API: strona pobiera lub wysyła dane w tle i aktualizuje fragment widoku bez przeładowania. Nazwa pochodzi z czasów, gdy dane przesyłano w XML; dziś zwykle w JSON.

**XMLHttpRequest (XHR)**:

- API oparte na zdarzeniach (`onload`, `onerror`, `onreadystatechange`, `readyState` 0-4).
- Ma rzeczy, których `fetch` długo nie miał: zdarzenie **`upload.onprogress`** (postęp wysyłania pliku), `timeout`, `abort()`.
- Wersja synchroniczna (`open(..., false)`) jest przestarzała: blokuje wątek główny.
- Na nim oparte są m.in. axios (w przeglądarce) i starsze biblioteki (jQuery `$.ajax`).

**fetch**:

- Oparty na Promise, współpracuje z `async/await`, standard WHATWG Fetch; dostępny także w Node.js 18+.
- `Request`, `Response`, `Headers`, strumienie (`response.body`), anulowanie przez `AbortController`, `AbortSignal.timeout()`.
- **Nie odrzuca** Promise dla 4xx/5xx; sprawdzaj `response.ok`.
- Cookies cross-origin tylko z `credentials: 'include'`.
- Postęp pobierania da się liczyć ze strumienia; postęp wysyłania wciąż najprościej obsłużyć przez XHR.

## Kod

```js
// XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/offers');
xhr.responseType = 'json';
xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) render(xhr.response);
  else showError(xhr.status);
};
xhr.onerror = () => showError('network');
xhr.send();

// Upload progress: still a good reason to use XHR
xhr.upload.onprogress = (e) => setProgress(e.loaded / e.total);

// fetch
const res = await fetch('/api/offers', { signal: AbortSignal.timeout(5000) });
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const offers = await res.json();
```

## Pytania

### Czym jest XMLHttpRequest? {#http-xhr-fetch-q1}

Wbudowanym API przeglądarki do asynchronicznych zapytań HTTP bez przeładowania strony, podstawą techniki AJAX. Działa na zdarzeniach (`onload`, `onerror`, `readyState`) i obsługuje m.in. postęp wysyłania plików. W nowym kodzie zwykle zastępuje go `fetch`.

### Czym różni się fetch od XMLHttpRequest? {#http-xhr-fetch-q2}

`fetch` zwraca Promise, ma czytelniejsze API (`Request`, `Response`, `Headers`), obsługuje strumienie i anulowanie przez `AbortController`, działa też w Node.js i Service Workerach. Nie odrzuca Promise przy 4xx/5xx i nie ma zdarzenia postępu wysyłania, które daje XHR.

### Czym jest AJAX? {#http-xhr-fetch-q3}

Techniką asynchronicznej komunikacji z serwerem w tle, dzięki której strona aktualizuje fragment widoku bez pełnego przeładowania. Realizuje się ją przez XHR lub `fetch`; format danych to dziś zwykle JSON.

## Quiz

### Czego fetch NIE robi, w przeciwieństwie do intuicji wielu osób? {#http-xhr-fetch-z1}

- [x] Nie odrzuca Promise przy statusach 4xx i 5xx
- [ ] Nie obsługuje metody POST
- [ ] Nie działa z JSON
- [ ] Nie pozwala anulować zapytania

Odrzuca tylko przy błędzie sieci lub przerwaniu; sprawdzaj `response.ok`.
