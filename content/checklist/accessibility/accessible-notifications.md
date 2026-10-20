---
title: Dostępne powiadomienia (toasty)
priority: high
sources:
  - title: "MDN: ARIA live regions"
    url: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
---

Toasty są ogłaszane przez `role="status"` (lub `alert` dla pilnych), nie znikają zbyt szybko (błędy wcale), można je zamknąć i nie zabierają focusu.

## Dlaczego to ważne

- Toast "Zapisano zmiany" bez regionu live jest dla użytkownika czytnika niewidoczny; nie wie, czy zapis się udał.
- Komunikat znikający po 3 sekundach nie wystarcza osobom czytającym wolniej lub korzystającym z powiększenia ekranu; licznik zatrzymuj przy hover i focusie, a błędy zostawiaj do ręcznego zamknięcia.
- Przeniesienie focusu na toast przerywa pracę, np. wypełnianie formularza; komunikat ma zostać ogłoszony, a nie przejąć klawiaturę.
- Toast z akcją ("Cofnij") znikający po kilku sekundach odbiera tę akcję użytkownikom klawiatury; powiel ją w trwałym miejscu interfejsu.

## Jak sprawdzić

Wywołaj powiadomienie z czytnikiem ekranu; sprawdź, czy jest ogłaszane raz, ile trwa wyświetlanie i czy przycisk zamknięcia działa z klawiatury.

## Kod

```tsx title="Toaster.tsx"
// Live regions are rendered once at app start and stay in the DOM (empty)
export function Toaster({ toasts, dismiss }: ToasterProps) {
  const urgent = toasts.filter((t) => t.type === "error");
  const polite = toasts.filter((t) => t.type !== "error");
  return (
    <div className="toaster">
      <div role="status" aria-live="polite">
        {polite.map((t) => <Toast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />)}
      </div>
      <div role="alert">
        {urgent.map((t) => <Toast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </div>
  );
}
```

```tsx title="Toast.tsx"
const DURATION: Record<ToastType, number | null> = { success: 5000, info: 7000, warning: 10000, error: null };

export function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const ms = DURATION[toast.type];
    if (ms === null || paused) return; // errors stay until dismissed
    const timer = setTimeout(onDismiss, ms);
    return () => clearTimeout(timer);
  }, [toast.type, paused, onDismiss]);

  return (
    <div className="toast" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
         onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <p>{toast.message}</p>
      <button type="button" onClick={onDismiss} aria-label="Zamknij powiadomienie">×</button>
    </div>
  );
}
```

## Częste błędy

- Region live tworzony razem z toastem (`{show && <div role="status">...}`), przez co komunikat często nie jest ogłaszany.
- Animacja wjazdu toastu bez wyłączenia przy `prefers-reduced-motion: reduce`.
