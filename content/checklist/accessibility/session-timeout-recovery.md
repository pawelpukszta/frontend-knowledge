---
title: Brak utraty danych przy wygaśnięciu sesji
priority: high
sources:
  - title: "W3C Understanding 2.2.6: Timeouts"
    url: https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html
---

Ostrzeż przed wygaśnięciem i pozwól je przedłużyć prostą akcją, a po ponownym logowaniu przywróć wpisane dane (np. formularz rezerwacji). WCAG 2.2.1 (A), a dla wyższego poziomu 2.2.5 i 2.2.6 (AAA).

## Dlaczego to ważne

- Osoby korzystające z czytnika, przełączników lub piszące wolno potrzebują więcej czasu; utrata 10 minut wypełniania danych 4 podróżnych często kończy się porzuceniem rezerwacji.
- WCAG 2.2.1 wymaga m.in., by przed upływem czasu ostrzec i dać co najmniej 20 sekund na przedłużenie prostą akcją (np. jednym przyciskiem).
- WCAG 2.2.6 (AAA) zaleca informowanie o czasie bezczynności grożącym utratą danych, chyba że dane są przechowywane ponad 20 godzin.

## Jak sprawdzić

Skróć czas sesji na środowisku testowym i przejdź proces z przerwą; sprawdź ostrzeżenie czytnikiem ekranu i po ponownym logowaniu stan formularza.

## Kod

```tsx title="Ostrzeżenie przed wygaśnięciem"
export function SessionTimeoutWarning({ expiresAt, onExtend }: { expiresAt: number; onExtend: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const warnIn = expiresAt - Date.now() - 2 * 60_000; // warn 2 minutes before expiry
    const timer = setTimeout(() => dialogRef.current?.showModal(), Math.max(warnIn, 0));
    return () => clearTimeout(timer);
  }, [expiresAt]);
  return (
    <dialog ref={dialogRef} aria-labelledby="timeout-title">
      <h2 id="timeout-title">Twoja sesja wygaśnie za 2 minuty</h2>
      <p>Dane rezerwacji są zapisane. Chcesz kontynuować?</p>
      <button autoFocus onClick={() => { onExtend(); dialogRef.current?.close(); }}>Przedłuż sesję</button>
    </dialog>
  );
}
```

```ts title="Zapis szkicu formularza"
// Persist the booking draft so it can be restored after re-login
form.addEventListener("input", () => {
  const { cardNumber, cvc, ...safe } = Object.fromEntries(new FormData(form)); // never store payment data
  sessionStorage.setItem("booking-draft", JSON.stringify(safe));
});
```

## Częste błędy

- Przekierowanie na stronę logowania bez ostrzeżenia i bez zapamiętania, gdzie użytkownik był.
- Licznik czasu pokazany tylko wizualnie, bez komunikatu dla czytnika.
