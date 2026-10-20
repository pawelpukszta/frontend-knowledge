---
title: Spójne sygnały indeksowania
priority: medium
---

robots.txt, meta robots, `X-Robots-Tag`, canonical i sitemap nie mogą sobie przeczyć (np. canonical do strony z noindex albo adres z sitemap zablokowany w robots.txt).

## Dlaczego to ważne

- Przy sprzecznych sygnałach Google rozstrzyga sam i wynik bywa nieprzewidywalny: indeksuje inny adres niż wskazany w canonical albo pomija stronę.
- Typowe konflikty: canonical do strony noindex, adres z sitemap zablokowany w robots.txt, noindex razem z canonicalem na inny adres, `index` w meta i `noindex` w nagłówku.
- Sygnały pochodzą z różnych warstw (CDN, serwer, framework, CMS), więc konflikt zwykle nie jest widoczny w żadnym pojedynczym pliku.

## Jak sprawdzić

Crawler z raportem indeksowalności; Inspekcja adresu URL pokazuje canonical deklarowany i wybrany przez Google.

## Kod

```ts title="Wykrywanie konfliktów w audycie"
type PageSignals = {
  url: string; status: number; inSitemap: boolean;
  robotsTxtAllowed: boolean; noindex: boolean; canonical: string | null;
};

export function findConflicts(p: PageSignals): string[] {
  const issues: string[] = [];
  if (p.inSitemap && p.noindex) issues.push("noindex page listed in sitemap");
  if (p.inSitemap && !p.robotsTxtAllowed) issues.push("sitemap URL blocked by robots.txt");
  if (p.noindex && !p.robotsTxtAllowed) issues.push("noindex invisible: blocked by robots.txt");
  if (p.noindex && p.canonical && p.canonical !== p.url) issues.push("noindex plus canonical to another URL");
  if (p.canonical === p.url && p.status !== 200) issues.push("self-canonical on non-200 page");
  return issues;
}
```

## Częste błędy

- Ustawianie noindex i canonicala na inny adres jednocześnie "na wszelki wypadek".
