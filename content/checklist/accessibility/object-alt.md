---
title: Tekst alternatywny dla elementów object
priority: medium
---

`<object>` potrzebuje alternatywy: nazwy dostępnej (`aria-label`, `aria-labelledby` lub `title`) i treści zastępczej wewnątrz elementu, żeby czytnik i przeglądarka bez wtyczki wiedziały, co zawiera.

## Dlaczego to ważne

- Bez nazwy czytnik ogłosi jedynie "obiekt" albo nic; użytkownik nie dowie się, że w tym miejscu jest np. regulamin w PDF. WCAG 1.1.1 (A).
- Treść zastępcza wyświetla się, gdy przeglądarka nie obsłuży zasobu (np. PDF na części telefonów), więc pomaga wszystkim użytkownikom.
- Często lepiej w ogóle zrezygnować z `<object>`: dla obrazów i SVG użyj `img`, dla PDF zwykłego linku z typem i rozmiarem pliku.

## Jak sprawdzić

axe (`object-alt`); panel Accessibility w DevTools pokazuje nazwę elementu.

## Kod

```html
<!-- Bad: no accessible name, no fallback -->
<object data="/docs/warunki-uczestnictwa.pdf" type="application/pdf"></object>

<!-- Good: accessible name and a useful fallback -->
<object data="/docs/warunki-uczestnictwa.pdf" type="application/pdf"
        width="100%" height="600"
        aria-label="Warunki uczestnictwa w imprezach turystycznych (PDF)">
  <p><a href="/docs/warunki-uczestnictwa.pdf">Pobierz warunki uczestnictwa (PDF, 420 KB)</a></p>
</object>
```

## Częste błędy

- Osadzanie infografiki przez `<object>` bez tekstowego opisu jej treści.
