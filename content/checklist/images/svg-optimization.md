---
title: Zoptymalizowane pliki SVG
priority: medium
---

SVGO usuwa metadane edytorów, zbędne grupy i nadmierną precyzję współrzędnych, często zmniejszając plik o połowę. Uruchamiaj go automatycznie w buildzie lub przy commicie.

## Dlaczego to ważne

- Pliki eksportowane z Figmy czy Illustratora zawierają komentarze, identyfikatory warstw i współrzędne z sześcioma miejscami po przecinku, które nic nie zmieniają wizualnie.
- Mniejsze SVG inline to mniejszy HTML, a więc szybszy pierwszy render.
- Optymalizacja usuwa też zbędne skrypty i atrybuty edytora, choć nie zastępuje sanityzacji SVG wgrywanych przez użytkowników.

## Jak sprawdzić

Porównanie rozmiaru przed i po SVGO; krok w buildzie lub hooku przed commitem; wizualne sprawdzenie, że ikony się nie zmieniły.

## Kod

```js title="svgo.config.mjs (SVGO 4)"
export default {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    'preset-default',     // in SVGO 4 it keeps viewBox and title by default
    'removeDimensions',   // drop width/height, size icons with CSS
    { name: 'removeAttrs', params: { attrs: ['data-name', 'class'] } },
  ],
};
```

```json title="package.json"
{
  "scripts": {
    "icons:optimize": "svgo -r -f src/icons -o public/icons",
    "prebuild": "npm run icons:optimize"
  }
}
```

## Częste błędy

- Usunięcie `viewBox`, przez co ikona przestaje się skalować.
- Zbyt niska precyzja (`floatPrecision: 0`) dla złożonych ilustracji, która deformuje kształty.
