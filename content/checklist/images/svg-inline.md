---
title: Rozsądne SVG inline
priority: medium
---

Inline tylko wtedy, gdy potrzebujesz stylować lub animować fragmenty przez CSS (np. `currentColor`, stany hover). Duże inline SVG powiększają HTML i nie są cache'owane; wtedy lepszy `<img>` lub sprite.

## Dlaczego to ważne

- SVG inline jest częścią dokumentu, więc pobiera się przy każdym wyświetleniu strony; ta sama ilustracja jako `<img>` trafia do cache raz.
- Kilkadziesiąt KB ilustracji wklejonych w HTML opóźnia odkrycie innych zasobów i zwiększa koszt hydratacji w aplikacjach React.
- Małe ikony inline z `currentColor` automatycznie dopasowują się do koloru tekstu, trybu ciemnego i stanu focus bez dodatkowych plików.

## Jak sprawdzić

Rozmiar dokumentu HTML w Network; wyszukanie dużych `<svg>` w szablonach i komponentach.

## Kod

```html title="Mała ikona inline vs duża ilustracja"
<!-- Small interactive icon: inline, inherits color -->
<button type="button" class="fav-btn" aria-pressed="false">
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
  </svg>
  Dodaj do ulubionych
</button>

<!-- Large illustration: external file, cached, lazy-loaded -->
<img src="/img/empty-search.svg" alt="" width="320" height="240" loading="lazy" />
```

## Częste błędy

- Inline SVG bez `aria-hidden` lub dostępnej nazwy; czytnik ekranu może odczytać zawartość lub nic.
