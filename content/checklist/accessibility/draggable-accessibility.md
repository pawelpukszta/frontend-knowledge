---
title: Dostępne przeciąganie i upuszczanie
priority: medium
sources:
  - title: "W3C Understanding 2.5.7: Dragging Movements"
    url: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
---

Każda operacja drag and drop ma alternatywę wykonywaną pojedynczym kliknięciem lub stuknięciem (WCAG 2.2 SC 2.5.7, AA) oraz obsługę z klawiatury (2.1.1): przyciski, menu, pola wyboru.

## Dlaczego to ważne

- Osoby z drżeniem rąk, korzystające z trackballa, wskaźnika głowowego lub sterowania głosem nie utrzymają przycisku wciśniętego podczas przesuwania.
- Na telefonie przeciąganie koliduje z przewijaniem strony; przyciski "w górę/w dół" są szybsze i pewniejsze.
- Upload pliku przez przeciąganie zawsze potrzebuje zwykłego `<input type="file">` jako alternatywy.

## Jak sprawdzić

Wykonaj zmianę kolejności lub upload tylko klawiaturą i tylko pojedynczymi kliknięciami; czytnik powinien ogłosić nową pozycję.

## Kod

```tsx title="Dobrze: alternatywa dla sortowania przeciąganiem"
<ol aria-label="Kolejność zwiedzania">
  {stops.map((stop, i) => (
    <li key={stop.id} draggable onDragStart={() => startDrag(i)}>
      {stop.name}
      <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0}
        aria-label={`Przesuń ${stop.name} wyżej`}>↑</button>
      <button type="button" onClick={() => move(i, i + 1)} disabled={i === stops.length - 1}
        aria-label={`Przesuń ${stop.name} niżej`}>↓</button>
    </li>
  ))}
</ol>
<p role="status">{announcement /* e.g. "Akropol przeniesiony na pozycję 2 z 5" */}</p>
```

## Częste błędy

- Biblioteka drag and drop z "obsługą klawiatury" przez nietypowe skróty, o których nikt nie informuje.
