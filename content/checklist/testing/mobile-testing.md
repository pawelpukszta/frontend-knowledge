---
title: Testy na prawdziwych urządzeniach mobilnych
priority: high
---

Emulacja w DevTools nie oddaje wydajności słabszego procesora, klawiatury ekranowej, zachowania paska adresu ani Safari na iOS. Testuj na kilku realnych telefonach, w tym na starszym Androidzie ze średniej półki.

## Dlaczego to ważne

- Tani Android ma kilkukrotnie słabszy procesor niż laptop programisty; INP i czas hydracji, które w emulacji wyglądają dobrze, na telefonie przekraczają progi Core Web Vitals.
- Tylko na urządzeniu widać, że klawiatura zasłania przycisk "Rezerwuj", pole telefonu otwiera złą klawiaturę albo iOS powiększa stronę przy fokusie na polu z fontem mniejszym niż 16 px.
- Ocena Core Web Vitals w Google opiera się na danych od prawdziwych użytkowników (CrUX), w dużej części mobilnych, a nie na pomiarach z laptopa.

## Jak sprawdzić

Zdalne debugowanie: `chrome://inspect` dla Androida i Web Inspector w Safari dla iPhone'a; modele, których zespół nie ma, w chmurze urządzeń (BrowserStack, LambdaTest).

## Kod

```bash title="Lokalny serwer na prawdziwym telefonie"
# Android over USB: forward the phone's localhost:3000 to the dev machine
adb devices
adb reverse tcp:3000 tcp:3000
# Open http://localhost:3000 in Chrome on the phone,
# then inspect the tab from chrome://inspect on the desktop

# iPhone on the same Wi-Fi: expose the dev server on the local network
npx next dev --hostname 0.0.0.0
# Open http://<laptop-ip>:3000 in Safari and debug via the Develop menu on a Mac
```

## Częste błędy

- Testowanie tylko na flagowym telefonie zespołu.
- Uznanie trybu responsywnego w DevTools z throttlingiem CPU za wystarczający test mobilny.
