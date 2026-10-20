---
title: Atrybut headers wskazuje istniejące nagłówki
priority: medium
---

W złożonych tabelach `<td headers="...">` musi odwoływać się do ID komórek `<th>` w tej samej tabeli.

## Dlaczego to ważne

- Błędne ID (literówka, ID z innej tabeli) sprawia, że czytnik nie ogłosi żadnego nagłówka albo ogłosi zły.
- `headers` jest potrzebny tylko w tabelach z wielopoziomowymi nagłówkami; w prostych wystarczy `scope`, co zmniejsza ryzyko błędów.

## Jak sprawdzić

axe (`td-headers-attr`).

## Kod

```html title="Dobrze"
<table>
  <caption>Dopłaty do pokoi, lipiec 2027</caption>
  <tr><td></td><th id="std" scope="col">Standard</th><th id="sea" scope="col">Widok na morze</th></tr>
  <tr><th id="crete" colspan="3" scope="colgroup">Kreta</th></tr>
  <tr><th id="kn" scope="row">Knossos Beach</th>
    <td headers="crete kn std">0 zł</td><td headers="crete kn sea">400 zł</td></tr>
</table>
```

## Częste błędy

- Kopiowanie wiersza z `headers` i zmiana treści bez zmiany ID; komórki wskazują nagłówki innego hotelu.
