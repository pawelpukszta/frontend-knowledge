---
title: "Wycieki pamięci we front-endzie i ich diagnoza"
level: senior
tags:
  - memory leak
  - heap snapshot
  - DevTools
  - AbortController
  - WeakRef
  - detached DOM
summary: Wyciek to obiekt, którego już nie potrzebujesz, a coś wciąż trzyma do niego referencję. Szukasz go w Chrome DevTools, porównując heap snapshoty przed i po powtórzonej akcji i czytając łańcuch retainerów.
sources:
  - title: "Chrome DevTools: Fix memory problems"
    url: https://developer.chrome.com/docs/devtools/memory-problems
  - title: "Chrome DevTools: Record heap snapshots"
    url: https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots
  - title: "Chrome DevTools: Memory panel overview"
    url: https://developer.chrome.com/docs/devtools/memory
  - title: "MDN: EventTarget.addEventListener() (signal)"
    url: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  - title: "MDN: WeakRef"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef
  - title: "MDN: FinalizationRegistry"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
  - title: "react.dev: Synchronizing with Effects"
    url: https://react.dev/learn/synchronizing-with-effects
---

## Wyjaśnienie

Garbage collector zwalnia obiekty, do których nie da się dojść z korzeni: obiektu globalnego, stosu wywołań, aktywnych listenerów i timerów. Wyciek w JS powstaje wtedy, gdy obiekt jest już niepotrzebny, ale nadal prowadzi do niego jakaś referencja. SPA żyje w jednej karcie godzinami, więc wycieki się sumują. Rośnie zużycie pamięci, GC pracuje częściej i dłużej, interfejs zaczyna się przycinać, a na słabszym telefonie karta może zostać zamknięta przez system.

Typowe źródła:

| Źródło | Co zostaje w pamięci | Naprawa |
|---|---|---|
| Listener na `window` lub `document` bez usunięcia | handler i wszystko, co domyka | `removeEventListener` albo `signal` z `AbortController` |
| `setInterval`, observer (`ResizeObserver`, `IntersectionObserver`) | callback i jego dane, czasem elementy DOM | `clearInterval`, `disconnect()` |
| Odłączone (detached) węzły DOM | całe poddrzewo usunięte z dokumentu, ale trzymane w zmiennej, tablicy lub `Map` | usuń referencję razem z elementem |
| Nieograniczony cache (`Map` memoizacji, cache wyszukiwań) | każdy wpis od startu aplikacji | limit (LRU), TTL, `WeakMap` dla kluczy obiektowych |
| Subskrypcja w `useEffect` bez cleanup | WebSocket, `store.subscribe`, `EventSource` i komponent w domknięciu | zwracaj funkcję sprzątającą |
| Globalny store i zmienne modułu | dane ekranu, którego już nie ma (np. lista 10 000 ofert) | czyść przy wyjściu z widoku, trzymaj tylko to, co wspólne |

React w Strict Mode (tylko w dev) uruchamia efekt dwa razy: setup, cleanup, setup. Brak sprzątania widać wtedy od razu, np. jako podwójne połączenie. Wycieki przez domknięcia opisuje temat o zasięgu i domknięciach, a `WeakMap` temat o kolekcjach.

Diagnoza w Chrome DevTools krok po kroku:

