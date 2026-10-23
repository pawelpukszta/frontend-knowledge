---
title: TypeScript w React
level: mid
added: 2026-10-20
tags:
  - React
  - props
  - events
  - ComponentProps
summary: Typujesz props, zdarzenia, refy i hooki. Zwykle wystarcza inferencja; jawne typy dajesz na granicach komponentu.
sources:
  - title: "React: Using TypeScript"
    url: https://react.dev/learn/typescript
  - title: React TypeScript Cheatsheet
    url: https://react-typescript-cheatsheet.netlify.app/
---

## Wyjaśnienie

- **Props**: `type Props = { title: string; onSelect?: (id: string) => void }`. `children: React.ReactNode`.
- **Rozszerzanie natywnych elementów**: `ComponentProps<'button'>` lub `ComponentPropsWithoutRef<'button'>`.
- **Zdarzenia**: `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`, `React.FormEvent`.
- **useState**: inferencja z wartości początkowej; jawny typ, gdy startujesz od `null`: `useState<User | null>(null)`.
- **useRef**: `useRef<HTMLInputElement>(null)`.
- `React.FC` nie jest już zalecany jako domyślny; typowanie props w parametrze jest prostsze.

## Kod

```tsx
import type { ComponentProps, ReactNode } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'ghost';
  icon?: ReactNode;
};

export function Button({ variant = 'primary', icon, children, ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {icon}
      {children}
    </button>
  );
}

function Search() {
  const [query, setQuery] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  return <input value={query} onChange={onChange} />;
}
```

## Pytania

### Jak otypować komponent przyjmujący wszystkie atrybuty natywnego buttona? {#ts-react-q1}

`type Props = ComponentProps<'button'> & { variant?: ... }` i przekazać `...rest` do `<button>`. Komponent przyjmie `onClick`, `disabled`, `aria-*` itp. z poprawnymi typami.

### Jak otypować useState startujący od null? {#ts-react-q2}

`useState<User | null>(null)`. Bez tego TS wywnioskuje typ `null` i nie pozwoli ustawić użytkownika.
