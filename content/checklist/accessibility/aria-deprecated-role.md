---
title: Nie używaj przestarzałych ról ARIA
priority: medium
---

Role wycofane ze specyfikacji, np. `directory` (przestarzała w WAI-ARIA 1.2) czy `doc-biblioentry` i `doc-endnote` z DPUB-ARIA, nie są wspierane przez technologie asystujące. Role abstrakcyjne (np. `widget`, `input`) wychwytuje osobna reguła `aria-roles`.

## Dlaczego to ważne

- Przestarzała rola może nie mieć żadnego mapowania w API dostępności, więc element po cichu traci semantykę.
- Stare role przetrwały zwykle w szablonach kopiowanych latami lub w nieaktualizowanych bibliotekach UI; reguła pomaga je namierzyć przy migracji.
- axe przypisuje regułę do WCAG 4.1.2 (A).

## Jak sprawdzić

axe (`aria-deprecated-role`).

## Kod

```html title="Źle"
<ul role="directory">
  <li><a href="#grecja">Grecja</a></li>
  <li><a href="#hiszpania">Hiszpania</a></li>
</ul>
```

```html title="Dobrze"
<nav aria-label="Spis treści">
  <ul>
    <li><a href="#grecja">Grecja</a></li>
    <li><a href="#hiszpania">Hiszpania</a></li>
  </ul>
</nav>
```
