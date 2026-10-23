---
title: Debugowanie produkcji
level: senior
added: 2026-10-23
tags:
  - debugging
  - incydenty
  - source maps
  - hydration
  - traceparent
  - OpenTelemetry
summary: "Na produkcji nie masz debuggera przy użytkowniku, więc pracujesz na danych: zakres problemu, powiązanie z wydaniem, kontekst błędu i trace przez front i backend. Najpierw ograniczasz szkody, potem szukasz przyczyny."
sources:
  - title: "React: hydrateRoot (hydration mismatches, onRecoverableError)"
    url: https://react.dev/reference/react-dom/client/hydrateRoot
  - title: "W3C: Trace Context"
    url: https://www.w3.org/TR/trace-context/
  - title: "OpenTelemetry: Browser"
    url: https://opentelemetry.io/docs/languages/js/getting-started/browser/
  - title: "Sentry: Source maps (JavaScript)"
    url: https://docs.sentry.io/platforms/javascript/sourcemaps/
  - title: "Chrome DevTools: Source maps"
    url: https://developer.chrome.com/docs/devtools/javascript/source-maps
  - title: "Chrome DevTools: Throttling"
    url: https://developer.chrome.com/docs/devtools/settings/throttling
---

## Wyjaśnienie

Narzędzia (error tracking, RUM, Error Boundaries) opisuje temat o observability. Tutaj chodzi o to, jak ich użyć, gdy coś się pali.

**Pierwsze 10 minut po alercie o skoku błędów:**

1. **Zakres.** Ilu użytkowników, które strony, przeglądarki, kraje? Jeden błąd czy wiele różnych?
2. **Korelacja.** Czy skok zaczął się po ostatnim wdrożeniu, włączeniu flagi albo zmianie w zewnętrznym skrypcie? Error tracking z numerem wydania pokazuje to od razu.
3. **Decyzja.** Jeśli przyczyną jest świeża zmiana, a błąd dotyka ważnej ścieżki, wycofaj ją: rollback albo wyłączenie flagi. Diagnozę robisz potem, na spokojnie.
4. **Komunikacja.** Krótka wiadomość na kanale incydentów: co widać, kogo dotyczy, co robisz, kiedy kolejna aktualizacja. Support wie, co odpowiadać klientom.

**Błąd, którego nie odtwarzasz lokalnie.** Zbierz kontekst: przeglądarka i wersja, urządzenie, wydanie, ścieżka użytkownika (breadcrumbs, session replay), żądania sieciowe z logów i trace. Lokalnie odtwarzaj na buildzie produkcyjnym, nie na dev serverze, bo minifikacja, inny tryb React i cache zmieniają zachowanie. Włącz throttling CPU i sieci w DevTools, ustaw locale i strefę czasową użytkownika, sprawdź tryb prywatny i bez rozszerzeń.

**Source maps** wgrywasz w CI do narzędzia error trackingu, powiązane z wydaniem lub debug ID. Publicznie ich nie serwujesz: zmapowany stack trace widzi zespół, a nie każdy, kto otworzy DevTools.

**Hydration mismatch na produkcji.** Typowe przyczyny: daty i strefy czasowe, `Math.random()`, różne locale serwera i klienta, odczyt `window` w renderze, niepoprawne zagnieżdżenie HTML, rozszerzenia przeglądarki modyfikujące DOM. React naprawia część niezgodności sam, ale kosztem wolniejszego startu, a w gorszym przypadku handlery trafiają na złe elementy. Callback `onRecoverableError` w `hydrateRoot` pozwala wysłać te błędy do monitoringu.

**Skrypty zewnętrzne** (analityka, czat, reklamy) to częste źródło błędów, których nie ma w twoim kodzie. Bez atrybutu `crossorigin` i nagłówków CORS przeglądarka ogranicza szczegóły błędu z takiego skryptu, więc w trackerze widzisz komunikat bez stack trace'u. Filtruj je osobno, żeby nie zagłuszały twoich.

**Front i backend w jednym śladzie.** Standard W3C Trace Context definiuje nagłówek `traceparent` (wersja, trace-id, parent-id, flagi). Instrumentacja OpenTelemetry w przeglądarce dokleja go do `fetch`, a backend kontynuuje ten sam trace. Trace ID zapisany przy błędzie w trackerze prowadzi prosto do logów serwera. Instrumentacja przeglądarkowa OTel jest wciąż oznaczona jako eksperymentalna.

**Ustrukturyzowane logi klienta**: JSON z polami `release`, `route`, `traceId`, `userAgent` zamiast luźnych `console.log`. Bez danych osobowych i tokenów.

## Kod

```ts title="telemetry.ts"
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

// TracerProvider and the OTLP exporter are registered earlier in this file
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      // send traceparent only to our API; third parties never see our trace ids
      propagateTraceHeaderCorsUrls: [/^https:\/\/api\.example\.com\//],
    }),
  ],
});
```

