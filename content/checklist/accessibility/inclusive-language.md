---
title: Język inkluzywny
priority: medium
---

Treść unika określeń stygmatyzujących i wykluczających; dotyczy też komunikatów błędów, nazw w interfejsie i opisów alternatywnych.

## Dlaczego to ważne

- Określenia typu "kaleka" czy "przykuty do wózka" zrażają część odbiorców i szkodzą wizerunkowi marki szybciej niż jakikolwiek błąd techniczny.
- Komunikat błędu, który obwinia użytkownika ("Wpisałeś błędne dane, spróbuj jeszcze raz"), zwiększa frustrację i porzucenia formularzy.
- Formularze zakładające jedną płeć lub "imię ojca" wykluczają realnych klientów; neutralne sformułowania działają dla wszystkich.

## Jak sprawdzić

Przegląd treści z redaktorem i listą zakazanych zwrotów w słowniku projektu; linter alex działa tylko dla angielskiego, więc dla polskiego potrzebny jest własny słownik lub przegląd ręczny.

## Kod

```html title="Źle"
<p>Pokoje dla inwalidów dostępne na parterze.</p>
<p class="error">Podałeś zły numer telefonu!</p>
<label for="title">Pan / Pani</label>
```

```html title="Dobrze"
<p>Pokoje dostosowane dla osób z niepełnosprawnościami są na parterze.</p>
<p class="error">Numer telefonu powinien mieć 9 cyfr, np. 600 123 456.</p>
<label for="title">Forma zwracania się (opcjonalnie)</label>
```

## Częste błędy

- Wymuszanie płci w formularzu tylko po to, by dobrać formę "Szanowny Pan/Pani".
