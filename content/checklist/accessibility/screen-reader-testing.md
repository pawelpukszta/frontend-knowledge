---
title: Testy z prawdziwym czytnikiem ekranu
priority: high
---

Narzędzia automatyczne (axe, Lighthouse) wykrywają tylko część problemów. Kluczowe ścieżki trzeba przejść z NVDA (Windows), VoiceOver (macOS, iOS) i TalkBack (Android).

## Dlaczego to ważne

- Automat nie oceni, czy alt ma sens, czy komunikat o błędzie jest ogłaszany ani czy kolejność odczytu jest logiczna; zielony wynik axe nie oznacza dostępnej strony.
- Czytniki różnie interpretują ARIA: komponent działający w NVDA z Chrome potrafi milczeć w VoiceOver z Safari.
- Ankieta WebAIM pokazuje, że na komputerach dominują JAWS i NVDA, a na telefonach VoiceOver; testuj kombinacje, z których faktycznie korzystają Twoi użytkownicy.

## Jak sprawdzić

Przejdź scenariusz wyszukania oferty i rezerwacji z czytnikiem, nie patrząc na ekran, i notuj, co jest niezrozumiałe; sprawdź nawigację nagłówkami, landmarkami, listą linków i polami formularza.

## Kod

```txt title="Ściąga skrótów"
NVDA (Windows, Chrome or Firefox)
  Stop speech            Ctrl
  Next heading           H   (1-6 jump to heading level)
  Next landmark          D
  Next form field        F
  Elements list          NVDA+F7
VoiceOver (macOS, Safari)   VO = Ctrl+Option
  Turn on/off            Cmd+F5
  Rotor                  VO+U
  Next heading           VO+Cmd+H
VoiceOver (iOS)          swipe right/left, rotor: rotate two fingers
TalkBack (Android)       swipe right/left, reading controls: swipe up/down
```

## Częste błędy

- Testowanie w jednym czytniku i uznanie, że działa wszędzie.
- Patrzenie na ekran podczas testu: oko podpowiada to, czego czytnik nie ogłasza.