```http title="Preflight CORS i żądanie z traceparent"
OPTIONS /api/orders/42 HTTP/1.1
Host: api.example.com
Origin: https://shop.example.com
Access-Control-Request-Headers: traceparent

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://shop.example.com
Access-Control-Allow-Headers: content-type, traceparent

GET /api/orders/42 HTTP/1.1
Host: api.example.com
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

## Częste błędy

- Debugowanie na żywo zamiast rollbacku. Użytkownicy cierpią, a ty szukasz przyczyny pod presją.
- Odtwarzanie błędu na `pnpm dev` i szybkim laptopie. Część błędów pojawia się tylko na buildzie produkcyjnym albo na słabym telefonie.
- Publiczne source mapy albo ich brak w trackerze. Pierwsze odsłania kod, drugie daje stack trace z nazwami typu `a.b`.
- `traceparent` wysyłany do API, które nie ma go w `Access-Control-Allow-Headers`. Preflight odrzuca wtedy żądanie i instrumentacja psuje aplikację.

## Pytania

### Użytkownik zgłasza błąd, którego nie umiesz odtworzyć lokalnie. Jak działasz? {#sr-production-debugging-q1}

Zaczynam od danych. W error trackingu szukam zdarzeń tego użytkownika lub tej ścieżki: przeglądarka, wersja, urządzenie, wydanie, breadcrumbs, a jeśli jest, session replay. Po trace ID przechodzę do logów backendu i sprawdzam, co zwróciło API. Potem próbuję odtworzyć warunki: build produkcyjny, ta sama przeglądarka, throttling CPU i sieci, locale i strefa czasowa użytkownika, flagi i dane konta zbliżone do jego. Często przyczyną są rozszerzenia przeglądarki, cache starego bundla albo rzadki stan danych. Gdy dalej nie widzę błędu, dodaję logowanie lub atrybuty w podejrzanym miejscu i czekam na kolejne wystąpienie. Użytkownikowi odpisuję, co już wiem i kiedy wrócę z odpowiedzią.

### Po wdrożeniu liczba błędów wzrosła dziesięciokrotnie. Co robisz w pierwszych minutach? {#sr-production-debugging-q2}

Sprawdzam zakres: które błędy, strony, przeglądarki i jaki odsetek sesji. Porównuję początek skoku z czasem wdrożenia, włączenia flag i zmian w skryptach zewnętrznych. Jeśli to nowe wydanie, a błąd dotyka ważnej ścieżki, robię rollback lub wyłączam flagę, bez czekania na pełną diagnozę. Informuję kanał incydentów, co widać i co robię. Przyczynę szukam po ustabilizowaniu sytuacji, a potem piszę krótkie post-mortem bez szukania winnych.

### Hydration mismatch pojawia się tylko na produkcji. Skąd może się brać i jak go szukasz? {#sr-production-debugging-q3}

Najczęściej z różnicy środowisk: serwer w UTC i użytkownik w innej strefie, inny locale przy formatowaniu dat i liczb, losowe ID, dane z cache różne od świeżych, rozszerzenia przeglądarki zmieniające DOM, niepoprawne zagnieżdżenie HTML. Zbieram błędy przez `onRecoverableError` razem ze ścieżką i przeglądarką, żeby zobaczyć wzorzec. Lokalnie odpalam build produkcyjny z ustawioną strefą i locale użytkownika. Naprawa: deterministyczny render, wartości zależne od klienta po montażu, przekazanie strefy lub locale z serwera.

### Jak powiązać błąd z frontu z logami backendu? {#sr-production-debugging-q4}

Przez rozproszony tracing zgodny z W3C Trace Context. Instrumentacja OpenTelemetry w przeglądarce dodaje nagłówek `traceparent` do żądań do mojego API, a backend kontynuuje ten sam trace i loguje jego ID. Ten sam trace ID dołączam do zdarzenia w error trackerze. Backend musi przepuścić `traceparent` w CORS, a nagłówka nie wysyłam do obcych domen.

## Quiz

### Co zawiera nagłówek `traceparent`? {#sr-production-debugging-z1}

- [ ] Token sesji użytkownika i jego ID
- [x] Wersję, trace-id, parent-id i flagi śledzenia
- [ ] Nazwę serwisu i numer wydania
- [ ] Listę wszystkich serwisów, przez które przeszło żądanie

Format to `version-traceid-parentid-flags`, np. `00-4bf9...4736-00f0...02b7-01`.

### Jak najlepiej obsłużyć source mapy produkcyjne? {#sr-production-debugging-z2}

- [ ] Nie generować ich, bo spowalniają aplikację
- [ ] Serwować publicznie obok bundla
- [x] Wgrać w CI do narzędzia error trackingu, powiązane z wydaniem
- [ ] Wysyłać je w nagłówku każdej odpowiedzi

Tracker mapuje stack trace na kod źródłowy, a mapy nie są dostępne dla każdego.
