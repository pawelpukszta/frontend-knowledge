---
title: "Strategia testów: piramida i testing trophy"
level: senior
added: 2026-10-20
tags:
  - testy
  - unit
  - integration
  - e2e
  - Vitest
  - Playwright
  - Testing Library
summary: Testy mają dawać pewność przy rozsądnym koszcie. Na froncie najwięcej wartości dają testy integracyjne komponentów, uzupełnione o testy jednostkowe logiki i kilka testów E2E krytycznych ścieżek.
sources:
  - title: "Kent C. Dodds: The Testing Trophy and Testing Classifications"
    url: https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications
  - title: "Testing Library: Guiding Principles"
    url: https://testing-library.com/docs/guiding-principles
  - title: "Playwright: Best Practices"
    url: https://playwright.dev/docs/best-practices
  - title: Mock Service Worker
    url: https://mswjs.io/
---

## Wyjaśnienie

- **Static**: TypeScript, ESLint. Najtańsza warstwa, łapie całe klasy błędów.
- **Unit**: czyste funkcje, hooki, reducery (Vitest/Jest). Szybkie, precyzyjne.
- **Integration**: komponent lub cała strona z prawdziwymi dziećmi, mockowaną siecią (MSW) i interakcjami użytkownika (Testing Library + user-event). Najlepszy stosunek pewności do kosztu.
- **E2E**: prawdziwa przeglądarka i backend (Playwright, Cypress). Kilka krytycznych ścieżek: wyszukiwanie → oferta → rezerwacja → płatność.
- Dodatkowo: testy wizualne (Chromatic, Playwright screenshots), testy dostępności (axe), kontraktowe.

Zasada Testing Library: "Im bardziej testy przypominają sposób używania aplikacji, tym większą dają pewność". Testuj zachowanie (co widzi i robi użytkownik), nie implementację (stan wewnętrzny, nazwy klas).

**Piramida** (dużo unit, mało E2E) vs **testing trophy** (Kent C. Dodds: nacisk na integrację). Obie mówią to samo: E2E są drogie i wolne, więc używaj ich oszczędnie.

## Kod

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('filters offers by city', async () => {
  const user = userEvent.setup();
  render(<SearchPage />); // network mocked with MSW
  await user.type(screen.getByRole('searchbox', { name: /miasto/i }), 'Rzym');
  expect(await screen.findByRole('heading', { name: /rzym/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /ateny/i })).not.toBeInTheDocument();
});
```

## Pytania

### Jak zaplanowałbyś strategię testów aplikacji front-end? {#sr-testing-q1}

TypeScript i ESLint jako fundament, testy jednostkowe dla logiki domenowej i hooków, większość wysiłku w testy integracyjne komponentów i stron (Testing Library + MSW), kilka testów E2E na krytyczne ścieżki biznesowe w Playwright, a do tego axe i ewentualnie testy wizualne w CI. Za: wysoka pewność przy rozsądnym czasie CI. Przeciw: testy integracyjne wymagają dobrego mockowania API. Długofalowo: testy odporne na refaktoryzację, bo sprawdzają zachowanie.

### Dlaczego nie testować szczegółów implementacji? {#sr-testing-q2}

Takie testy psują się przy każdej refaktoryzacji, choć zachowanie się nie zmieniło (fałszywe alarmy), a jednocześnie mogą przejść, gdy UI jest zepsute. Testy zachowania sprawdzają to, co ważne dla użytkownika.

## Quiz

### Które testy na froncie zwykle dają najlepszy stosunek pewności do kosztu? {#sr-testing-z1}

- [ ] Snapshot testy każdego komponentu
- [x] Testy integracyjne komponentów/stron z Testing Library
- [ ] Wyłącznie E2E
- [ ] Testy stanu wewnętrznego komponentów

Testing trophy stawia na integrację; E2E są drogie, a testy implementacji kruche.