1. Potwierdź, że pamięć rośnie. Menedżer zadań przeglądarki (<kbd>Shift</kbd>+<kbd>Esc</kbd>) pokazuje kolumny "Memory footprint" i "JavaScript memory". Dokładniej sprawdzisz to w panelu Performance z zaznaczonym "Memory": nagraj kilka powtórzeń akcji (np. 10 razy otwórz i zamknij modal), a na początku i końcu kliknij "Collect garbage". Wykres, który po GC wraca do poziomu wyjściowego, jest w porządku. Rosnący JS heap albo licznik węzłów DOM po wymuszonym GC wskazuje wyciek.
2. Zrób heap snapshoty w panelu Memory. Snapshot 1 po rozgrzaniu strony, potem kilka razy wykonaj akcję i ją cofnij, potem snapshot 2. Każdy snapshot zaczyna się od GC, więc zobaczysz tylko obiekty, które naprawdę przeżyły. W widoku Comparison sortuj po delcie, a w widoku Summary użyj filtra "Objects allocated between Snapshot 1 and Snapshot 2".
3. Kliknij podejrzany obiekt i czytaj sekcję Retainers. To łańcuch referencji od korzenia GC do obiektu, który mówi, kto go trzyma, np. `onResize` w `Window` albo tablica w module. Liczy się **retained size**, czyli ile pamięci zwolni usunięcie obiektu, a nie shallow size.
4. Wpisz "Detached" w filtrze klas, żeby zobaczyć odłączone drzewa DOM. Panel Memory ma też osobny profil "Detached elements".
5. "Allocations on timeline" pokazuje alokacje w czasie (niebieskie słupki to nowe alokacje), a "Allocation sampling" ma niski narzut i wskazuje funkcje, które alokują najwięcej.

Testuj w oknie incognito bez rozszerzeń i na buildzie produkcyjnym. Rozszerzenia dokładają własne obiekty, a obiekty wypisane przez `console.log` trzyma konsola DevTools.

`WeakRef` i `FinalizationRegistry` pozwalają trzymać obiekt bez blokowania GC i dostać sygnał po jego usunięciu. Działanie GC nie jest deterministyczne: `deref()` może zwrócić `undefined` albo nigdy go nie zwrócić, a callback rejestru może nie wykonać się wcale. MDN radzi unikać ich, gdy się da, i nie opierać na nich logiki programu.

## Kod

```tsx title="Jeden AbortController sprząta wszystkie listenery efektu"
function useEditorShortcuts(onSave: () => void) {
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); onSave(); }
    }, { signal });
    window.addEventListener('resize', relayout, { signal, passive: true });
    const timer = setInterval(saveDraft, 30_000);
    const unsubscribe = cartStore.subscribe(updateBadge);

    return () => {
      controller.abort(); // removes every listener registered with this signal
      clearInterval(timer);
      unsubscribe();
    };
  }, [onSave]);
}
```

```ts title="Cache z limitem (LRU) zamiast rosnącej Map"
const MAX_ENTRIES = 50;
const cache = new Map<string, Offer[]>(); // Map keeps insertion order: first key = oldest

export async function searchOffers(query: string): Promise<Offer[]> {
  const hit = cache.get(query);
  if (hit) {
    cache.delete(query); // move to the end as the most recently used
    cache.set(query, hit);
    return hit;
  }
  const offers = await fetchOffers(query);
  cache.set(query, offers);
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value!);
  return offers;
}
```

## Częste błędy

- `removeEventListener` z nową funkcją strzałkową: to inna referencja, więc listener zostaje.
- Ocena wycieku po jednym snapshocie albo bez wymuszonego GC. Wzrost bez porównania z baseline niczego nie dowodzi.
- Szukanie wycieków na buildzie deweloperskim, gdzie React i narzędzia trzymają dodatkowe dane.
- `FinalizationRegistry` jako jedyne miejsce zamykania połączeń albo zapisu danych.

## Pytania

### Jak znajdziesz wyciek pamięci w SPA? {#perf-memory-leaks-q1}

Najpierw potwierdzam problem: w panelu Performance z włączonym "Memory" nagrywam kilka powtórzeń podejrzanej akcji, np. wejście i wyjście z widoku, z wymuszonym GC na początku i na końcu. Jeśli JS heap albo liczba węzłów DOM nie wraca do poziomu wyjściowego, mam wyciek. Potem w panelu Memory robię snapshot bazowy, powtarzam akcję kilka razy i robię drugi snapshot. W widoku Comparison albo z filtrem "Objects allocated between Snapshot 1 and Snapshot 2" szukam obiektów, których liczba rośnie razem z liczbą powtórzeń. Klikam taki obiekt i w sekcji Retainers czytam łańcuch referencji aż do korzenia. Zwykle kończy się na listenerze `window`, timerze, subskrypcji store'a albo module z cache. Po poprawce powtarzam pomiar, żeby potwierdzić efekt.

