---
title: Server-Sent Events, WebSocket i polling
level: mid
tags:
  - SSE
  - EventSource
  - WebSocket
  - long polling
  - real-time
  - streaming
summary: SSE to jednokierunkowy strumień zdarzeń z serwera do przeglądarki przez zwykły HTTP. WebSocket to dwukierunkowy kanał. Polling to cykliczne odpytywanie serwera.
sources:
  - title: "MDN: Using server-sent events"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
  - title: "WHATWG HTML Living Standard: Server-sent events"
    url: https://html.spec.whatwg.org/multipage/server-sent-events.html
  - title: "MDN: The WebSocket API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
  - title: "RFC 6455: The WebSocket Protocol"
    url: https://www.rfc-editor.org/rfc/rfc6455
  - title: "javascript.info: Server Sent Events"
    url: https://javascript.info/server-sent-events
---

## Wyjaśnienie

| | Polling / long polling | Server-Sent Events (SSE) | WebSocket |
|---|---|---|---|
| Kierunek | klient pyta | **serwer → klient** | **dwukierunkowy** |
| Protokół | HTTP | HTTP (`text/event-stream`) | `ws://` / `wss://` (upgrade z HTTP) |
| API w przeglądarce | `fetch` w pętli | `EventSource` | `WebSocket` |
| Automatyczne wznawianie | ręcznie | **wbudowane** (`retry`, `Last-Event-ID`) | ręcznie |
| Dane | dowolne | tekst (zwykle JSON w `data:`) | tekst i binarne |
| Proxy, CDN, auth przez cookies | bezproblemowe | bezproblemowe (zwykły HTTP) | czasem wymaga konfiguracji |

**Kiedy co:**

- **SSE**: powiadomienia, statusy zamówienia, kursy i ceny na żywo, postęp długiego zadania, **strumieniowanie odpowiedzi LLM** (typowe w aplikacjach AI).
- **WebSocket**: czat, gry, współdzielona edycja, wszystko, gdzie klient też często wysyła dane.
- **Polling**: rzadkie zmiany, najprostsza infrastruktura. **Long polling**: serwer trzyma zapytanie otwarte, aż pojawią się dane.

Uwagi o SSE: przy HTTP/1.1 przeglądarka ma limit ok. 6 połączeń na domenę (dotyczy też otwartych strumieni SSE); przy HTTP/2 problem znika dzięki multipleksingowi. `EventSource` nie pozwala ustawić własnych nagłówków (np. `Authorization`), dlatego używa się cookies albo odczytu strumienia przez `fetch`.

## Kod

```js
// Client: Server-Sent Events
const events = new EventSource('/api/bookings/42/status');
events.addEventListener('status', (e) => updateStatus(JSON.parse(e.data)));
events.onerror = () => console.warn('Connection lost, the browser will retry');
// events.close() when no longer needed

// Server (Node.js/Express): stream events
app.get('/api/bookings/:id/status', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  const timer = setInterval(() => {
    res.write(`event: status\ndata: ${JSON.stringify({ state: 'confirmed' })}\n\n`);
  }, 5000);
  req.on('close', () => clearInterval(timer));
});

// WebSocket: two-way
const ws = new WebSocket('wss://chat.example.com');
ws.onmessage = (e) => addMessage(JSON.parse(e.data));
ws.onopen = () => ws.send(JSON.stringify({ type: 'join', room: 'kreta' }));
```

## Pytania

### Czym są Server-Sent Events? {#http-realtime-q1}

Standardem HTML, w którym serwer utrzymuje otwartą odpowiedź HTTP typu `text/event-stream` i wysyła do przeglądarki kolejne zdarzenia. Komunikacja jest jednokierunkowa (serwer → klient), a obiekt `EventSource` automatycznie wznawia połączenie. Używa się ich do powiadomień, statusów i strumieniowania odpowiedzi.

### SSE czy WebSocket? {#http-realtime-q2}

SSE, gdy dane płyną głównie z serwera do klienta: prostsze, działa na zwykłym HTTP (cache, proxy, cookies), ma automatyczne wznawianie. WebSocket, gdy potrzebna jest częsta, dwukierunkowa komunikacja o niskim opóźnieniu lub dane binarne (czat, gry, edycja zespołowa). Konsekwencja długofalowa: WebSocket wymaga zwykle osobnej infrastruktury (sticky sessions, skalowanie połączeń).

### Czym jest long polling? {#http-realtime-q3}

Klient wysyła zapytanie, a serwer trzyma je otwarte, dopóki nie pojawią się nowe dane (lub nie minie timeout); po odpowiedzi klient od razu wysyła następne. Daje efekt "prawie czasu rzeczywistego" bez SSE i WebSocket, kosztem większej liczby zapytań.

## Quiz

### Jakiego API użyjesz, by serwer jednostronnie wysyłał do przeglądarki powiadomienia przez zwykły HTTP? {#http-realtime-z1}

- [x] Server-Sent Events (EventSource)
- [ ] WebSocket
- [ ] XMLHttpRequest synchroniczny
- [ ] Service Worker Cache API

SSE to jednokierunkowy strumień `text/event-stream` z automatycznym wznawianiem.
