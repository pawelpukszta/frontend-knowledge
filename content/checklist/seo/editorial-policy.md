---
title: Polityka redakcyjna
priority: medium
---

Publiczna strona opisująca, jak powstają i są weryfikowane treści, kto je recenzuje, jak korzystacie z AI i jak zgłaszać błędy. Ważne dla serwisów publikujących dużo poradników.

## Dlaczego to ważne

- Oceniający jakość szukają informacji o odpowiedzialności za treść; polityka redakcyjna odpowiada na pytanie "skąd mam wiedzieć, że to prawda?".
- Spisany proces porządkuje pracę zespołu: każdy redaktor i freelancer wie, jakie źródła są akceptowane i kiedy tekst wymaga recenzji eksperta.
- Jawna procedura korekt (z datą i opisem zmiany) buduje zaufanie po wykryciu błędu, w przeciwieństwie do cichej poprawki.

## Jak sprawdzić

Sprawdź, czy strona istnieje, jest podlinkowana w stopce i z profili autorów oraz czy wskazuje ją `publishingPrinciples` w JSON-LD Organization.

## Kod

```html title="Szkielet strony /polityka-redakcyjna"
<h1>Polityka redakcyjna</h1>
<h2 id="zrodla">Z jakich źródeł korzystamy</h2>
<h2 id="recenzja">Kto sprawdza teksty o zdrowiu, ubezpieczeniach i prawach pasażera</h2>
<h2 id="ai">Jak używamy narzędzi AI</h2>
<h2 id="korekty">Korekty: jak zgłosić błąd i jak oznaczamy poprawki</h2>
<h2 id="niezaleznosc">Niezależność i linki partnerskie</h2>
```

```html title="JSON-LD Organization"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://example.pl/#organization",
  "name": "Example Travel",
  "url": "https://example.pl",
  "publishingPrinciples": "https://example.pl/polityka-redakcyjna"
}
</script>
```

## Częste błędy

- Polityka napisana raz i nieaktualizowana, opisująca proces, którego zespół nie stosuje.
