---
title: Rozpoznaj treści YMYL
priority: high
---

"Your Money or Your Life" to tematy, które mogą wpłynąć na zdrowie, finanse, bezpieczeństwo lub prawa człowieka (np. ubezpieczenia podróżne, szczepienia przed wyjazdem, płatności, prawa pasażera). Wymagają wyższych standardów: autora z kwalifikacjami, recenzji eksperta, źródeł i daty weryfikacji.

## Dlaczego to ważne

- Wytyczne dla oceniających jakość (Search Quality Rater Guidelines) wymagają przy YMYL najwyższego poziomu zaufania; ta sama treść bez autora i źródeł zostanie oceniona niżej niż przy zwykłym temacie.
- Błąd ma realne skutki: nieaktualna informacja o wizie lub zakresie polisy może kosztować klienta odmowę wjazdu albo tysiące złotych za leczenie za granicą.
- Oznaczenie kategorii YMYL w CMS pozwala wymusić proces (recenzja, źródła, data weryfikacji) zamiast liczyć na pamięć redaktora.

## Jak sprawdzić

Przejrzyj kategorie treści i oznacz YMYL; na tych stronach sprawdź podpis autora, recenzenta, datę weryfikacji i przypisy do źródeł pierwotnych.

## Kod

```ts title="Walidacja w CMS przed publikacją"
// cms/validators/ymyl.ts
const YMYL_CATEGORIES = new Set(['ubezpieczenia', 'zdrowie-w-podrozy', 'wizy', 'platnosci', 'prawa-pasazera']);

export function validateYmyl(post: Post): string[] {
  if (!YMYL_CATEGORIES.has(post.category)) return [];
  const errors: string[] = [];
  if (!post.author?.bio) errors.push('YMYL: author with bio is required');
  if (!post.reviewedBy) errors.push('YMYL: expert reviewer is required');
  if (!post.reviewedAt) errors.push('YMYL: review date is required');
  if (post.sources.length < 2) errors.push('YMYL: cite at least two primary sources');
  return errors;
}
```

## Częste błędy

- Traktowanie poradnika "jak odzyskać pieniądze za odwołany lot" jak zwykłego wpisu blogowego, bez weryfikacji przez prawnika.
- Jednorazowa weryfikacja bez terminu kolejnego przeglądu; przepisy i warunki polis zmieniają się co sezon.
