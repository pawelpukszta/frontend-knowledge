---
title: Klawiatura i focus management
level: senior
added: 2026-10-20
tags:
  - focus
  - tabindex
  - keyboard
  - dialog
  - focus trap
  - focus-visible
summary: "Wszystko, co działa myszą, musi działać z klawiatury. W aplikacjach SPA to Ty zarządzasz focusem: w modalach, po zmianie trasy i po usunięciu elementów."
sources:
  - title: "MDN: Keyboard-navigable JavaScript widgets"
    url: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets
  - title: "MDN: The dialog element"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
  - title: "W3C APG: Dialog (Modal) Pattern"
    url: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
  - title: "MDN: :focus-visible"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
---

## Wyjaśnienie

**Podstawy:**

- Kolejność Tab wynika z kolejności w DOM. Nie przestawiaj jej `tabindex` > 0.
- `tabindex="0"`: element dodany do naturalnej kolejności. `tabindex="-1"`: fokusowalny tylko programowo (`el.focus()`).
- Widoczny focus: nigdy `outline: none` bez zamiennika. `:focus-visible` pokazuje obwódkę przy nawigacji klawiaturą, nie przy kliknięciu.

**Focus management w SPA:**

- **Modal**: po otwarciu focus do środka (pierwszy element lub nagłówek), **focus trap** (Tab nie wychodzi poza modal), Escape zamyka, po zamknięciu focus **wraca** na element, który otworzył modal. Natywny `<dialog>` z `showModal()` daje większość tego za darmo (także `inert` dla tła).
- **Zmiana trasy**: przenieś focus na `h1` nowej strony lub ogłoś zmianę; inaczej czytnik zostaje "w próżni".
- **Usunięcie elementu z focusem**: przenieś focus na sensowny sąsiedni element.
- **Roving tabindex**: w złożonych widgetach (tabs, menu, grid) jeden element grupy ma `tabindex="0"`, reszta `-1`, a strzałki przenoszą focus.
- Atrybut `inert` wyłącza interakcję i focus w całym poddrzewie.

## Kod

```tsx
function BookingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal(); // focus moves inside, background becomes inert
    if (!open && dialog.open) dialog.close();     // focus returns to the opener
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="booking-title">
      <h2 id="booking-title">Potwierdź rezerwację</h2>
      <button onClick={onClose}>Zamknij</button>
    </dialog>
  );
}
```

## Pytania

### Jak powinien działać dostępny modal? {#a11y-keyboard-focus-q1}

Po otwarciu focus trafia do środka, Tab krąży tylko po elementach modala (focus trap), tło jest nieaktywne (`inert`), Escape zamyka, a po zamknięciu focus wraca do elementu, który otworzył modal. Modal ma rolę dialog i nazwę (`aria-labelledby`). Natywny `<dialog>` z `showModal()` realizuje większość z tego automatycznie.

### Co to jest :focus-visible? {#a11y-keyboard-focus-q2}

Pseudoklasa pasująca, gdy przeglądarka uzna, że focus powinien być widoczny (zwykle przy nawigacji klawiaturą). Pozwala ukryć obwódkę po kliknięciu myszą, bez odbierania jej użytkownikom klawiatury.

### Co robisz z focusem po zmianie trasy w SPA? {#a11y-keyboard-focus-q3}

Przenoszę go na główny nagłówek nowej strony (z `tabindex="-1"`) lub na kontener treści i aktualizuję `document.title`, ewentualnie ogłaszam zmianę przez live region. Bez tego użytkownik czytnika nie wie, że strona się zmieniła.

## Quiz

### Co powinno się stać z focusem po zamknięciu modala? {#a11y-keyboard-focus-z1}

- [ ] Zostać na body
- [x] Wrócić na element, który otworzył modal
- [ ] Przejść na pierwszy link strony
- [ ] Nic, przeglądarka sama zdecyduje

Powrót focusu zachowuje kontekst użytkownika klawiatury i czytnika ekranu.
