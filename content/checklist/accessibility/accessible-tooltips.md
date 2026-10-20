---
title: Dostępne tooltipy
priority: medium
sources:
  - title: "W3C Understanding 1.4.13: Content on Hover or Focus"
    url: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
---

Tooltip pojawia się także przy focusie (nie tylko hover), da się go zamknąć Escape i nie znika, gdy najedziesz na niego kursorem (WCAG 1.4.13).

## Dlaczego to ważne

- Tooltip tylko na `:hover` jest niedostępny z klawiatury i na ekranach dotykowych; informacja o opłacie lub transferze ginie dla tych użytkowników.
- Osoby korzystające z powiększenia ekranu muszą przesunąć kursor na tooltip, żeby go przeczytać; jeśli znika po opuszczeniu wyzwalacza, treść jest dla nich nieosiągalna.
- Rola `tooltip` nie jest interaktywna: linki i przyciski w środku są nieosiągalne; do treści interaktywnej użyj popovera lub dialogu otwieranego kliknięciem.

## Jak sprawdzić

Najedź, sfokusuj i naciśnij Escape; sprawdź `aria-describedby`.

## Kod

```css
.tip { position: relative; }
.tip [role="tooltip"] { position: absolute; inset-block-end: 100%; display: none; }

/* Visible on hover (including over the tooltip itself) and on keyboard focus */
.tip:hover [role="tooltip"],
.tip:focus-within [role="tooltip"] { display: block; }

/* Dismissed with Esc until the pointer or focus leaves */
.tip.is-dismissed [role="tooltip"] { display: none; }
```

```html
<span class="tip">
  <button type="button" aria-describedby="tip-transfer">Transfer z lotniska</button>
  <span role="tooltip" id="tip-transfer">Wliczony w cenę, ok. 40 minut.</span>
</span>
<script>
  // Esc hides tooltips without moving focus (WCAG 1.4.13 "dismissible")
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.querySelectorAll(".tip").forEach((t) => t.classList.add("is-dismissed"));
  });
  for (const tip of document.querySelectorAll(".tip")) {
    tip.addEventListener("mouseleave", () => tip.classList.remove("is-dismissed"));
    tip.addEventListener("focusout", () => tip.classList.remove("is-dismissed"));
  }
</script>
```

## Częste błędy

- Tooltip w atrybucie `title`: nie pojawia się przy focusie ani na dotyku, a czytniki odczytują go niekonsekwentnie.
- Odstęp między wyzwalaczem a dymkiem, przez który tooltip znika, gdy kursor przesuwa się na jego treść.
