---
title: Atrybut lang na elemencie html
priority: high
sources:
  - title: "W3C Understanding 3.1.1: Language of Page"
    url: https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html
---

`<html lang="pl">` (kod BCP 47) wybiera właściwy syntezator mowy w czytnikach, reguły dzielenia wyrazów i tłumaczenie automatyczne. Fragmenty w innym języku mają własny `lang`.

## Dlaczego to ważne

- Czytnik ekranu wybiera głos na podstawie `lang`; polski tekst czytany angielskim syntezatorem jest niezrozumiały. WCAG 3.1.1 (A).
- Przeglądarka używa `lang` do dzielenia wyrazów (`hyphens: auto`), cudzysłowów w `q`, doboru fontów i decyzji, czy zaproponować tłumaczenie.
- Wtrącenia w innym języku oznacz osobno (`<span lang="en">`): WCAG 3.1.2 (AA).

## Jak sprawdzić

Źródło strony, axe (`html-has-lang`, `html-lang-valid`, `valid-lang`).

## Kod

```html
<!doctype html>
<html lang="pl">
<body>
  <p>Pakiet obejmuje transfer i <span lang="en">late check-out</span> do 14:00.</p>
  <blockquote lang="de">Ein wunderbarer Urlaub auf Kreta!</blockquote>
</body>
</html>
```

```tsx title="app/layout.tsx"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
```

## Częste błędy

- `lang="en"` pozostawione z szablonu startowego (np. create-next-app) na polskiej stronie.
- Jeden `lang` dla wszystkich wersji językowych serwisu zamiast ustawiania go per locale.
