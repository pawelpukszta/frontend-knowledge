---
title: "Animacje i ruch: transitions, @keyframes, View Transitions"
level: mid
tags:
  - transition
  - keyframes
  - prefers-reduced-motion
  - View Transitions
  - Web Animations API
  - will-change
summary: Transition animuje zmianę stanu, `@keyframes` opisuje samodzielną sekwencję. Animuj tanie właściwości (`transform`, `opacity`), szanuj `prefers-reduced-motion`, a przejścia między widokami rób przez View Transitions API.
sources:
  - title: "web.dev: How to create high-performance CSS animations"
    url: https://web.dev/articles/animations-guide
  - title: "MDN: prefers-reduced-motion"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  - title: "MDN: View Transition API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
  - title: "MDN: @view-transition"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition
  - title: "Chrome for Developers: Cross-document view transitions"
    url: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
  - title: "MDN: Using the Web Animations API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API
  - title: "MDN: will-change"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/will-change
  - title: "MDN: forced-colors"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
  - title: "Understanding WCAG 2.2: Animation from Interactions (2.3.3)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
---

## Wyjaśnienie

**Transition czy `@keyframes`?**

- `transition` animuje przejście między dwoma stanami, gdy wartość się zmieni: `:hover`, dodanie klasy, zmiana atrybutu. Nie wystartuje sama i nie ma kroków pośrednich.
- `animation` z `@keyframes` to samodzielna sekwencja: może ruszyć od razu po wyrenderowaniu, mieć wiele kroków, powtarzać się (`infinite`), iść w obie strony (`alternate`) i zatrzymać się na końcu (`animation-fill-mode: forwards`).

Zasada praktyczna: reakcja na interakcję to transition, a loader, pulsowanie czy wejście elementu na stronę to `@keyframes`.

**Co animować.** Koszt zależy od etapu renderowania, który uruchamia zmiana (szczegóły w temacie o reflow i repaint). `transform` i `opacity` mogą być obsłużone przez compositor bez layoutu i paintu, więc animacja nie blokuje wątku głównego. `width`, `height`, `top`, `left`, `margin` wymuszają layout w każdej klatce. Zamiast `left` używasz `translate`, zamiast `width` często `scale`, a zamiast animowania `box-shadow` animujesz `opacity` pseudo-elementu z gotowym cieniem.

**`will-change`** to wskazówka, że element zaraz się zmieni, więc przeglądarka może wcześniej przygotować warstwę. MDN nazywa ją ostatecznością: stosuj przy zmierzonym problemie, nie "na zapas". Każda warstwa kosztuje pamięć, a `will-change` na wielu elementach może spowolnić stronę. Najlepiej włączać ją skryptem tuż przed animacją i wyłączać (`auto`) po niej. `will-change: transform` lub `opacity` tworzy też nowy stacking context, co może zmienić `z-index`.

**`contain`** ogranicza zasięg zmian: `contain: layout paint` mówi, że układ i rysowanie wnętrza nie wpływają na resztę strony. Przydaje się przy animowanych widżetach w dużym dokumencie.

**`prefers-reduced-motion`.** Duże przesunięcia, skalowanie, paralaksa i autoodtwarzane animacje mogą wywołać zawroty głowy i nudności u osób z zaburzeniami błędnika. Użytkownik włącza ograniczenie ruchu w systemie, a strona odczytuje to przez `@media (prefers-reduced-motion: reduce)`. Ruch nie musi zniknąć całkiem: wjazd z boku można zamienić na krótkie pojawienie się przez `opacity`. Bezpieczny wzorzec to dodawanie ruchu tylko w `@media (prefers-reduced-motion: no-preference)`. WCAG 2.2 opisuje to w kryterium 2.3.3 Animation from Interactions (poziom AAA), a 2.2.2 Pause, Stop, Hide (poziom A) wymaga możliwości zatrzymania lub ukrycia ruchu, który startuje automatycznie i trwa dłużej niż 5 sekund.

**View Transitions API** animuje przejście między dwoma stanami strony. Przeglądarka robi "zrzut" starego widoku, aktualizujesz DOM, a potem animuje przejście (domyślnie crossfade). Elementy z tym samym `view-transition-name` w obu stanach płynnie zmieniają pozycję i rozmiar, np. miniatura oferty zamienia się w duże zdjęcie na stronie szczegółów.

- **Same-document** (SPA): `document.startViewTransition(() => updateDom())`. Baseline 2025, od października 2025 w aktualnych wersjach głównych przeglądarek.
- **Cross-document** (MPA, zwykłe nawigacje): obie strony muszą mieć w CSS `@view-transition { navigation: auto; }` i być na tym samym originie. Według MDN to wciąż limited availability: działa w Chrome i Edge od 126 oraz w Safari od 18.2, a nie działa w Firefoksie. To progressive enhancement: bez wsparcia nawigacja po prostu działa bez animacji.

Animacje View Transitions to zwykłe animacje CSS na pseudo-elementach `::view-transition-*`, więc też trzeba je wyciszyć w `prefers-reduced-motion: reduce`.

**Web Animations API.** `element.animate(keyframes, options)` uruchamia animację z JavaScriptu i zwraca obiekt `Animation` z metodami `play()`, `pause()`, `reverse()`, `cancel()`, `playbackRate` i obietnicą `finished`. Ten sam silnik obsługuje animacje i transitions CSS. Przydaje się, gdy wartości liczysz w JS lub musisz sterować odtwarzaniem; prosty hover zostaw w CSS.

**Tryb wymuszonych kolorów** (`forced-colors: active`, np. kontrast wysoki w Windows) nadpisuje kolory paletą systemu i usuwa `box-shadow`. Jeśli stan elementu (focus, zaznaczenie, postęp animacji) pokazujesz tylko kolorem tła lub cieniem, w tym trybie zniknie. Dodaj wtedy `outline` albo `border` z kolorem systemowym, np. `Highlight` lub `ButtonText`.

