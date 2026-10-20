---
title: Instrukcje nie opierają się tylko na zmysłach
priority: high
---

"Kliknij zielony przycisk po prawej" nie pomoże osobie niewidomej ani daltoniście. Instrukcja wskazuje element po nazwie lub etykiecie, a kształt, kolor czy położenie mogą być tylko dodatkiem.

## Dlaczego to ważne

- Osoba niewidoma nie widzi "prawej strony" ani koloru; na telefonie układ i tak się przestawia, więc "po prawej" bywa nieprawdą.
- Ok. 8% mężczyzn ma zaburzenia rozpoznawania barw; "zielony" i "czerwony" przycisk mogą wyglądać tak samo.
- To kryterium WCAG 1.3.3 (poziom A), a pokrewne 1.4.1 zabrania przekazywania informacji wyłącznie kolorem.

## Jak sprawdzić

Przejrzyj teksty instrukcji i komunikatów pod kątem odwołań do koloru, kształtu, położenia lub dźwięku; każda instrukcja powinna działać także po odczytaniu na głos.

## Kod

```html title="Źle"
<p>Pola oznaczone na czerwono są wymagane. Aby kontynuować, kliknij okrągły przycisk po prawej.</p>
```

```html title="Dobrze"
<p>Pola oznaczone gwiazdką (*) są wymagane. Aby kontynuować, wybierz przycisk "Przejdź do płatności".</p>
<button type="submit">Przejdź do płatności</button>
```

## Częste błędy

- Sygnał dźwiękowy jako jedyne potwierdzenie (np. zeskanowania kodu) bez komunikatu tekstowego.
