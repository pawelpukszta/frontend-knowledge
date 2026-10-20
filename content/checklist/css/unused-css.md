---
title: Usunięte nieużywane reguły CSS
priority: high
---

Martwy CSS wydłuża pobieranie i przeliczanie stylów. Pomagają podział CSS per komponent lub trasa, Tailwind (generuje tylko użyte klasy), PurgeCSS.

## Dlaczego to ważne

- W starszych projektach często ponad połowa pobranego CSS nie jest używana na danej stronie, a przeglądarka i tak musi go pobrać i sparsować przed renderem.
- Każda reguła to praca przy dopasowaniu selektorów; mniej reguł to krótsze przeliczanie stylów przy każdej zmianie DOM.
- Martwy kod utrudnia refaktoryzację, bo nikt nie wie, czy klasę można usunąć.

## Jak sprawdzić

Zakładka Coverage w DevTools (czerwone fragmenty po przejściu typowych ścieżek), bundle analyzer, raport niewykorzystanych selektorów w PurgeCSS.

## Kod

```css title="Tailwind CSS v4"
@import "tailwindcss";
/* Tailwind scans sources and emits only used utilities.
   Add paths it cannot detect automatically, e.g. a shared UI package */
@source "../node_modules/@acme/ui/dist";
```

```tsx title="CSS Modules per component"
// Styles are bundled only on routes that import this component
import styles from "./BookingSummary.module.css";

export function BookingSummary({ total }: { total: string }) {
  return <section className={styles.summary}>{total}</section>;
}
```

## Częste błędy

- Dynamiczne składanie nazw klas z fragmentów (np. `text-{color}-500` w szablonie); narzędzie ich nie wykryje i nie wygeneruje lub usunie.
