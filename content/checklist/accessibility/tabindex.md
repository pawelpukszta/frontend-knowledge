---
title: Właściwe wartości tabindex
priority: medium
---

Używaj tylko `0` (dodanie do kolejności) i `-1` (focus programowy). Wartości dodatnie przestawiają kolejność całej strony i są niemal zawsze błędem.

## Dlaczego to ważne

- `tabindex="1"` i wyższe wyciągają element na początek kolejności Tab dla całej strony; użytkownik klawiatury skacze chaotycznie między sekcjami. WCAG 2.4.3 Focus Order (A).
- `tabindex="0"` na `div` z kliknięciem daje focus, ale nie rolę, nazwę ani obsługę Enter i Spacji; natywny `button` ma to wszystko za darmo.
- `tabindex="-1"` to właściwe narzędzie dla celów focusu programowego: nagłówka po zmianie trasy w SPA, podsumowania błędów formularza, kontenera okna.

## Jak sprawdzić

axe (`tabindex`), wyszukanie `tabindex="[1-9]` w kodzie; przejście strony klawiszem Tab.

## Kod

```html title="Źle"
<input name="destination" tabindex="1">
<div class="card" tabindex="0" onclick="openOffer()">Kreta</div>
```

```html title="Dobrze"
<input name="destination">  <!-- DOM order defines tab order -->
<button type="button" class="card" onclick="openOffer()">Kreta</button>

<h1 id="page-title" tabindex="-1">Wyniki wyszukiwania</h1>
<script type="module">
  // After client-side navigation move focus to the new page title
  document.querySelector('#page-title').focus();
</script>
```

## Częste błędy

- Naprawianie kolejności Tab dodatnim `tabindex` zamiast zmiany kolejności elementów w DOM.
- `tabindex="-1"` na widocznym przycisku, żeby "uprościć" nawigację: element staje się niedostępny z klawiatury.