## Kod

```css
.toast {
  opacity: 0;
  transform: translateY(1rem);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}
.toast.is-visible { opacity: 1; transform: none; }

@keyframes pulse {
  50% { transform: scale(1.05); }
}

/* Motion only for users who did not ask to reduce it */
@media (prefers-reduced-motion: no-preference) {
  .badge--new { animation: pulse 1.5s ease-in-out infinite; }
}

@media (prefers-reduced-motion: reduce) {
  .toast { transform: none; } /* keep the fade, drop the slide */
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none; }
}

/* Cross-document transitions: put this rule on both pages */
@view-transition { navigation: auto; }
.offer-photo { view-transition-name: offer-photo; }
```

```js
// Same-document view transition with a fallback for older browsers
function showOffer(offer) {
  if (!document.startViewTransition) {
    renderOffer(offer);
    return;
  }
  document.startViewTransition(() => renderOffer(offer));
}

// Web Animations API: shake an invalid field, respecting user settings
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  input.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
    { duration: 300, easing: 'ease-in-out' },
  );
}
```

## Częste błędy

- Animowanie `width`, `height`, `top` czy `left` tam, gdzie wystarczy `transform`. Każda klatka liczy layout i animacja się tnie na słabszych telefonach.
- `will-change: transform` w globalnym stylu na dziesiątkach elementów. Zużywa pamięć GPU i może spowolnić stronę.
- Globalne `* { animation: none !important }` przy reduced motion, które psuje też animacje niosące informację (np. spinner ładowania). Lepiej zmniejszyć ruch i zostawić animacje, które pokazują stan.
- Nazwanie dwóch widocznych jednocześnie elementów tym samym `view-transition-name`. Nazwa musi być unikalna wśród renderowanych elementów, inaczej przeglądarka pominie całe przejście.

## Pytania

### Kiedy użyjesz transition, a kiedy animation z @keyframes? {#css-animations-motion-q1}

Transition, gdy animuję zmianę z jednego stanu na drugi wywołaną zmianą stylu: hover, focus, dodanie klasy `is-open`. Ma tylko początek i koniec, startuje sam przy zmianie wartości i odwraca się, gdy stan wraca. `@keyframes`, gdy animacja ma wiele kroków, ma ruszyć bez zmiany stanu (np. wejście elementu na stronę), powtarzać się albo działać w pętli jak loader. Do sterowania z JavaScriptu (pauza, odwrócenie, wartości liczone dynamicznie) używam Web Animations API.

### Jak uwzględnić prefers-reduced-motion? {#css-animations-motion-q2}

To media query, które odczytuje systemowe ustawienie "ogranicz ruch". Ruch może wywołać dolegliwości u osób z zaburzeniami błędnika. Najbezpieczniej dodawać duży ruch tylko w `@media (prefers-reduced-motion: no-preference)`, a przy `reduce` zastępować przesunięcia i skalowanie krótkim przenikaniem przez `opacity`. W JS sprawdzam `matchMedia('(prefers-reduced-motion: reduce)')` przed `element.animate()` i przed smooth scrollem. Pamiętam o View Transitions: ich pseudo-elementy też wyciszam. Nie wyłączam wszystkiego globalnie, bo spinner czy wskaźnik postępu nadal muszą pokazywać, że coś się dzieje.

### Czym jest View Transitions API i jakie ma wsparcie? {#css-animations-motion-q3}

API, które animuje przejście między dwoma stanami strony. Przeglądarka zapamiętuje stary widok, ja aktualizuję DOM, a ona animuje różnicę. Domyślnie to crossfade, a elementy z tym samym `view-transition-name` płynnie przechodzą na nową pozycję. W SPA wywołuję `document.startViewTransition(callback)`; to jest w Baseline 2025. Dla zwykłych nawigacji między stronami obie strony dodają `@view-transition { navigation: auto; }` i muszą być na tym samym originie; według MDN to jeszcze limited availability (bez Firefoksa). Traktuję to jako progressive enhancement: bez wsparcia aktualizacja lub nawigacja działa normalnie, tylko bez animacji.

### Kiedy will-change pomaga, a kiedy szkodzi? {#css-animations-motion-q4}

Pomaga, gdy zmierzona animacja ma problem, bo przeglądarka tworzy warstwę dopiero w chwili startu. `will-change: transform` pozwala przygotować ją wcześniej. Szkodzi przy nadużyciu: każda warstwa zajmuje pamięć, a ustawienie w CSS na wielu elementach trzyma te zasoby cały czas. Dlatego włączam ją skryptem tuż przed animacją (np. na `pointerenter`) i zdejmuję po zakończeniu. Trzeba też pamiętać, że tworzy stacking context, co może zmienić nakładanie elementów.

## Quiz

### Która para właściwości jest najtańsza do animowania? {#css-animations-motion-z1}

- [ ] `width` i `height`
- [ ] `top` i `left`
- [x] `transform` i `opacity`
- [ ] `margin` i `padding`

`transform` i `opacity` mogą być obsłużone przez compositor bez layoutu i paintu.

### Co jest wymagane, żeby zadziałało cross-document view transition? {#css-animations-motion-z2}

- [ ] Wywołanie `document.startViewTransition()` przed kliknięciem linku
- [x] `@view-transition { navigation: auto; }` na obu stronach i ten sam origin
- [ ] Service worker przechwytujący nawigację
- [ ] `will-change: contents` na `<body>`

Obie strony muszą się zgodzić na przejście w CSS, a nawigacja musi być same-origin.
