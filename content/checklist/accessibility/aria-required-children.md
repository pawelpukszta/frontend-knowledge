---
title: Role ARIA zawierają wymagane role-dzieci
priority: high
---

Niektóre role wymagają konkretnych dzieci, np. `list` → `listitem`, `tablist` → `tab`, `listbox` → `option`, `menu` → `menuitem`. Bez nich czytnik nie zrozumie struktury widgetu.

## Dlaczego to ważne

- Czytnik ogłasza strukturę na podstawie dzieci: "lista, 5 elementów", "karta 2 z 4". Bez właściwych ról tej informacji nie ma, a nawigacja strzałkami w widgecie przestaje działać.
- Najczęstsza przyczyna to dzieci z inną rolą, np. zwykłe `<button>` w `role="tablist"` zamiast elementów z `role="tab"`.
- axe przypisuje regułę do WCAG 1.3.1 Info and Relationships (A): relacje widoczne na ekranie muszą być dostępne programowo.

## Jak sprawdzić

axe (reguła `aria-required-children`) lub drzewo dostępności w DevTools.

## Kod

```html title="Źle"
<div role="tablist" aria-label="Typ wyjazdu">
  <button>Wczasy</button>
  <button>City break</button>
</div>
```

```html title="Dobrze"
<div role="tablist" aria-label="Typ wyjazdu">
  <button role="tab" id="t-beach" aria-selected="true" aria-controls="p-beach">Wczasy</button>
  <button role="tab" id="t-city" aria-selected="false" aria-controls="p-city" tabindex="-1">City break</button>
</div>
```

## Częste błędy

- Nadanie roli kontenera (`menu`, `listbox`, `grid`) "dla porządku": rola zobowiązuje do pełnego wzorca, łącznie z obsługą klawiatury.
