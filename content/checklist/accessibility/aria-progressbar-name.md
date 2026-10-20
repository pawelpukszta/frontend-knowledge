---
title: Pasek postępu ma dostępną nazwę
priority: medium
---

`role="progressbar"` lub `<progress>` bez nazwy jest ogłaszany jako sama liczba procent. Nazwa mówi, czego dotyczy postęp (np. "Wysyłanie pliku").

## Dlaczego to ważne

- Bez nazwy użytkownik słyszy "45%" i nie wie, czy trwa wysyłanie skanu paszportu, czy ładowanie wyników wyszukiwania.
- Przy kilku paskach naraz (np. upload wielu dokumentów do rezerwacji) nazwa jest jedynym sposobem, by je rozróżnić.
- axe przypisuje regułę do WCAG 1.1.1 (A); dla postępu nieokreślonego pomiń `aria-valuenow`, zamiast podawać fałszywą wartość.

## Jak sprawdzić

axe (`aria-progressbar-name`).

## Kod

```html title="Źle"
<div role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
```

```html title="Dobrze"
<div role="progressbar" aria-label="Wysyłanie skanu paszportu"
     aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>

<label for="upload">Wysyłanie pliku voucher.pdf</label>
<progress id="upload" max="100" value="45">45%</progress>
```

## Częste błędy

- Ogłaszanie każdego procentu przez region live; czytnik zasypuje użytkownika liczbami. Ogłaszaj kamienie milowe lub zakończenie.
