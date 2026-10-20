---
title: Naprawione linki zewnętrzne
priority: medium
---

Linki do nieistniejących stron zewnętrznych obniżają jakość treści. Zaktualizuj adres, podmień źródło lub usuń link.

## Dlaczego to ważne

- Martwy link do regulaminu przewoźnika czy strony z wymogami wjazdowymi zawodzi użytkownika dokładnie wtedy, gdy potrzebuje rzetelnej informacji.
- Wygasłe domeny bywają przejmowane i zamieniane w spam lub phishing; stary link nagle prowadzi do szkodliwej strony z Twoją rekomendacją.
- Martwe źródła obniżają wiarygodność treści w oczach czytelników i osób oceniających jakość.

## Jak sprawdzić

Crawler z opcją sprawdzania linków zewnętrznych; lychee lokalnie lub w CI.

## Kod

```bash
# Check only external links in published articles; retry flaky hosts, accept rate limiting
lychee --no-progress --max-retries 3 --timeout 20 \
  --exclude '^https://example\.pl' \
  --accept '200..=299,429' \
  'content/blog/**/*.md'
```

## Częste błędy

- Zamiana martwego linku na stronę główną domeny zamiast konkretnej treści lub kopii w archiwum (web.archive.org).