### Czym są odłączone (detached) węzły DOM i jak je wykryć? {#perf-memory-leaks-q2}

To elementy usunięte z dokumentu, do których JavaScript nadal ma referencję. Przeglądarka nie może ich zwolnić, a jeden trzymany węzeł utrzymuje w pamięci całe swoje poddrzewo. Typowo dzieje się tak, gdy kod zapisuje elementy w tablicy, `Map` albo polu obiektu, a potem usuwa je z DOM bez czyszczenia tej struktury. Albo gdy listener na `window` domyka element zamkniętego modala. W heap snapshocie wpisuję "Detached" w filtr klas albo używam profilu "Detached elements" w panelu Memory. Retainers pokazują, która zmienna trzyma węzeł.

### Jak AbortController pomaga sprzątać po komponencie? {#perf-memory-leaks-q3}

`addEventListener` przyjmuje opcję `signal`. Gdy wywołasz `abort()` na kontrolerze, przeglądarka usuwa każdy listener zarejestrowany z tym sygnałem. Nie musisz więc trzymać referencji do każdej funkcji, co pozwala używać funkcji anonimowych. Ten sam sygnał możesz przekazać do `fetch`, więc jedno `controller.abort()` w cleanup efektu odpina listenery i przerywa żądania. Timerów i subskrypcji store'ów nie obsługuje, więc te sprzątasz osobno.

### Kiedy użyć WeakRef i FinalizationRegistry i na co uważać? {#perf-memory-leaks-q4}

Rzadko. Do danych przypiętych do obiektu zwykle wystarcza `WeakMap`, a do zasobów jawne `close()` albo cleanup efektu. `WeakRef` nadaje się do cache obiektów kosztownych do odtworzenia, gdy utrata wpisu tylko spowalnia działanie. `FinalizationRegistry` pozwala posprzątać pomocnicze dane po usunięciu obiektu przez GC. Moment działania GC zależy od silnika, więc `deref()` może zwrócić `undefined` w dowolnej chwili, a callback rejestru może nie wykonać się nigdy. Program musi działać poprawnie także bez niego. Wartość przekazana do rejestru nie może wskazywać na sam obiekt, bo rejestr trzyma ją silnie i obiekt nigdy nie zostanie zwolniony.

```js
const thumbnails = new Map(); // url -> WeakRef<ImageBitmap>
const registry = new FinalizationRegistry((url) => {
  if (!thumbnails.get(url)?.deref()) thumbnails.delete(url); // best effort cleanup
});

function remember(url, bitmap) {
  thumbnails.set(url, new WeakRef(bitmap));
  registry.register(bitmap, url); // held value is the key, never the bitmap itself
}
```

## Quiz

### Po 10 otwarciach i zamknięciach modala widok Comparison pokazuje 10 nowych odłączonych drzew `HTMLDivElement`. Co to oznacza? {#perf-memory-leaks-z1}

- [ ] GC jeszcze nie zdążył ich usunąć, wystarczy poczekać
- [x] Coś w JavaScript wciąż trzyma referencje do usuniętych modali
- [ ] Modal ma za dużo węzłów i trzeba go uprościć
- [ ] To normalny cache renderowania przeglądarki

Snapshot zaczyna się od GC, więc te drzewa przeżyły, bo trzyma je jakiś retainer.

### Co gwarantuje `FinalizationRegistry` po usunięciu obiektu przez GC? {#perf-memory-leaks-z2}

- [ ] Callback wykona się synchronicznie przy usunięciu obiektu
- [ ] Callback wykona się najpóźniej przy zamknięciu karty
- [x] Nic: callback może wykonać się późno albo wcale
- [ ] Callback wykona się w następnym mikrozadaniu

Według MDN callback może nie zostać wywołany nigdy, więc nie nadaje się do niezbędnej logiki.
