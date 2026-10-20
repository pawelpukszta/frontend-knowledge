---
title: Spełnione kryteria instalacji PWA
priority: low
---

HTTPS, poprawny manifest (nazwa, ikony 192 i 512, `start_url`, `display`). Service Worker z obsługą `fetch` nie jest już wymagany przez Chrome do instalacji, ale nadal daje offline.

## Dlaczego to ważne

- Zainstalowana aplikacja ma ikonę na ekranie głównym lub w doku i uruchamia się w osobnym oknie; łatwiej do niej wrócić niż do zakładki.
- Od Chrome 108 (mobile) i 112 (desktop) service worker z obsługą `fetch` nie jest wymagany do instalacji, ale bez niego aplikacja nie zadziała offline.
- Safari na iOS nie pokazuje monitu instalacji: użytkownik dodaje stronę przez Udostępnij, Do ekranu początkowego, więc warto to podpowiedzieć w interfejsie.
- Zdarzenie `beforeinstallprompt` (Chromium) pozwala pokazać własny przycisk "Zainstaluj" w dobrym momencie, np. po zakończonej rezerwacji.

## Jak sprawdzić

DevTools → Application → Manifest (sekcja Installability).

## Kod

```js
const installBtn = document.querySelector('#install');
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // keep the event and show our own button instead
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener('click', async () => {
  installBtn.hidden = true;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.info('Install prompt outcome:', outcome);
  deferredPrompt = null;
});
```

## Częste błędy

- Pokazywanie monitu instalacji zaraz po wejściu na stronę, zanim użytkownik zobaczy jakąkolwiek wartość.
