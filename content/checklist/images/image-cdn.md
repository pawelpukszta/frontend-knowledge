---
title: Obrazy z CDN
priority: high
---

CDN obrazów dostarcza pliki z bliskiej lokalizacji, długo je cache'uje i często automatycznie dobiera format, rozmiar i jakość na podstawie parametrów URL oraz nagłówka `Accept`.

## Dlaczego to ważne

- Użytkownik z Gdańska i z Krakowa pobiera obraz z pobliskiego węzła, a nie z jednego serwera, co skraca czas pierwszego bajtu.
- Generowanie wariantów (szerokość, AVIF/WebP) na żądanie eliminuje ręczne przygotowywanie dziesiątek wersji każdego zdjęcia.
- Długi `Cache-Control` z `immutable` przy wersjonowanych adresach sprawia, że powracający użytkownik w ogóle nie pobiera obrazów ponownie.

## Jak sprawdzić

Nagłówki odpowiedzi obrazów (`Cache-Control`, `Content-Type`, nagłówek trafienia w cache, np. `cf-cache-status`, `x-cache`); porównaj czasy z kilku lokalizacji.

## Kod

```html title="Parametry transformacji w URL (Cloudinary)"
<img
  src="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/hotels/aegean-blue.jpg"
  srcset="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400/hotels/aegean-blue.jpg 400w,
          https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/hotels/aegean-blue.jpg 800w"
  sizes="(min-width: 768px) 50vw, 100vw"
  alt="Hotel Aegean Blue, basen" width="800" height="533" loading="lazy" />
```

```http title="Odpowiedź CDN"
HTTP/2 200
Content-Type: image/avif
Cache-Control: public, max-age=31536000, immutable
Vary: Accept
```

## Częste błędy

- Krótki czas cache przy niezmiennych, wersjonowanych plikach, przez co CDN co chwilę odpytuje origin.
