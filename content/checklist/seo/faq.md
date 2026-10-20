---
title: Schema FAQPage
priority: medium
---

Dla stron z pytaniami i odpowiedziami. Uwaga: Google najpierw (2023) ograniczyło rich results FAQ do serwisów rządowych i medycznych, a w maju 2026 przestało je wyświetlać całkowicie. Znacznik może nadal pomagać innym wyszukiwarkom i systemom AI zrozumieć strukturę treści, ale nie da już rozszerzonego wyniku w Google.

## Dlaczego to ważne

- Wdrażanie `FAQPage` tylko po to, by uzyskać rozwijane pytania pod wynikiem, nie ma już sensu; nie traktuj go jako priorytetu SEO.
- Sama sekcja pytań i odpowiedzi nadal ma wartość: odpowiada na realne wątpliwości (bagaż, wiza, dopłaty) i zmniejsza liczbę zapytań do obsługi klienta.
- Jasna struktura pytanie-odpowiedź ułatwia cytowanie treści przez wyszukiwarki AI; znacznik to tani dodatek, jeśli treść i tak jest na stronie.

## Jak sprawdzić

Schema Markup Validator; treść FAQ musi być widoczna na stronie.

## Kod

```html
<section aria-labelledby="faq-title">
  <h2 id="faq-title">Najczęstsze pytania</h2>
  <details>
    <summary>Czy cena obejmuje bagaż rejestrowany?</summary>
    <p>Tak, 20 kg bagażu rejestrowanego na osobę jest w cenie.</p>
  </details>
</section>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Czy cena obejmuje bagaż rejestrowany?",
    "acceptedAnswer": { "@type": "Answer", "text": "Tak, 20 kg bagażu rejestrowanego na osobę jest w cenie." }
  }]
}
</script>
```

## Częste błędy

- Pytania marketingowe ("Dlaczego jesteśmy najlepsi?") zamiast realnych wątpliwości klientów.
- Odpowiedzi w JSON-LD, których nie ma w widocznej treści.
