---
title: Dostępne przesyłanie plików
priority: medium
---

Pole pliku ma etykietę, informację o dozwolonych typach i rozmiarze (`accept` plus tekst pomocniczy), a strefy drag and drop mają alternatywę z przyciskiem.

## Dlaczego to ważne

- Strefa "przeciągnij i upuść" wymaga myszy i precyzji; użytkownik klawiatury, czytnika ekranu czy telefonu potrzebuje zwykłego przycisku wyboru pliku.
- Informacja o formatach i limicie przed wyborem (np. "PDF lub JPG, do 5 MB") oszczędza nieudanych prób, a `accept` filtruje okno wyboru plików.
- Wynik przesyłania (postęp, sukces, błąd) musi zostać ogłoszony, np. przez `role="status"`, bo inaczej zmienia się tylko wizualnie.
- `accept` to tylko podpowiedź: typ i rozmiar pliku zawsze sprawdzaj na serwerze.

## Jak sprawdzić

Prześlij plik tylko klawiaturą i z czytnikiem ekranu; sprawdź komunikat dla zbyt dużego pliku.

## Kod

```html
<label for="passport">Skan paszportu</label>
<p id="passport-hint">PDF, JPG lub PNG, maksymalnie 5 MB.</p>
<input id="passport" type="file" name="passport"
       accept=".pdf,image/jpeg,image/png" aria-describedby="passport-hint">
<div class="dropzone" aria-hidden="true">lub przeciągnij plik tutaj</div>
<p id="upload-status" role="status"></p>
```

```js
const input = document.querySelector('#passport');
const status = document.querySelector('#upload-status');

input.addEventListener('change', () => {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    status.textContent = `Plik ${file.name} jest za duży (maks. 5 MB).`;
    input.value = '';
  } else {
    status.textContent = `Wybrano plik ${file.name}.`;
  }
});
```

## Częste błędy

- Ukrycie `input type="file"` przez `display: none` i podpięcie kliknięcia do `div`: pole znika z kolejności Tab.
