---
title: Mały rozmiar bundli JS
priority: medium
---

Pojedynczy bundle orientacyjnie poniżej 200 KB po kompresji, a JS potrzebny na starcie jak najmniejszy. JS trzeba pobrać, sparsować, skompilować i wykonać, co bezpośrednio pogarsza LCP, TBT i INP.

## Dlaczego to ważne

- 200 KB JS kosztuje dużo więcej niż 200 KB obrazu: obraz tylko się dekoduje, a skrypt blokuje wątek główny parsowaniem i wykonaniem.
- Na tanim telefonie wykonanie tego samego bundla może trwać kilka razy dłużej niż na laptopie, a w tym czasie strona nie reaguje na kliknięcia.
- Mniejsze, podzielone bundle lepiej się cache'ują: zmiana w jednym module nie unieważnia całej aplikacji.

## Jak sprawdzić

Bundle analyzer (np. `vite-bundle-visualizer`, `@next/bundle-analyzer`), Coverage w DevTools, Lighthouse (nieużywany JavaScript), budżet `size-limit` w CI.

## Kod

```js title="Źle"
import _ from 'lodash';            // whole library
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';     // ~300 KB, used only on "Download voucher"
```

```js title="Dobrze"
import debounce from 'lodash-es/debounce';
import { format } from 'date-fns';

voucherButton.addEventListener('click', async () => {
  const { jsPDF } = await import('jspdf'); // separate chunk, loaded on demand
  new jsPDF().text('Voucher: Hotel Santorini View', 10, 10).save('voucher.pdf');
});
```

## Częste błędy

- Ładowanie bibliotek do wykresów, edytorów czy PDF w głównym bundlu, choć używa ich mały odsetek użytkowników.
