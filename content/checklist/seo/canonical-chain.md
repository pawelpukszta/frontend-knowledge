---
title: Canonical wskazuje bezpośrednio adres docelowy
priority: medium
---

Canonical prowadzi wprost do adresu, który zwraca 200, jest indeksowalny i ma canonical na siebie. Canonical do przekierowania, błędu lub strony z innym canonicalem to sprzeczny sygnał.

## Dlaczego to ważne

- Canonical to dla Google tylko wskazówka; gdy cel przekierowuje albo wskazuje dalej, Google często ją ignoruje i sam wybiera adres kanoniczny.
- Takie łańcuchy powstają przy migracjach: canonicale w CMS wciąż mają stary schemat `http://` lub starą strukturę, a serwer przekierowuje.
- Rozjazd kończy się w Search Console statusem "Google wybrał inną stronę kanoniczną niż użytkownik", a sygnały trafiają nie tam, gdzie planowano.

## Jak sprawdzić

Crawler: canonical do przekierowania, do non-200 lub do strony z innym canonicalem; ręcznie `curl -sI` na adres z canonical.

## Kod

```html
<!-- Bad: http + trailing slash, server redirects to https://example.pl/wakacje/grecja -->
<link rel="canonical" href="http://example.pl/wakacje/grecja/" />

<!-- Good: exact final URL that answers 200 and is self-canonical -->
<link rel="canonical" href="https://example.pl/wakacje/grecja" />
```

```bash title="Sprawdzenie celu canonical"
url="https://example.pl/wakacje/grecja?sort=cena"
canonical=$(curl -s "$url" | grep -oP '<link rel="canonical" href="\K[^"]+')
echo "canonical: $canonical"
# Target must answer 200 directly, without a location header
curl -sI "$canonical" | grep -iE '^(HTTP|location)'
```

## Częste błędy

- Canonical z wersji mobilnej `m.` wskazujący na desktop, który przekierowuje z powrotem na `m.`.
