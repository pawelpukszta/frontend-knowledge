---
title: Mechanizmy pomijania bloków treści
priority: medium
---

Poza skip linkiem pomijanie umożliwiają landmarki i nagłówki. Skip link musi faktycznie przenosić focus (cel z `id`, w razie potrzeby `tabindex="-1"`).

## Dlaczego to ważne

- Jeśli skip link przewija tylko widok, a focus zostaje na górze, następny Tab wraca do menu i link jest bezużyteczny.
- W SPA z routerem po stronie klienta link z `#main` bywa przechwytywany przez router; trzeba sprawdzić, czy nie zmienia trasy zamiast przenieść focus.
- Landmarki (`main`, `nav`) i nagłówki dają użytkownikom czytników dodatkowe, szybsze sposoby pomijania niż sam skip link.

## Jak sprawdzić

Aktywuj skip link i naciśnij Tab: następny element powinien być w treści głównej.

## Kod

```tsx title="Skip link odporny na router w SPA"
export function SkipLink() {
  return (
    <a
      href="#main"
      className="skip-link"
      onClick={(e) => {
        e.preventDefault(); // keep the client router from treating it as navigation
        const main = document.getElementById("main");
        main?.setAttribute("tabindex", "-1");
        main?.focus();
      }}
    >
      Przejdź do treści
    </a>
  );
}
```

## Częste błędy

- Cel skip linka bez `id` lub z `id` wewnątrz elementu ukrytego `display: none`.
