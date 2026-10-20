---
title: XSS (Cross-Site Scripting)
level: mid
tags:
  - XSS
  - dangerouslySetInnerHTML
  - sanitization
  - innerHTML
summary: "Atakujący wstrzykuje złośliwy skrypt, który wykonuje się w przeglądarce ofiary w kontekście Twojej strony: może wykraść dane, wykonać akcje lub podmienić treść."
sources:
  - title: "MDN: Cross-site scripting (XSS)"
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS
  - title: "OWASP: XSS Prevention Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
  - title: "React: dangerouslySetInnerHTML"
    url: https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
---

## Wyjaśnienie

Rodzaje:

- **Stored**: skrypt zapisany w bazie (np. w opinii o hotelu) i wyświetlany innym.
- **Reflected**: skrypt w URL lub parametrze, odbity w odpowiedzi.
- **DOM-based**: kod frontu wstawia niezaufane dane do DOM (`innerHTML`, `document.write`, `location.hash`).

Obrona:

- **Escapowanie przy renderowaniu**: React domyślnie escapuje wartości w JSX. Ryzyko pojawia się przy `dangerouslySetInnerHTML`, `href={userUrl}` (schemat `javascript:`), `innerHTML`, `eval`, `new Function`.
- **Sanitizacja** HTML od użytkownika (np. DOMPurify), gdy musisz go wyrenderować.
- Walidacja URL: dopuszczaj tylko `http:` i `https:`.
- **Content Security Policy** jako druga linia obrony.
- Cookies sesyjne `HttpOnly` (skrypt ich nie odczyta).
- Trusted Types (Chrome) wymuszają bezpieczne API dla "sinków" DOM.

## Kod

```tsx
// Safe: React escapes text content
<p>{review.text}</p>

// Dangerous: raw HTML from users
<div dangerouslySetInnerHTML={{ __html: review.html }} />

// Safer: sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(review.html) }} />

// Validate user-provided URLs
const safeHref = (url: string) => (/^https?:\/\//i.test(url) ? url : '#');
```

## Pytania

### Czym jest XSS i jak się przed nim bronić w React? {#sec-xss-q1}

Wstrzyknięciem i wykonaniem złośliwego skryptu w kontekście strony. React escapuje wartości w JSX, więc główne ryzyka to `dangerouslySetInnerHTML`, niezwalidowane URL-e w `href`/`src` i bezpośrednie operacje na DOM. Obrona: unikanie surowego HTML, sanitizacja (DOMPurify), walidacja URL, CSP i cookies `HttpOnly`.

### Czy React całkowicie chroni przed XSS? {#sec-xss-q2}

Nie. Chroni przy wstawianiu tekstu w JSX, ale nie przy `dangerouslySetInnerHTML`, linkach `javascript:`, bibliotekach operujących na DOM, SSR z niebezpiecznym wstrzykiwaniem danych do skryptów ani przy zależnościach third-party.

## Quiz

### Które miejsce w React jest typowym źródłem XSS? {#sec-xss-z1}

- [ ] Wstawienie {text} w JSX
- [x] dangerouslySetInnerHTML z danymi od użytkownika
- [ ] useState
- [ ] className

JSX escapuje tekst; surowy HTML omija tę ochronę.
