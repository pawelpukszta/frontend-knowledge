---
title: Ważne strony są indeksowalne
priority: medium
---

Strony, które mają przynosić ruch, zwracają 200, nie mają noindex, nie są blokowane w robots.txt i mają canonical na siebie.

## Dlaczego to ważne

- Strona spoza indeksu nie przynosi ruchu organicznego niezależnie od jakości treści; w e-commerce to bezpośrednio utracona sprzedaż.
- Najczęstsze przyczyny są banalne: noindex ze stagingu, `Disallow` w robots.txt, canonical na inny adres, soft 404 (pusta lista ofert ze statusem 200).
- Treść dostępna dopiero po wykonaniu JS bywa indeksowana z opóźnieniem lub częściowo; SSR lub SSG daje pewniejszy wynik dla kluczowych stron.

## Jak sprawdzić

Inspekcja adresu URL w Search Console (stan indeksowania, wybrany canonical, wyrenderowany HTML); `curl -I` dla nagłówków.

## Kod

```bash title="Szybka kontrola indeksowalności"
url="https://example.pl/wakacje/grecja"
curl -sI "$url" | grep -iE '^(HTTP|x-robots-tag|location)'   # expect 200, no noindex
curl -s "$url" | grep -oiE '<meta name="robots"[^>]*>|<link rel="canonical"[^>]*>'
curl -s https://example.pl/robots.txt | grep -i disallow      # path must not be blocked
```

## Częste błędy

- Sprawdzenie strony tylko w przeglądarce, gdzie nie widać nagłówków HTTP ani canonicala.
