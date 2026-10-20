---
title: Dostępna paginacja
priority: medium
---

`<nav aria-label="Paginacja">`, linki z opisową nazwą ("Strona 3"), bieżąca strona z `aria-current="page"`, prawdziwe adresy URL dla każdej strony.

## Dlaczego to ważne

- Linki "1 2 3" bez kontekstu to dla czytnika same liczby; ukryty tekst "Strona" lub etykieta wyjaśnia, dokąd prowadzą.
- `aria-current="page"` ogłasza bieżącą stronę; samo pogrubienie widzi tylko osoba widząca.
- Każda strona pod własnym adresem (`?page=3`) jest indeksowalna, da się ją udostępnić i wrócić do niej przyciskiem Wstecz. Google nie używa już `rel="prev/next"`, więc liczą się zwykłe linki `<a href>`.

## Jak sprawdzić

Obsługa klawiaturą i czytnikiem ekranu; sprawdź, czy każda strona ma unikalny adres i działa po odświeżeniu.

## Kod

```html
<nav aria-label="Paginacja wyników">
  <ul class="pagination">
    <li><a href="/oferty/grecja?page=1" aria-label="Poprzednia strona">‹</a></li>
    <li><a href="/oferty/grecja?page=1"><span class="visually-hidden">Strona </span>1</a></li>
    <li><a href="/oferty/grecja?page=2" aria-current="page"><span class="visually-hidden">Strona </span>2</a></li>
    <li><a href="/oferty/grecja?page=3"><span class="visually-hidden">Strona </span>3</a></li>
    <li><a href="/oferty/grecja?page=3" aria-label="Następna strona">›</a></li>
  </ul>
</nav>
```

## Częste błędy

- Paginacja lub "Pokaż więcej" jako `button` z JS bez zmiany adresu URL: dalsze oferty są niewidoczne dla robotów i giną po odświeżeniu.
