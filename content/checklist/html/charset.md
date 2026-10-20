---
title: Kodowanie UTF-8
priority: critical
---

`<meta charset="utf-8">` jako pierwszy element head (w pierwszych 1024 bajtach). Inaczej polskie znaki mogą wyświetlić się błędnie.

## Dlaczego to ważne

- Bez deklaracji przeglądarka zgaduje kodowanie; "Zażółć gęślą jaźń" odczytane jako Windows-1250 zamienia się w "ZaĹĽĂłĹ‚Ä‡ gÄ™Ĺ›lÄ… jaĹşĹ„", a strona traci wiarygodność.
- Deklaracja musi znaleźć się w pierwszych 1024 bajtach; jeśli wcześniej stoją długie skrypty lub tagi Open Graph, przeglądarka może zacząć parsowanie od nowa lub użyć złego kodowania.
- BOM ma pierwszeństwo przed nagłówkiem HTTP `Content-Type`, a ten przed meta; wszystkie źródła muszą wskazywać UTF-8.

## Jak sprawdzić

Źródło strony (meta na początku head) i nagłówek `Content-Type` w panelu Network.

## Kod

```html
<head>
  <meta charset="utf-8"> <!-- first element in head -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Last minute: Turcja, Egipt, Grecja</title>
</head>
```

```http title="Odpowiedź serwera"
HTTP/2 200
content-type: text/html; charset=utf-8
```

## Częste błędy

- `<meta charset>` umieszczony po skryptach analitycznych i dziesiątkach tagów meta.
- Serwer wysyłający `charset=iso-8859-2` dla plików zapisanych w UTF-8.
