---
title: Każdy element interaktywny ma dostępną nazwę
priority: high
---

Przyciski z samą ikoną, linki-obrazki i własne kontrolki potrzebują nazwy z treści, `aria-label` lub `aria-labelledby`. Bez niej są dla czytnika "przycisk" bez znaczenia.

## Dlaczego to ważne

- Na liście 20 ofert z ikonami serca i kosza czytnik ogłosi 40 razy "przycisk"; użytkownik nie wie, który dodaje do ulubionych, a który usuwa.
- Nazwa musi zawierać widoczny tekst (WCAG 2.5.3 Label in Name): jeśli przycisk pokazuje "Szukaj", a `aria-label` brzmi "Wyślij formularz", komenda głosowa "kliknij Szukaj" nie zadziała.
- Puste linki i przyciski należą do najczęstszych błędów w corocznym raporcie WebAIM Million, a naruszają WCAG 4.1.2 i 2.4.4 (poziom A).

## Jak sprawdzić

Przejdź Tabem z włączonym czytnikiem ekranu lub sprawdź Computed name w panelu Accessibility w DevTools.

## Kod

```html title="Źle"
<button class="icon-btn"><svg>...</svg></button>
<a href="/oferty/kreta"><img src="kreta.avif"></a>
```

```html title="Dobrze"
<button class="icon-btn" aria-label="Dodaj do ulubionych: Hotel Aquila, Kreta">
  <svg aria-hidden="true">...</svg>
</button>
<a href="/oferty/kreta">
  <img src="kreta.avif" alt="Kreta, 7 nocy od 2 499 zł">
</a>
```

## Częste błędy

- `aria-label` na przycisku z widocznym tekstem: nadpisuje treść i łatwo rozjeżdża się z tym, co widać.
- Ta sama nazwa ("Więcej") dla wielu linków; dodaj kontekst, np. "Więcej o Hotelu Aquila".
