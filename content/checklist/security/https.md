---
title: Wszystkie strony przez HTTPS
priority: critical
sources:
  - title: "Qualys: SSL Labs Server Test"
    url: https://www.ssllabs.com/ssltest/
---

Każda strona, zasób i endpoint API jest dostępny wyłącznie przez HTTPS z ważnym certyfikatem i nowoczesnym TLS (1.2 lub 1.3). HTTPS szyfruje komunikację, chroni przed podmianą treści i jest warunkiem wielu API przeglądarki.

## Dlaczego to ważne

- Bez HTTPS każdy w tej samej sieci Wi-Fi (lotnisko, hotel) może podejrzeć lub podmienić treść strony, w tym numer konta do przelewu czy formularz logowania.
- Service Worker, geolokalizacja, Web Crypto, schowek czy HTTP/2 i HTTP/3 w przeglądarkach działają tylko w bezpiecznym kontekście.
- Chrome oznacza strony HTTP jako "Niezabezpieczona", co odstrasza klientów przed podaniem danych do rezerwacji; HTTPS jest też sygnałem rankingowym Google.

## Jak sprawdzić

Otwórz kilka podstron i sprawdź kłódkę oraz `window.isSecureContext` w konsoli; SSL Labs dla konfiguracji certyfikatu i protokołów (cel: ocena A lub A+).

## Kod

```bash title="Szybka kontrola certyfikatu i protokołu"
# Certificate validity dates and issuer
openssl s_client -connect example.pl:443 -servername example.pl </dev/null 2>/dev/null \
  | openssl x509 -noout -issuer -dates

# Old protocols should be rejected (expect a handshake failure)
openssl s_client -connect example.pl:443 -tls1_1 </dev/null

# Final URL and status after redirects
curl -sSIL http://example.pl/ | grep -iE '^(HTTP|location)'
```

## Częste błędy

- Ręczne odnawianie certyfikatów zamiast automatu (ACME, Let's Encrypt); wygasły certyfikat blokuje całą stronę.
- HTTPS tylko na stronach logowania i płatności, a reszta serwisu po HTTP.
