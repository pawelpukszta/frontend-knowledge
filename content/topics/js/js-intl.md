---
title: "Intl: liczby, daty, liczba mnoga i listy"
level: mid
added: 2026-10-23
tags:
  - Intl
  - i18n
  - PluralRules
  - NumberFormat
  - DateTimeFormat
  - ICU MessageFormat
summary: Wbudowane API `Intl` formatuje kwoty, procenty, daty, czas względny i listy według reguł danego języka, a `Intl.PluralRules` dobiera formę rzeczownika do liczby. Polski ma tych form trzy dla liczb całkowitych (oferta, oferty, ofert), więc `n + " ofert"` nie wystarcza.
sources:
  - title: "MDN: Intl"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
  - title: "MDN: Intl.NumberFormat() constructor"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
  - title: "MDN: Intl.DateTimeFormat() constructor"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
  - title: "MDN: Intl.RelativeTimeFormat"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
  - title: "MDN: Intl.PluralRules"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
  - title: "MDN: Intl.ListFormat"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat
  - title: "MDN: Number.prototype.toLocaleString() (performance)"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
  - title: "Unicode CLDR: Language Plural Rules"
    url: https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
  - title: "FormatJS: ICU Message syntax"
    url: https://formatjs.github.io/docs/core-concepts/icu-syntax/
  - title: "i18next: Plurals"
    url: https://www.i18next.com/translation-function/plurals
---

## Wyjaśnienie

`Intl` to wbudowany obiekt z konstruktorami formatującymi dane według języka i regionu. Każdy przyjmuje locale (np. `'pl-PL'`) i opcje. Dane o formatach pochodzą z Unicode CLDR, więc nie musisz ich trzymać w kodzie.

- `Intl.NumberFormat` formatuje liczby. `style: 'currency'` z kodem waluty (`'PLN'`) daje kwotę, `style: 'percent'` mnoży przez 100 i dodaje `%`, a `notation: 'compact'` skraca duże liczby ("1,5 mln"). W polskim locale liczby czterocyfrowe nie mają separatora tysięcy, a w większych separatorem jest twarda spacja (U+00A0), nie zwykła.
- `Intl.DateTimeFormat` formatuje daty i godziny. `dateStyle` i `timeStyle` dają gotowe warianty, a opcje takie jak `weekday` czy `month` pozwalają złożyć własny (obu podejść nie można łączyć). `timeZone` przyjmuje nazwę IANA, np. `'Europe/Warsaw'`. Bez niej używana jest strefa środowiska, więc serwer w UTC i przeglądarka w Polsce mogą pokazać inny dzień.
- `Intl.RelativeTimeFormat` zamienia wartość i jednostkę na tekst: "za 5 minut", "3 godziny temu". Z `numeric: 'auto'` pisze "wczoraj" zamiast "1 dzień temu". Różnicę między datami liczysz sam.
- `Intl.PluralRules` mówi, której formy liczby mnogiej użyć. `select(n)` zwraca kategorię CLDR. Polski ma cztery: `one` (1 oferta), `few` (2-4, 22-24, ale nie 12-14: 2 oferty), `many` (0, 5-21, 25: 5 ofert) i `other` dla ułamków (1,5 oferty). Angielski ma tylko `one` i `other`, dlatego kod pisany "po angielsku" (`n === 1 ? 'oferta' : 'ofert'`) daje "2 ofert" i "22 ofert".
- `Intl.ListFormat` łączy elementy listy spójnikiem języka: "Kraków, Gdańsk i Wrocław" albo z `type: 'disjunction'` "karta, BLIK lub przelew".
- `Intl.Collator` (sortowanie) i `Intl.Segmenter` (dzielenie na grafemy i słowa) opisuje temat o stringach.

