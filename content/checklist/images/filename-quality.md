---
title: Opisowe nazwy plików
priority: low
sources:
  - title: "Google: Image SEO best practices"
    url: https://developers.google.com/search/docs/appearance/google-images
---

`hotel-kreta-basen.webp` zamiast `IMG_1234.jpg`: małe litery, myślniki, kilka opisowych słów, bez polskich znaków i spacji. Pomaga w wyszukiwaniu grafik.

## Dlaczego to ważne

- Google wymienia nazwę pliku jako jeden z sygnałów o tematyce obrazu w Grafice Google; `IMG_1234.jpg` nie mówi nic.
- Polskie znaki i spacje w adresach są kodowane jako `%C4%85` czy `%20`, co psuje czytelność linków i bywa źródłem błędów 404 po migracjach.
- Opisowe nazwy ułatwiają pracę redakcji: łatwiej znaleźć i podmienić zdjęcie w CMS lub repozytorium.

## Jak sprawdzić

Przegląd nazw plików w CMS i repozytorium; crawler z filtrem obrazów pokaże nazwy typu `IMG_`, `DSC_`, `screenshot`.

## Kod

```ts title="Normalizacja nazwy przy uploadzie"
// Turn "Hotel Kreta, basen (1).JPG" into "hotel-kreta-basen-1.jpg"
export function toImageSlug(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  const base = dot > 0 ? fileName.slice(0, dot) : fileName;
  const ext = dot > 0 ? fileName.slice(dot + 1).toLowerCase() : 'jpg';
  const slug = base
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/ł/g, 'l').replace(/Ł/g, 'L')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'image'}.${ext}`;
}
```

## Częste błędy

- Upychanie słów kluczowych w nazwie (`tanie-wakacje-grecja-tanie-hotele-grecja.jpg`).
