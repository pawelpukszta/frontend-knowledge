---
title: Kompresja bez widocznej straty jakości
priority: high
sources:
  - title: Squoosh
    url: https://squoosh.app/
---

Jakość ok. 75-85 dla JPEG i WebP (dla AVIF zwykle niższa wartość liczbowa, ok. 45-60) nie daje widocznej różnicy, a znacząco zmniejsza plik. Porównuj wizualnie, np. w Squoosh.

## Dlaczego to ważne

- Różnica między jakością 100 a 80 bywa dwu-, trzykrotna w rozmiarze, a na ekranie telefonu praktycznie niewidoczna.
- Skale jakości różnych enkoderów nie są porównywalne: "50" w AVIF to nie to samo co "50" w JPEG, dlatego decyduj na podstawie podglądu, a nie samej liczby.
- Zbyt agresywna kompresja daje artefakty na twarzach, tekstach i gradientach nieba, co obniża postrzeganą jakość oferty.

## Jak sprawdzić

Porównanie wersji w Squoosh (widok podzielony), rozmiary plików; przegląd przy 100% powiększenia na zdjęciach z twarzami i tekstem.

## Kod

```bash title="Kompresja z linii poleceń"
# WebP at quality 80, metadata removed
cwebp -q 80 -metadata none hotel-kreta.jpg -o hotel-kreta.webp

# AVIF (libavif 1.x): -q is quality 0-100, -s is speed (lower = smaller, slower)
avifenc -q 60 -s 6 hotel-kreta.jpg hotel-kreta.avif

ls -lh hotel-kreta.*
```

## Częste błędy

- Wielokrotna kompresja stratna tego samego pliku (np. JPEG z CMS ponownie kompresowany przez CDN), która kumuluje artefakty.
