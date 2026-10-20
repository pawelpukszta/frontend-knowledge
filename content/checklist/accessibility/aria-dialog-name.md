---
title: Dialog ma dostępną nazwę
priority: medium
---

Element z `role="dialog"` lub `alertdialog` (oraz `<dialog>`) powinien mieć nazwę, zwykle przez `aria-labelledby` wskazujące nagłówek. Czytnik ogłosi ją przy otwarciu.

## Dlaczego to ważne

- Po otwarciu czytnik ogłasza "okno dialogowe" i jego nazwę; bez nazwy użytkownik nie wie, czy to zmiana terminu, zgoda na cookies, czy komunikat o błędzie płatności.
- Wskazanie widocznego nagłówka przez `aria-labelledby` sprawia, że nazwa nie rozjedzie się z treścią po zmianie tekstu lub tłumaczenia.
- To reguła "best practice" w axe, ale nazwa jest wymagana we wzorcu APG Dialog i wspiera WCAG 4.1.2.

## Jak sprawdzić

axe (`aria-dialog-name`) lub otwarcie modala z czytnikiem ekranu.

## Kod

```html title="Źle"
<div role="dialog" aria-modal="true">
  <h2>Zmiana terminu</h2>
  ...
</div>
```

```html title="Dobrze"
<dialog id="change-date" aria-labelledby="change-date-title" aria-describedby="change-date-desc">
  <h2 id="change-date-title">Zmiana terminu</h2>
  <p id="change-date-desc">Nowy termin może zmienić cenę wyjazdu.</p>
  ...
</dialog>
```

## Częste błędy

- `alertdialog` bez `aria-describedby`: czytnik ogłosi tytuł, ale nie treść ostrzeżenia.
