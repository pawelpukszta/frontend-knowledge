---
title: Bez komentarzy i kodu debugowego na produkcji
priority: medium
---

Komentarze HTML, zakomentowane bloki i elementy testowe zwiększają rozmiar i mogą ujawniać informacje o systemie.

## Dlaczego to ważne

- Źródło strony widzi każdy: nazwy wewnętrznych systemów, adresy stagingu, nazwiska i notatki TODO o lukach to darmowy rekonesans dla atakującego.
- Zakomentowane bloki zwiększają rozmiar HTML, który przy SSR jest generowany i przesyłany przy każdym żądaniu.
- Ukryte panele debugowe i `console.log` z danymi rezerwacji nie powinny trafić na produkcję; atrybuty `data-testid` są akceptowalne.

## Jak sprawdzić

Źródło strony produkcyjnej (wyszukaj `<!--`); skan wyniku builda w CI.

## Kod

```html title="Źle"
<!-- TODO: remove before launch, old CMS at /cms-old (login: test) -->
<!-- <div class="promo-banner">Black Friday -30%</div> -->
<button class="debug-reset" style="display:none" onclick="resetCart()">Reset</button>
```

```bash title="CI"
# Fail the build if TODO/DEBUG comments or debug markers leak into production HTML
if grep -rEn "<!-- ?(TODO|FIXME|DEBUG)|debug-reset" dist --include="*.html"; then
  echo "Debug artifacts found in build output"
  exit 1
fi
```

## Częste błędy

- Usuwanie wszystkich komentarzy z wyniku SSR: znaczniki Reacta, np. `<!--$-->`, są częścią mechanizmu hydracji.
