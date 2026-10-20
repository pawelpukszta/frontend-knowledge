---
title: Obrazy w rozmiarze wyświetlania
priority: high
---

Nie wysyłaj obrazu 3000 px do miniatury 300 px. Szerokość pliku powinna odpowiadać szerokości na ekranie pomnożonej przez gęstość pikseli (zwykle do 2x).

## Dlaczego to ważne

- Plik czterokrotnie szerszy od potrzebnego ma ok. 16 razy więcej pikseli: to marnowany transfer, pamięć i czas dekodowania.
- Dekodowanie ogromnych obrazów obciąża główny wątek słabszych telefonów, co spowalnia przewijanie listy ofert.
- Za mały plik z kolei wygląda rozmyto na ekranach high-DPI, więc celem jest dopasowanie, a nie minimalizacja.

## Jak sprawdzić

Lighthouse (obrazy o niewłaściwym rozmiarze); w DevTools najechanie na `<img>` w Elements pokazuje wymiary renderowane i naturalne.

## Kod

```js title="Snippet do konsoli"
// Flag images at least 2x larger than needed for the current viewport and DPR
for (const img of document.images) {
  const needed = Math.ceil(img.clientWidth * devicePixelRatio);
  if (needed > 0 && img.naturalWidth > needed * 2) {
    console.warn(`${img.currentSrc}: natural ${img.naturalWidth}px, needed ~${needed}px`);
  }
}
```

## Częste błędy

- Jeden duży plik dla wszystkich urządzeń skalowany przez CSS `width: 100%`.
