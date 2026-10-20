---
title: Progresywny JPEG
priority: low
---

Progresywne kodowanie pokazuje najpierw całą rozmytą wersję obrazu, a potem ją wyostrza, co poprawia odczuwalną szybkość dużych zdjęć tam, gdzie wciąż serwujesz JPEG.

## Dlaczego to ważne

- Na wolnym łączu użytkownik od razu widzi kompozycję zdjęcia zamiast obrazu ładowanego paskami od góry.
- Przy dużych zdjęciach progresywny JPEG (z mozjpeg) jest często nawet nieco mniejszy od bazowego.
- JPEG pozostaje fallbackiem w `<picture>` i formatem dla maili oraz podglądów linków, więc warto zadbać i o niego.

## Jak sprawdzić

ImageMagick `identify -verbose` (pole `Interlace: JPEG`) lub ustawienia narzędzia do kompresji; wizualnie przy throttlingu "Slow 3G".

## Kod

```js title="sharp: progresywny JPEG"
import sharp from 'sharp';

await sharp('src/hero-santorini.jpg')
  .resize({ width: 1600, withoutEnlargement: true })
  .jpeg({ quality: 80, progressive: true, mozjpeg: true }) // mozjpeg: better compression
  .toFile('public/img/hero-santorini.jpg');
```

```bash title="Weryfikacja"
identify -verbose public/img/hero-santorini.jpg | grep -i interlace
# Interlace: JPEG  -> progressive
# Interlace: None  -> baseline

# Check all JPEG files at once
identify -format "%f %[interlace]\n" public/img/*.jpg
```

## Częste błędy

- Traktowanie progresywnego JPEG jako zamiennika AVIF lub WebP; to tylko poprawa fallbacku.
