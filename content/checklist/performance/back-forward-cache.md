---
title: Strony gotowe na bfcache
priority: high
sources:
  - title: "web.dev: Back/forward cache"
    url: https://web.dev/articles/bfcache
---

Powrót przyciskiem Wstecz może być natychmiastowy, jeśli strona trafi do back/forward cache. Blokują to m.in. listenery `unload`, `Cache-Control: no-store` na dokumencie, otwarte połączenia (WebSocket, IndexedDB) i `window.opener`.

## Dlaczego to ważne

- Wg danych Chrome ok. 1 na 10 nawigacji na desktopie i 1 na 5 na mobile to Wstecz lub Dalej; typowy scenariusz to lista ofert, karta hotelu, powrót do listy.
- Przywrócenie z bfcache jest natychmiastowe i zachowuje stan strony (przewinięcie, filtry, wpisany tekst), bez ponownego pobierania i wykonywania JS.
- Listener `unload` na desktopowym Chrome całkowicie wyklucza stronę z bfcache, a często dodaje go skrypt firmy trzeciej.

## Jak sprawdzić

DevTools → Application → Back/forward cache → Test (pokazuje powody blokady); w produkcji `PerformanceNavigationTiming.notRestoredReasons` i odsetek przywróceń zbierany w RUM.

## Kod

```js title="Źle"
window.addEventListener('unload', () => {
  sendAnalytics({ event: 'page_exit' }); // makes the page ineligible on desktop Chrome
});
```

```js title="Dobrze"
addEventListener('pagehide', () => {
  navigator.sendBeacon('/api/analytics', JSON.stringify({ event: 'page_exit' }));
});

addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Restored from bfcache: refresh data that may be stale
    refreshCartBadge();
    refreshAvailability();
  }
});
```

## Częste błędy

- Pozostawianie otwartego WebSocketu lub połączenia z IndexedDB przy opuszczaniu strony zamiast zamknięcia go w `pagehide`.
- `no-store` na stronach bez danych wrażliwych; dla zwykłych treści wystarczy `no-cache`.
