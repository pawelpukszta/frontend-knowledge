---
title: Content Security Policy (CSP)
level: senior
tags:
  - CSP
  - nagłówki
  - nonce
  - bezpieczeństwo
summary: Nagłówek, w którym deklarujesz, skąd strona może ładować skrypty, style, obrazy i połączenia. Nawet jeśli atakujący wstrzyknie skrypt, przeglądarka go nie wykona.
sources:
  - title: "MDN: Content Security Policy (CSP)"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
  - title: "web.dev: Mitigate XSS with a strict CSP"
    url: https://web.dev/articles/strict-csp
---

## Wyjaśnienie

- `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'; img-src 'self' https://cdn.example.com; connect-src 'self' https://api.example.com`.
- **Strict CSP** oparta na `nonce` lub hashach jest skuteczniejsza niż długie listy domen.
- Unikaj `'unsafe-inline'` i `'unsafe-eval'` dla skryptów.
- **`Content-Security-Policy-Report-Only`** + `report-to`: testujesz politykę bez blokowania i zbierasz naruszenia przed wdrożeniem.
- `frame-ancestors 'none'` chroni przed clickjackingiem (następca `X-Frame-Options`).

Next.js pozwala generować nonce w proxy/middleware i przekazać go do skryptów.

## Pytania

### Czym jest CSP i przed czym chroni? {#sec-csp-q1}

Nagłówkiem HTTP definiującym dozwolone źródła zasobów (skrypty, style, obrazy, połączenia, ramki). Ogranicza skutki XSS (wstrzyknięty skrypt spoza polityki nie wykona się), clickjackingu i nieautoryzowanego wycieku danych.

### Jak bezpiecznie wdrożyć CSP w istniejącej aplikacji? {#sec-csp-q2}

Najpierw tryb `Report-Only` z raportowaniem, analiza naruszeń (skrypty third-party, inline), wprowadzenie nonce dla skryptów, dopiero potem tryb wymuszający. Za: silna ochrona przed XSS. Przeciw: praca przy integracjach third-party. Długofalowo: każdy nowy skrypt wymaga świadomej decyzji.

## Quiz

### Do czego służy tryb Content-Security-Policy-Report-Only? {#sec-csp-z1}

- [x] Do testowania polityki i zbierania naruszeń bez blokowania zasobów
- [ ] Do wyłączenia CSP w dev
- [ ] Do raportowania błędów JS
- [ ] Do blokowania wszystkich skryptów

Pozwala bezpiecznie przygotować politykę przed wymuszeniem.
