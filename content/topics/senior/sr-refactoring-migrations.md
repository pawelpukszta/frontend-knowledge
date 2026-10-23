---
title: "Refaktoryzacja i duże migracje"
level: senior
added: 2026-10-23
tags:
  - refactoring
  - strangler fig
  - parallel change
  - codemod
  - feature flags
  - migracje
summary: "Refaktoryzacja to zmiana struktury bez zmiany zachowania, robiona małymi krokami, z których każdy da się wdrożyć. Duże migracje prowadzisz tak samo: stary i nowy kod żyją obok siebie, a `main` cały czas nadaje się do wdrożenia."
sources:
  - title: "Martin Fowler: Definition Of Refactoring"
    url: https://martinfowler.com/bliki/DefinitionOfRefactoring.html
  - title: "Michael Feathers: Characterization Testing"
    url: https://michaelfeathers.silvrback.com/characterization-testing
  - title: "Martin Fowler: Parallel Change"
    url: https://martinfowler.com/bliki/ParallelChange.html
  - title: "Martin Fowler: Strangler Fig Application"
    url: https://martinfowler.com/bliki/StranglerFigApplication.html
  - title: "Pete Hodgson: Feature Toggles (martinfowler.com)"
    url: https://martinfowler.com/articles/feature-toggles.html
  - title: "jscodeshift"
    url: https://github.com/facebook/jscodeshift
  - title: "Next.js: Migrating from Pages to the App Router"
    url: https://nextjs.org/docs/app/guides/migrating/app-router-migration
---

## Wyjaśnienie

Martin Fowler definiuje refaktoryzację jako zmianę wewnętrznej struktury kodu bez zmiany jego obserwowalnego zachowania. W praktyce to seria małych kroków: zmień nazwę, wydziel funkcję, przenieś plik, uruchom testy, zrób commit. Jeśli coś się zepsuje, cofasz ostatni krok, a nie tydzień pracy. Nie mieszaj refaktoryzacji ze zmianą funkcjonalności w jednym commicie, bo recenzent nie odróżni jednego od drugiego.

Kod bez testów najpierw zabezpieczasz testami charakteryzacyjnymi (Michael Feathers). Nie sprawdzają, jak kod powinien działać, tylko utrwalają to, co robi dziś, łącznie z dziwnymi przypadkami. Wywołujesz funkcję z realnymi danymi i zapisujesz wynik jako oczekiwany, najprościej snapshotem. Dopiero potem zmieniasz strukturę. Jeśli test pokaże coś, co wygląda na błąd, zapisz to jako osobne zadanie i nie poprawiaj w trakcie refaktoryzacji.

Parallel change (expand/contract) pozwala zmienić interfejs, z którego korzysta wiele miejsc, bez jednego wielkiego PR:

1. Expand: dodajesz nową wersję obok starej, na przykład nowy prop `variant` w `Button` obok starego `primary`.
2. Migrate: przepinasz wywołania partiami, w osobnych PR-ach.
3. Contract: gdy nic już nie używa starej wersji, usuwasz ją.

Strangler fig to ten sam pomysł w skali aplikacji. Nowy system rośnie obok starego i przejmuje kolejne fragmenty, aż stary można wyłączyć. Next.js projektuje katalog `app` tak, żeby działał razem z `pages`, więc migrujesz trasa po trasie. Komponenty klasowe przepisujesz na hooki wtedy, gdy i tak zmieniasz dany komponent, a nowy kod piszesz od razu w hookach. Narzędzia budowania (webpack lub CRA na Vite) trudno uruchomić równolegle. Tu małe są kroki przygotowawcze: na starym bundlerze usuwasz `require.context`, zamieniasz `process.env` na jeden moduł konfiguracji, a samo przełączenie to krótki PR.

Codemody robią zmiany mechaniczne w setkach plików: zmianę ścieżki importu, nazwy propa, API biblioteki. jscodeshift działa na AST (przez recast) i ma tryb `--dry`. ts-morph daje dostęp do informacji o typach z kompilatora TypeScript. Codemod uruchamiasz, przeglądasz diff jak każdy inny i commitujesz osobno od zmian ręcznych.

Feature flagi są siatką bezpieczeństwa: nowy checkout trafia na produkcję wyłączony, włączasz go dla 5% ruchu i wyłączasz bez wdrożenia, jeśli coś pójdzie źle. Artykuł o feature toggles na martinfowler.com traktuje flagi wydania jako tymczasowe i radzi od razu planować ich usunięcie.

Tracer bullet (określenie z "The Pragmatic Programmer") to pierwszy cienki kawałek, który przechodzi przez cały nowy system aż do produkcji. Przy migracji na App Router to jedna prosta trasa z layoutem, pobieraniem danych, analityką, monitoringiem i wdrożeniem. Problemy z infrastrukturą wychodzą w pierwszym tygodniu, a nie w piątym miesiącu.

## Kod

```ts title="Test charakteryzacyjny przed refaktoryzacją"
import { test } from 'vitest';
import { calculateTotal } from './legacyCheckout'; // 600 lines, no tests

// Pin current behavior, including odd inputs, before changing the structure
const cases = [
  { nights: 3, adults: 2, children: 0, promo: undefined },
  { nights: 7, adults: 2, children: 2, promo: 'LATO26' },
  { nights: 0, adults: 1, children: 0, promo: undefined },
  { nights: 14, adults: 4, children: 1, promo: 'EXPIRED' },
];

test.for(cases)('nights=$nights adults=$adults promo=$promo', (input, { expect }) => {
  expect(calculateTotal(input)).toMatchSnapshot();
});
```

