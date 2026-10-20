---
title: Wskaźniki ładowania
priority: high
---

Skeletony, spinnery i paski postępu przy operacjach asynchronicznych zmniejszają odczuwalny czas oczekiwania i zapobiegają wielokrotnemu klikaniu. Skeleton o docelowym rozmiarze chroni też przed CLS.

## Dlaczego to ważne

- Bez sygnału zwrotnego użytkownik nie wie, czy kliknięcie zadziałało, i klika ponownie, co przy płatnościach i rezerwacjach grozi zduplikowanymi zamówieniami.
- Skeleton odwzorowujący układ docelowej treści sprawia, że czekanie wydaje się krótsze niż przy pustym ekranie lub samym spinnerze.
- Stan ładowania trzeba też ogłosić technologiom asystującym (`aria-busy`, region `aria-live`), inaczej użytkownik czytnika ekranu nie wie, że coś się dzieje.

## Jak sprawdzić

Przejdź kluczowe ścieżki (wyszukiwanie, filtrowanie, płatność) z throttlingiem sieci (Slow 4G) i sprawdź, czy każda akcja daje natychmiastową reakcję wizualną.

## Kod

```tsx title="Przycisk z blokadą podczas wysyłania (React 19)"
'use client';
import { useFormStatus } from 'react-dom';

export function BookButton() {
  const { pending } = useFormStatus(); // status of the parent <form action={...}>
  return (
    <button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? 'Rezerwujemy...' : 'Zarezerwuj za 4 999 zł'}
    </button>
  );
}
```

```css title="Skeleton o docelowym rozmiarze"
.offer-card--skeleton { height: 320px; border-radius: 12px; background: #e9edf2; }
@media (prefers-reduced-motion: no-preference) {
  .offer-card--skeleton { animation: pulse 1.5s ease-in-out infinite; }
}
@keyframes pulse { 50% { opacity: 0.6; } }
```

## Częste błędy

- Spinner pokazywany natychmiast przy operacjach trwających 100 ms: miga i daje wrażenie wolniejszego działania; lepiej pokazać go z opóźnieniem ok. 300 ms.
