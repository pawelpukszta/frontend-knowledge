---
title: Nowoczesne formaty (WebP, AVIF)
priority: high
---

Zdjęcia serwuj jako AVIF lub WebP zamiast JPEG i PNG. WebP jest zwykle o 25-35% mniejszy od JPEG, AVIF często o 40-50%. Oba działają we wszystkich aktualnych przeglądarkach.

## Dlaczego to ważne

- Obrazy to zwykle największa część wagi strony; zmniejszenie zdjęć o jedną trzecią skraca ładowanie listy ofert na słabym LTE o sekundy.
- Mniejszy obraz hero to szybsze LCP, które Google wykorzystuje w ocenie jakości strony (próg 2,5 s dla 75. percentyla).
- Mniej przesłanych bajtów to niższe rachunki za transfer CDN i mniejsze zużycie pakietu danych u użytkowników mobilnych.

## Jak sprawdzić

Lighthouse (sekcja o dostarczaniu obrazów), kolumna Type w Network; porównaj rozmiary przed i po konwersji.

## Kod

```js title="scripts/convert-images.mjs"
// Generate AVIF and WebP next to every JPEG/PNG source (sharp 0.34)
import { glob } from 'node:fs/promises';
import sharp from 'sharp';

for await (const file of glob('src/assets/photos/**/*.{jpg,jpeg,png}')) {
  const base = file.replace(/\.(jpe?g|png)$/i, '');
  const img = sharp(file).rotate(); // apply EXIF orientation; metadata is stripped on output
  await Promise.all([
    img.clone().avif({ quality: 50, effort: 4 }).toFile(`${base}.avif`),
    img.clone().webp({ quality: 75 }).toFile(`${base}.webp`),
  ]);
  console.log('converted', file);
}
```

## Częste błędy

- Konwersja logo, ikon i zrzutów z ostrymi krawędziami do stratnego formatu zamiast SVG lub bezstratnego WebP.
- Serwowanie AVIF bez fallbacku tam, gdzie obraz trafia też do maili lub starych webview.
