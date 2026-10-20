---
title: Schema VideoObject
priority: medium
sources:
  - title: "Google: Video structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/video
---

`VideoObject` z `name`, `thumbnailUrl` i `uploadDate` (wymagane) oraz `description`, `duration` i `contentUrl` lub `embedUrl` (zalecane) pozwala pokazać wideo w wynikach, zakładce Filmy i Discover.

## Dlaczego to ważne

- Bez danych strukturalnych Google musi sam wykryć wideo i jego metadane; często nie pokaże miniatury przy wyniku.
- `contentUrl` do pliku wideo pozwala Google pobrać i zrozumieć film, a znaczniki `Clip` lub `SeekToAction` umożliwiają kluczowe momenty (przejście do fragmentu) w wynikach.
- Wideo musi być głównym elementem strony i być dostępne bez logowania; film wstawiony jako dodatek do artykułu zwykle nie zostanie zindeksowany jako wideo strony.

## Jak sprawdzić

Rich Results Test, raport Filmy w Search Console.

## Kod

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Hotel Olimp na Krecie: spacer po hotelu i plaży",
  "description": "Pięciominutowy film z pokojami, basenami i plażą hotelu Olimp w Chanii.",
  "thumbnailUrl": ["https://example.pl/video/olimp-thumb-16x9.jpg"],
  "uploadDate": "2026-06-02T10:00:00+02:00",
  "duration": "PT5M12S",
  "contentUrl": "https://cdn.example.pl/video/olimp-tour.mp4",
  "embedUrl": "https://example.pl/embed/olimp-tour"
}
</script>
```

## Częste błędy

- Miniatura zablokowana w robots.txt lub dostępna tylko po zalogowaniu.
