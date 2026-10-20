---
title: Responsywne obrazy
priority: high
---

Połączenie `srcset`/`sizes` dla rozdzielczości, `<picture>` z `media` dla art direction (inny kadr na mobile) oraz CSS, które pozwala obrazom się skalować (`max-width: 100%; height: auto`).

## Dlaczego to ważne

- Ten sam kadr panoramy hotelu na wąskim ekranie zamienia się w nieczytelny pasek; art direction pozwala pokazać ciaśniejszy kadr z basenem.
- Ruch mobilny dominuje w turystyce, więc obraz dopasowany do telefonu to oszczędność transferu dla większości użytkowników.
- Bez `max-width: 100%` szeroki obraz rozpycha układ i wywołuje poziome przewijanie na telefonie.

## Jak sprawdzić

Test na kilku szerokościach i gęstościach ekranu w trybie urządzenia DevTools; brak poziomego przewijania przy 320 px.

## Kod

```css title="Baza dla obrazów"
img,
picture {
  display: block;
  max-width: 100%;
  height: auto; /* keep ratio from width/height attributes */
}

.offer-card img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover; /* crop instead of distorting */
}
```

## Częste błędy

- Użycie `<picture>` z `media` tylko po to, by podać inną rozdzielczość tego samego kadru; do tego wystarczy `srcset` i `sizes`.
