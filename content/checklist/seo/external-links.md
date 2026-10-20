---
title: Linki do wartościowych źródeł zewnętrznych
priority: medium
---

Odwołania do autorytatywnych źródeł pomagają użytkownikom i świadczą o rzetelności treści. Linki płatne i od użytkowników oznaczaj odpowiednim `rel`.

## Dlaczego to ważne

- Link do źródła (np. oficjalnej strony z wymogami wjazdowymi) pozwala czytelnikowi sprawdzić informację i zwiększa zaufanie do treści.
- Pytania samooceny Google dotyczące pomocnych treści obejmują m.in. to, czy treść budzi zaufanie dzięki jasnemu podaniu źródeł.
- Linki sponsorowane i afiliacyjne oznaczaj `rel="sponsored"`, a z treści użytkowników `rel="ugc"`; zwykłe linki redakcyjne do źródeł nie potrzebują nofollow.

## Jak sprawdzić

Przegląd treści; crawler: lista domen zewnętrznych i atrybutów `rel`.

## Kod

```html
<!-- Editorial source: plain link, no nofollow needed -->
<a href="https://www.gov.pl/web/dyplomacja">Informacje dla podróżujących (gov.pl)</a>

<!-- Paid or affiliate link -->
<a href="https://partner.example.com/ubezpieczenie?aff=123" rel="sponsored">Ubezpieczenie podróżne</a>

<!-- Link inside a user review -->
<a href="https://blog-podroznika.example" rel="ugc">blog autora opinii</a>
```

## Częste błędy

- Nofollow na wszystkich linkach zewnętrznych "dla bezpieczeństwa", także do rzetelnych źródeł.
