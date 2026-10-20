---
title: Akordeon obsługiwany klawiaturą
priority: medium
sources:
  - title: "W3C APG: Accordion Pattern"
    url: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
---

Nagłówek sekcji to `<button>` wewnątrz nagłówka (`<h3>`) z `aria-expanded` i `aria-controls`, otwierany Enterem i Spacją. Proste przypadki obsłuży natywne `<details>`/`<summary>`, a atrybut `name` daje wariant "jedna sekcja otwarta naraz".

## Dlaczego to ważne

- Nagłówek zrobiony z `div` z `onClick` jest nieosiągalny Tabem; użytkownik klawiatury nie rozwinie sekcji "Warunki anulacji" i nie pozna kosztów rezygnacji.
- `aria-expanded` mówi czytnikowi "zwinięte" lub "rozwinięte"; bez niego użytkownik nie wie, że kliknięcie coś odsłoniło.
- Przycisk wewnątrz nagłówka zachowuje strukturę nagłówków, po której użytkownicy czytników skaczą klawiszem H.

## Jak sprawdzić

Rozwiń i zwiń sekcje klawiaturą, sprawdź ogłaszany stan oraz to, że treść zwiniętych paneli nie jest osiągalna Tabem.

## Kod

```html title="Natywnie"
<details name="faq">
  <summary>Czy mogę zmienić termin wyjazdu?</summary>
  <p>Tak, do 30 dni przed wylotem bez dodatkowych opłat.</p>
</details>
<details name="faq">
  <summary>Co obejmuje ubezpieczenie?</summary>
  <p>Koszty leczenia, bagaż i rezygnację z podróży.</p>
</details>
```

```html title="Wzorzec APG"
<h3>
  <button type="button" id="cancel-btn" aria-expanded="false" aria-controls="cancel-panel">
    Warunki anulacji
  </button>
</h3>
<div id="cancel-panel" role="region" aria-labelledby="cancel-btn" hidden>
  <p>Bezpłatna anulacja do 14 dni przed przyjazdem.</p>
</div>
<script>
  const btn = document.getElementById("cancel-btn");
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    document.getElementById("cancel-panel").hidden = open;
  });
</script>
```

## Częste błędy

- Zwijanie przez `height: 0` bez `hidden` lub `display: none`; linki w zwiniętym panelu nadal są w kolejności Tab.
- `role="region"` na każdym panelu przy wielu sekcjach; APG odradza to przy więcej niż ok. 6 panelach, bo zaśmieca listę landmarków.
