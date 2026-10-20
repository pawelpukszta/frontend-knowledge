---
title: Elementy li tylko wewnątrz list
priority: medium
---

`<li>` poza `<ul>`, `<ol>` lub `<menu>` traci znaczenie elementu listy.

## Dlaczego to ważne

- Bez rodzica-listy czytnik nie powie, ile jest elementów ani który jest aktualny ("3 z 8").
- Zwykle wynika z rozbicia na komponenty, gdzie `li` renderuje się w `div` zamiast w `ul`.

## Jak sprawdzić

axe (`listitem`).

## Kod

```tsx title="Źle"
<div className="results">
  {offers.map((o) => <li key={o.id}>{o.title}</li>)}
</div>
```

```tsx title="Dobrze"
<ul className="results">
  {offers.map((o) => <li key={o.id}>{o.title}</li>)}
</ul>
```