Biblioteki i18n budują na tym API. FormatJS (`react-intl`) używa składni **ICU MessageFormat**: tłumacz pisze w jednym komunikacie wszystkie formy, np. `{count, plural, one {# oferta} few {# oferty} many {# ofert} other {# oferty}}`, a `#` wstawia sformatowaną liczbę. i18next ma własny format: osobne klucze z sufiksami `_one`, `_few`, `_many`, `_other`, wybierane przez `Intl.PluralRules` na podstawie opcji `count`.

Utworzenie formatera wymaga wyszukania danych locale, a `format` na gotowej instancji jest tani. MDN zaleca utworzenie `Intl.NumberFormat` raz i wywoływanie `format` wiele razy zamiast `toLocaleString` w pętli. W React trzymaj formatery na poziomie modułu albo w `useMemo` zależnym od locale.

Katalogi tłumaczeń dziel per locale (często także per obszar aplikacji) i ładuj dynamicznym `import()`. Użytkownik pobiera wtedy tylko swój język, a bundler tworzy osobny chunk dla każdego pliku.

## Kod

```js title="Formatowanie (wyniki z Node 24, ICU 77)"
const pln = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
pln.format(1234.5);  // '1234,50 zł': no grouping for 4 digits in Polish
pln.format(12500);   // '12 500,00 zł': the spaces are U+00A0
new Intl.NumberFormat('pl-PL', { style: 'percent', maximumFractionDigits: 1 }).format(0.256); // '25,6%'
new Intl.NumberFormat('pl-PL', { notation: 'compact' }).format(1500000); // '1,5 mln'

const date = new Date('2026-10-23T18:30:00Z');
new Intl.DateTimeFormat('pl-PL', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Warsaw' })
  .format(date); // 'piątek, 23 października 2026 20:30'
new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo', timeZoneName: 'short' })
  .format(date); // '03:30 GMT+9'

const rtf = new Intl.RelativeTimeFormat('pl', { numeric: 'auto' });
rtf.format(-1, 'day');   // 'wczoraj'
rtf.format(-3, 'hour');  // '3 godziny temu'
rtf.format(5, 'minute'); // 'za 5 minut'

new Intl.ListFormat('pl', { type: 'conjunction' }).format(['Kraków', 'Gdańsk', 'Wrocław']);
// 'Kraków, Gdańsk i Wrocław'
```

```js title="Liczba mnoga i leniwe katalogi"
const rules = new Intl.PluralRules('pl-PL'); // create once, reuse
const forms = { one: 'oferta', few: 'oferty', many: 'ofert', other: 'oferty' };
const offersLabel = (n) => `${n} ${forms[rules.select(n)]}`;
[1, 2, 5, 12, 22].map(offersLabel);
// ['1 oferta', '2 oferty', '5 ofert', '12 ofert', '22 oferty']

// The same with ICU MessageFormat (intl-messageformat from FormatJS)
import { IntlMessageFormat } from 'intl-messageformat';
const offers = new IntlMessageFormat(
  '{count, plural, =0 {Brak ofert} one {# oferta} few {# oferty} many {# ofert} other {# oferty}}',
  'pl',
);
offers.format({ count: 0 });   // 'Brak ofert'
offers.format({ count: 22 });  // '22 oferty'
offers.format({ count: 1.5 }); // '1,5 oferty'

// One chunk per locale: the user downloads only their language
const catalogs = {
  pl: () => import('./locales/pl.json'),
  en: () => import('./locales/en.json'),
};
const messages = (await catalogs[locale]()).default;
```

## Częste błędy

- Sklejanie `n + ' ofert'` albo `n === 1 ? ... : ...`. W polskim daje to "2 ofert" i "22 ofert".
- Testy porównujące wynik formatowania ze stringiem ze zwykłą spacją. `'12 500,00 zł'` z klawiatury nie jest równe wynikowi `Intl`, bo ten zawiera U+00A0.
- Formatowanie daty bez `timeZone` w kodzie renderowanym na serwerze i w przeglądarce: różne strefy dają hydration mismatch albo inny dzień.
- Tworzenie nowego `Intl.NumberFormat` dla każdej komórki tabeli zamiast jednej instancji na kolumnę.

