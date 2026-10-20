---
title: Role mają wymagane atrybuty ARIA
priority: medium
---

Niektóre role wymagają stanów, np. `checkbox` i `switch` → `aria-checked`, `slider` → `aria-valuenow`, `heading` → `aria-level`, `combobox` → `aria-expanded`. Bez nich widget nie przekazuje swojego stanu.

## Dlaczego to ważne

- `div role="checkbox"` bez `aria-checked` jest ogłaszany jako "pole wyboru" bez informacji, czy jest zaznaczone; użytkownik nie wie, czy dodał ubezpieczenie do rezerwacji.
- Atrybut trzeba aktualizować przy każdej zmianie; ustawiony raz w markupie daje stan sprzeczny z tym, co widać na ekranie.
- Natywne elementy (`<input type="checkbox">`, `<input type="range">`, `<h2>`) mają te stany wbudowane; wymagania dotyczą tylko ról nadanych ręcznie.

## Jak sprawdzić

axe (`aria-required-attr`); przełącz kontrolkę i sprawdź w panelu Accessibility, czy stan się zmienia.

## Kod

```html title="Źle"
<div role="checkbox" tabindex="0">Ubezpieczenie kosztów rezygnacji</div>
<div role="heading">Podsumowanie rezerwacji</div>
```

```tsx title="Dobrze"
function Checkbox({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  const toggle = () => setChecked((c) => !c);
  return (
    <div
      role="checkbox"
      aria-checked={checked} // rendered as "true" / "false"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === " ") { e.preventDefault(); toggle(); } }}
    >
      {label}
    </div>
  );
}
// Simpler and better: <label><input type="checkbox" /> {label}</label>
```

## Częste błędy

- `<div role="heading">` bez `aria-level`; zamiast tego użyj po prostu `<h2>`.
