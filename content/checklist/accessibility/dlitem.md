---
title: Elementy dt i dd tylko wewnątrz dl
priority: medium
---

`<dt>` i `<dd>` poza `<dl>` (lub poza `<div>` będącym bezpośrednim dzieckiem `<dl>`) nie tworzą par termin-opis dla technologii asystujących.

## Dlaczego to ważne

- Osierocone `dt`/`dd` to niepoprawny HTML; czytnik traktuje je jak zwykły tekst bez relacji termin-opis.
- Problem zwykle pojawia się przy rozbijaniu listy na komponenty, gdy rodzic `<dl>` zostaje w innym komponencie niż dzieci.

## Jak sprawdzić

axe (`dlitem`); w React sprawdź, czy komponent renderujący `dt`/`dd` jest zawsze używany wewnątrz `<dl>`.

## Kod

```tsx title="Dobrze"
// The component returns a group; the parent always provides <dl>
function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt>{term}</dt>
      <dd>{value}</dd>
    </div>
  );
}

<dl>
  <Detail term="Transfer" value="W cenie" />
  <Detail term="Bagaż" value="20 kg" />
</dl>
```