## Pytania

### Dlaczego `n + " ofert"` nie działa po polsku i jak to naprawić? {#js-intl-q1}

Przy liczbach całkowitych polski ma trzy formy rzeczownika (oferta, oferty, ofert), a ułamki mają osobną. Forma zależy od końcówki liczby, a nie tylko od tego, czy to 1: mówimy "2 oferty", "5 ofert", "12 ofert", ale "22 oferty". `Intl.PluralRules('pl').select(n)` zwraca kategorię CLDR (`one`, `few`, `many` lub `other`), a ty dobierasz do niej tekst. W aplikacji z tłumaczeniami robi to biblioteka i18n: w ICU MessageFormat piszesz wszystkie formy w jednym komunikacie, a w i18next tworzysz klucze z sufiksami `_one`, `_few`, `_many`, `_other`.

```js
const rules = new Intl.PluralRules('pl');
rules.select(2);  // 'few'
rules.select(12); // 'many'
rules.select(22); // 'few'
```

### Jak sformatować kwotę w złotówkach i na co uważać? {#js-intl-q2}

`new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })`, a potem `format(kwota)`. Dostajesz "12 500,00 zł" z przecinkiem dziesiętnym i symbolem po kwocie. W polskim locale czterocyfrowe kwoty nie mają separatora ("1234,50 zł"), a separatorem tysięcy jest twarda spacja U+00A0, co psuje testy porównujące stringi wpisane z klawiatury. Liczbę miejsc po przecinku zmienisz przez `maximumFractionDigits`. Formater tworzę raz, bo konstrukcja jest droższa od samego `format`.

### Jak obsłużyć strefy czasowe przy wyświetlaniu dat? {#js-intl-q3}

Przechowuję i przesyłam momenty w czasie jako UTC (ISO 8601 albo timestamp), a strefę wybieram dopiero przy wyświetlaniu przez opcję `timeZone` w `Intl.DateTimeFormat`. Bez niej używana jest strefa środowiska, więc serwer w UTC i przeglądarka w Polsce mogą pokazać inną godzinę, a nawet inny dzień. Przy SSR przekazuję strefę jawnie, żeby HTML z serwera zgadzał się z renderem w przeglądarce. Gdy treść dotyczy miejsca (godzina wylotu z Tokio), pokazuję ją w strefie tego miejsca i dodaję `timeZoneName`.

### Jak zorganizować tłumaczenia w dużej aplikacji? {#js-intl-q4}

Komunikaty trzymam w katalogach per locale, w dużej aplikacji dodatkowo podzielonych na obszary (np. koszyk, wyszukiwarka). Ładuję je dynamicznym `import()`, więc bundler robi z każdego osobny chunk i użytkownik pobiera tylko swój język. Teksty z liczbami i zmiennymi zapisuję jako komunikaty ICU (`plural`, `select`), a nie sklejam w kodzie, bo szyk zdania i formy różnią się między językami. Liczby i daty formatuję przez `Intl` z locale użytkownika, a formatery tworzę raz.

## Quiz

### Co zwróci `new Intl.PluralRules('pl').select(22)`? {#js-intl-z1}

- [ ] 'one'
- [x] 'few'
- [ ] 'many'
- [ ] 'other'

Liczby kończące się na 2-4 (poza 12-14) należą w polskim do kategorii `few`, stąd "22 oferty".

### Dlaczego `expect(pln.format(12500)).toBe('12 500,00 zł')` z tekstem wpisanym z klawiatury może nie przejść? {#js-intl-z2}

- [ ] `Intl` zaokrągla kwotę do pełnych złotych
- [ ] Symbol waluty stoi przed kwotą
- [x] Separatorem tysięcy i spacją przed "zł" jest twarda spacja U+00A0
- [ ] Polski locale używa kropki jako separatora dziesiętnego

`Intl.NumberFormat` wstawia niełamliwe spacje, które wyglądają tak samo jak zwykłe, ale mają inny kod znaku.
