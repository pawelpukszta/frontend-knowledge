---
title: Zrównoważone linkowanie w artykułach
priority: medium
---

Artykuł linkuje do powiązanych treści w serwisie i do autorytatywnych źródeł zewnętrznych; orientacyjnie 2-3 linki wewnętrzne i 1-2 zewnętrzne, proporcjonalnie do długości tekstu i tylko tam, gdzie pomagają czytelnikowi.

## Dlaczego to ważne

- Linki wewnętrzne pozwalają Google odkryć i zrozumieć powiązane strony; strona bez linków przychodzących ("osierocona") może w ogóle nie trafić do indeksu.
- Link do źródła zewnętrznego (np. serwisu gov.pl o paszportach) pozwala czytelnikowi sprawdzić informację i pokazuje, że autor jej nie wymyślił.
- Przesyt linków rozprasza i wygląda jak farma linków; czytelnik nie wie, który jest naprawdę ważny.

## Jak sprawdzić

Policz linki w kilku reprezentatywnych artykułach (np. skryptem poniżej w konsoli DevTools) i znajdź w crawlerze strony bez linków wewnętrznych.

## Kod

```js title="Konsola DevTools: linki w treści artykułu"
const article = document.querySelector('article');
const links = [...article.querySelectorAll('a[href]')];
const internal = links.filter((a) => a.hostname === location.hostname);
const external = links.filter((a) => a.hostname !== location.hostname);
const words = article.innerText.split(/\s+/).length;
console.table({ words, internal: internal.length, external: external.length });
console.log(external.map((a) => `${a.href} rel=${a.rel || '-'}`));
```

## Częste błędy

- Linkowanie wyłącznie do strony głównej lub kategorii zamiast do konkretnych, powiązanych artykułów.
