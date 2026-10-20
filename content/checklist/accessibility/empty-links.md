---
title: Brak pustych i niedziałających linków
priority: medium
---

Link bez tekstu (np. sama ikona bez nazwy) lub z `href="#"` udający przycisk wprowadza w błąd. Akcje na stronie to przyciski, nawigacja to linki.

## Dlaczego to ważne

- Link z samą ikoną bez nazwy czytnik ogłosi jako "link" albo przeczyta adres URL; użytkownik nie wie, dokąd prowadzi.
- Link z `href="#"` zachowuje się inaczej niż przycisk: nie reaguje na Spację, przewija na górę strony i dopisuje `#` do historii.
- Narzędzia technologii asystujących grupują linki i przyciski osobno; zła rola utrudnia znalezienie akcji.

## Jak sprawdzić

axe (`link-name`) i crawler linków; w DevTools (zakładka Accessibility) sprawdź, czy każdy link ma niepusty Computed name.

## Kod

```html title="Źle"
<a href="https://instagram.com/biuro"><svg><!-- icon --></svg></a>
<a href="#" onclick="addToFavorites(123)">♡</a>
```

```html title="Dobrze"
<a href="https://instagram.com/biuro">
  <svg aria-hidden="true" focusable="false"><!-- icon --></svg>
  <span class="visually-hidden">Nasz profil na Instagramie</span>
</a>
<button type="button" aria-pressed="false" onclick="toggleFavorite(123)">
  <svg aria-hidden="true"><!-- heart --></svg> Dodaj do ulubionych
</button>
```

## Częste błędy

- `<a>` bez `href` z obsługą `onclick`; nie dostaje focusu z klawiatury.