```js title="transforms/button-import.js (jscodeshift)"
// Moves Button imports from the legacy folder to the design system package
module.exports = function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const imports = root.find(j.ImportDeclaration, {
    source: { value: '@/components/legacy/Button' },
  });
  if (imports.size() === 0) return; // leave the file untouched

  imports.forEach((path) => {
    path.node.source.value = '@acme/ui';
  });
  return root.toSource();
};
module.exports.parser = 'tsx';
// Preview: pnpm dlx jscodeshift --dry --print -t transforms/button-import.js src
```

## Częste błędy

- Przepisanie wszystkiego od zera w długo żyjącej gałęzi. Po trzech miesiącach merge z `main` jest bolesny, a stary kod w tym czasie dostał nowe funkcje, których brakuje w nowym.
- Refaktoryzacja i zmiana zachowania w jednym PR. Gdy pojawi się regresja, nie wiadomo, która część ją wprowadziła.
- Migracja bez etapu "contract": stary i nowy wariant żyją razem latami, a flagi wydania nigdy nie znikają.
- Brak blokady nowych zależności od starego kodu. Bez reguły `no-restricted-imports` zespół dalej dopisuje importy z `legacy/` i migracja nie ma końca.

## Pytania

### Jak bezpiecznie zrefaktorujesz 600-liniowy plik bez testów? {#sr-refactoring-migrations-q1}

Najpierw ustalam, po co refaktoryzuję, na przykład żeby dodać nową metodę płatności, i ograniczam zakres do tego celu. Potem piszę testy charakteryzacyjne: wywołuję publiczne funkcje z danymi z produkcji lub logów, w tym z przypadkami brzegowymi, i zapisuję obecne wyniki jako snapshoty. Jeśli kodu nie da się wywołać w teście, pierwszy krok to minimalne rozcięcie, na przykład wstrzyknięcie zależności do `fetch` lub daty. Potem robię małe, mechaniczne kroki z IDE (wydziel funkcję, zmień nazwę, przenieś do modułu), uruchamiam testy po każdym i commituję często. Zmiany zachowania i znalezione błędy idą do osobnych PR-ów. Na koniec zamieniam część snapshotów na czytelne testy zachowania nowych, mniejszych modułów.

### Jak zaplanujesz migrację na pół roku, żeby kod był cały czas gotowy do wdrożenia? {#sr-refactoring-migrations-q2}

Zaczynam od ADR: cel, zakres, kryterium zakończenia i plan wycofania. Pierwszy krok to tracer bullet: jedna prosta strona przeniesiona do końca, razem z wdrożeniem, monitoringiem i analityką. Potem strangler fig: stary i nowy kod działają równolegle w `main`, każda trasa lub moduł to osobny mały PR, a ryzykowne części chowam za feature flagą z rolloutem procentowym. Mechaniczne zmiany robię codemodem, a regułą lint blokuję nowe importy ze starego kodu. Postęp mierzę liczbą (na przykład pozostałe pliki w `pages/`) i pokazuję go co sprint. Planuję też etap usuwania: starego kodu, flag i warstw kompatybilności, bo bez niego migracja się nie kończy.

### Czym jest parallel change (expand/contract)? Podaj przykład z frontu. {#sr-refactoring-migrations-q3}

To sposób na zmianę interfejsu, który ma wielu klientów, bez momentu, w którym wszystko jest zepsute. Przykład: `Button` w design systemie ma boolean `primary`, a chcemy `variant: 'primary' | 'secondary' | 'ghost'`. Expand: dodaję `variant`, a `primary` dalej działa i oznaczam go `@deprecated`, żeby IDE go przekreślało. Migrate: codemod lub kolejne PR-y przepinają użycia. Contract: gdy wyszukiwanie nie znajduje już `primary`, usuwam go w wersji major. To samo stosuję przy zmianie pola w API: backend najpierw zwraca oba pola, front przechodzi na nowe, potem stare znika.

### Kiedy codemod, a kiedy zmiana ręczna? {#sr-refactoring-migrations-q4}

Codemod opłaca się, gdy zmiana jest mechaniczna i powtarza się w dziesiątkach plików: nowa ścieżka importu, zmiana nazwy propa, nowe API biblioteki. Daje spójny wynik, a przy konflikcie z innym PR można go po prostu uruchomić ponownie. Ręcznie zmieniam miejsca, które wymagają decyzji, na przykład komponent klasowy z `componentDidUpdate` przepisywany na hooki. Przypadki, których codemod nie rozpozna, każę mu wypisać w raporcie i poprawiam ręcznie. Wynik przeglądam jak zwykły PR, a commit codemoda trzymam osobno od poprawek ręcznych.

## Quiz

### Test charakteryzacyjny: {#sr-refactoring-migrations-z1}

- [ ] Sprawdza zgodność kodu ze specyfikacją biznesową
- [x] Utrwala obecne zachowanie kodu, żeby wykryć jego zmianę podczas refaktoryzacji
- [ ] Mierzy wydajność funkcji przed i po zmianie
- [ ] Zastępuje testy end-to-end

Zapisuje to, co kod robi dziś, nawet jeśli to błąd, więc każda zmiana wyniku po refaktoryzacji od razu wychodzi na jaw.

### Migracja z Pages Router na App Router "trasa po trasie", przy której oba katalogi działają równolegle, to przykład: {#sr-refactoring-migrations-z2}

- [ ] Big bang rewrite
- [ ] Wzorca Adapter
- [x] Strangler fig
- [ ] Feature branch na pół roku

Nowy system stopniowo przejmuje kolejne fragmenty starego, aż stary można usunąć.
