---
title: Przegląd wszystkich stron noindex
priority: medium
---

Okresowo sprawdzaj listę stron wykluczonych z indeksu, żeby wyłapać przypadkowe noindexy na ważnych stronach.

## Dlaczego to ważne

- Przypadkowy noindex (z flagi stagingowej, wtyczki CMS, nowej reguły w CDN) potrafi po cichu wyciąć z wyników całą kategorię; spadek ruchu widać dopiero po dniach, gdy Google ponownie odwiedzi strony.
- noindex bywa ustawiany w kilku warstwach: meta tag, nagłówek `X-Robots-Tag` w serwerze lub CDN, konfiguracja frameworka; przegląd samego szablonu nie wystarczy.
- Lista celowych wykluczeń (koszyk, konto, wyniki wyszukiwania) pozwala w porównaniu szybko wyłapać nowe, niechciane pozycje.

## Jak sprawdzić

Raport stron w Search Console (wykluczone przez tag noindex), crawler z filtrem noindex; porównuj z poprzednim eksportem.

## Kod

```bash title="Test w CI dla kluczowych adresów"
for url in https://example.pl/ https://example.pl/wakacje/grecja https://example.pl/last-minute; do
  html=$(curl -s -D headers.txt "$url")
  # Fail the pipeline if a money page is noindexed by header or meta tag
  if grep -qi '^x-robots-tag:.*noindex' headers.txt || \
     echo "$html" | grep -qiE '<meta[^>]+name="robots"[^>]+noindex'; then
    echo "NOINDEX on $url"; exit 1
  fi
done
```

## Częste błędy

- Sprawdzanie tylko meta tagów w HTML i pomijanie nagłówków HTTP.
