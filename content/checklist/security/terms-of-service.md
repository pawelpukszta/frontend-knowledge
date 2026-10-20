---
title: Link do regulaminu w stopce
priority: medium
---

Regulamin świadczenia usług powinien być łatwo dostępny z każdej strony i przed zawarciem umowy; w Polsce usługodawca świadczący usługi drogą elektroniczną musi go udostępnić nieodpłatnie, w formie pozwalającej go pobrać i zapisać.

## Dlaczego to ważne

- Ustawa o świadczeniu usług drogą elektroniczną wymaga regulaminu dostępnego przed zawarciem umowy; brak może skutkować sporem z klientem i problemami z UOKiK.
- Przy rezerwacji imprezy turystycznej klient musi zaakceptować regulamin i warunki umowy; link przy checkboxie i w stopce dokumentuje, że miał do nich dostęp.
- Użytkownicy szukają regulaminu w stopce; łatwy dostęp do zasad anulacji i reklamacji buduje zaufanie przed zakupem.

## Jak sprawdzić

Sprawdź stopkę na wszystkich szablonach (także strony błędów, koszyk, landing pages) i link przy formularzach rejestracji oraz rezerwacji.

## Kod

```html title="Stopka i formularz rezerwacji"
<footer>
  <nav aria-label="Informacje prawne">
    <a href="/regulamin">Regulamin</a>
    <a href="/polityka-prywatnosci">Polityka prywatności</a>
    <a href="/regulamin.pdf" download>Pobierz regulamin (PDF)</a>
  </nav>
</footer>

<label>
  <input type="checkbox" name="terms" required />
  Akceptuję <a href="/regulamin" target="_blank" rel="noopener">regulamin</a> i warunki uczestnictwa w imprezie turystycznej.
</label>
```

## Częste błędy

- Regulamin dostępny tylko po zalogowaniu lub wyłącznie jako obraz bez możliwości zapisania.
- Zmiany regulaminu bez daty obowiązywania i archiwum poprzednich wersji.
