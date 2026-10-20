---
title: Polityka prywatności w stopce
priority: high
---

Polityka prywatności opisuje, kto jest administratorem, jakie dane i w jakim celu są zbierane, na jakiej podstawie prawnej, komu są przekazywane (także poza EOG), jak długo przechowywane i jakie prawa ma użytkownik. Link jest w stopce każdej strony i przy każdym formularzu zbierającym dane.

## Dlaczego to ważne

- Obowiązek informacyjny z art. 13 RODO trzeba spełnić w momencie zbierania danych, więc sam link w stopce nie wystarcza przy formularzu rezerwacji czy zapisu na newsletter.
- Informacje mają być zwięzłe, przejrzyste i napisane jasnym językiem (art. 12 RODO); prawniczy elaborat skopiowany z innego serwisu zwykle nie pasuje do narzędzi faktycznie używanych w Twoim.
- Nieaktualna polityka (np. bez nowego narzędzia analitycznego czy dostawcy czatu) to łatwy do wykazania zarzut przy skardze do UODO.

## Jak sprawdzić

Sprawdź stopkę na kilku typach stron i formularze (krótka informacja i link przy przycisku wysyłki); porównaj listę odbiorców danych z polityki z zewnętrznymi domenami w panelu Network.

## Kod

```html
<footer>
  <nav aria-label="Informacje prawne">
    <a href="/polityka-prywatnosci">Polityka prywatności</a>
    <a href="/regulamin">Regulamin</a>
    <button type="button" data-open-consent-settings>Ustawienia cookies</button>
  </nav>
</footer>

<!-- Short notice right where data is collected (layered information) -->
<form action="/api/newsletter" method="post">
  <label for="nl-email">E-mail</label>
  <input id="nl-email" name="email" type="email" autocomplete="email" required />
  <p class="form-note">
    Administratorem danych jest Example Travel sp. z o.o. Adres e-mail wykorzystamy wyłącznie
    do wysyłki newslettera; zgodę możesz wycofać w każdej chwili.
    <a href="/polityka-prywatnosci#newsletter">Więcej o przetwarzaniu danych</a>
  </p>
  <button>Zapisz się</button>
</form>
```

## Częste błędy

- Polityka prywatności dostępna tylko jako PDF do pobrania lub tylko po zalogowaniu.
- Jedna polityka bez daty aktualizacji, nieruszana od lat mimo zmian w używanych usługach.
