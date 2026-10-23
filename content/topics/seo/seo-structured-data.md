---
title: "Dane strukturalne: JSON-LD, schema.org i podglądy linków"
level: mid
added: 2026-10-23
tags:
  - SEO
  - JSON-LD
  - schema.org
  - rich results
  - Open Graph
summary: "Dane strukturalne opisują stronę słownikiem schema.org, żeby wyszukiwarka wiedziała, że to produkt z ceną, a nie zwykły tekst. Google zaleca JSON-LD. Poprawny markup daje szansę na wynik rozszerzony, ale go nie gwarantuje."
sources:
  - title: "Google Search Central: Introduction to structured data markup"
    url: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
  - title: "Google Search Central: General structured data guidelines"
    url: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
  - title: "Google Search Central: Product snippet structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
  - title: "Google Search Central: Breadcrumb structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
  - title: "Google Search Central: Organization structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/organization
  - title: "Google Search Central Blog: Farewell, sitelinks search box"
    url: https://developers.google.com/search/blog/2024/10/sitelinks-search-box
  - title: "Google Search Central Blog: Changes to HowTo and FAQ rich results"
    url: https://developers.google.com/search/blog/2023/08/howto-faq-changes
  - title: "Google Search Central: Latest documentation updates"
    url: https://developers.google.com/search/updates
  - title: "Next.js: How to implement JSON-LD"
    url: https://nextjs.org/docs/app/guides/json-ld
  - title: "Schema Markup Validator"
    url: https://validator.schema.org/
  - title: "The Open Graph protocol"
    url: https://ogp.me/
---

## Wyjaśnienie

**Dane strukturalne** to opis strony w formacie zrozumiałym dla maszyn, oparty na słowniku schema.org. Google obsługuje trzy formaty:

- JSON-LD: osobny `<script type="application/ld+json">`. Zalecany, bo nie miesza się z HTML-em i łatwo w nim zagnieżdżać obiekty. Google odczyta go także wtedy, gdy wstawi go JavaScript.
- Microdata: atrybuty `itemscope`, `itemtype`, `itemprop` wpięte w istniejący HTML.
- RDFa: podobnie jak microdata, ale na atrybutach RDFa.

Dla Google wszystkie trzy są równie dobre, jeśli markup jest poprawny. W praktyce JSON-LD łatwiej generować z danych, które komponent i tak ma.

Typy przydatne w e-commerce i turystyce:

- `Product` z zagnieżdżonym `Offer`: nazwa plus co najmniej jedno z `offers`, `aggregateRating`, `review`. W `Offer` cena (`price`), waluta ISO 4217 (`priceCurrency: "PLN"`) i dostępność (`https://schema.org/InStock`). Tylko na stronach jednego produktu, nie na listach i kategoriach.
- `BreadcrumbList`: ścieżka okruszków, minimum dwa `ListItem` z `position`, `name` i `item` (ostatni może nie mieć `item`).
- `Organization` (lub węższy podtyp, np. `OnlineStore`): na stronie głównej albo "O nas", z `name`, `url`, `logo`, `sameAs`. Nie ma wymaganych pól.

Markup ma opisywać treść widoczną na stronie. Cena w JSON-LD inna niż na ekranie albo opinie, których użytkownik nie widzi, łamią wytyczne i mogą skończyć się ręcznym działaniem, które odbiera prawo do wyników rozszerzonych. Nawet poprawny markup nie gwarantuje, że wynik rozszerzony się pokaże.

Część wyników rozszerzonych zniknęła. Google przestał pokazywać HowTo (2023), pole wyszukiwania w sitelinkach (od 21 listopada 2024) i FAQ (od 7 maja 2026). Starego markupu nie trzeba usuwać, nie szkodzi, ale nie ma sensu dodawać go z myślą o wyglądzie wyniku.

Do walidacji służą dwa narzędzia. Rich Results Test sprawdza, do jakich wyników Google strona się kwalifikuje, i pokazuje wyrenderowany HTML. Schema Markup Validator (validator.schema.org) sprawdza zgodność ze schema.org w ogóle, bez reguł Google. Po wdrożeniu błędy widać w raportach wyników rozszerzonych w Search Console.

**Open Graph** i karty X to osobny mechanizm: z nich komunikatory i media społecznościowe budują podgląd udostępnionego linku. Google może wziąć `og:title` pod uwagę przy tytule wyniku, ale wyników rozszerzonych z OG nie tworzy. OG wymaga `og:title`, `og:type`, `og:image` i `og:url`, opcjonalnie `og:description`. X ma własny tag `twitter:card` (np. `summary_large_image`) wybierający układ karty.

## Kod

```tsx title="app/oferty/[slug]/page.tsx"
export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = await getOffer(slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Grecja', item: 'https://example.pl/grecja' },
      { '@type': 'ListItem', position: 2, name: 'Kreta', item: 'https://example.pl/grecja/kreta' },
      { '@type': 'ListItem', position: 3, name: offer.name },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so data from the CMS cannot close the script tag (XSS)
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <OfferView offer={offer} />
    </>
  );
}
```

```html title="Podgląd linku: Open Graph i X"
<meta property="og:title" content="Kreta: hotel Aria 4*, all inclusive" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.pl/oferty/kreta-hotel-aria" />
<meta property="og:image" content="https://example.pl/img/kreta-aria-1200x630.jpg" />
<meta property="og:description" content="7 nocy przy plaży, wylot z Warszawy." />
<meta name="twitter:card" content="summary_large_image" />
```

## Częste błędy

- Dane w JSON-LD rozjeżdżają się z widoczną treścią: inna cena, stara dostępność, oceny bez widocznych opinii.
- `Product` z `Offer` na stronie kategorii z listą 30 produktów.
- Dodawanie `FAQPage` lub `HowTo` dla wyglądu wyniku, którego Google już nie pokazuje.
- Wstawianie danych z CMS przez `JSON.stringify` bez escapowania `<`, co otwiera drogę do XSS.

## Pytania

### Jak dodasz dane strukturalne do strony produktu? {#seo-structured-data-q1}

Dodam blok JSON-LD typu `Product` z zagnieżdżonym `Offer`, generowany po stronie serwera z tych samych danych, które renderują stronę. Dzięki temu cena i dostępność w markupie zawsze zgadzają się z widoczną treścią. Wymagane jest `name` i jedno z `offers`, `aggregateRating`, `review`. `aggregateRating` dodam tylko wtedy, gdy opinie są widoczne na stronie. Potem sprawdzę stronę w Rich Results Test, a po wdrożeniu obserwuję raport w Search Console.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Plecak trekkingowy Tatra 40 l",
  "image": ["https://example.pl/img/tatra-40.jpg"],
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": 4.7, "reviewCount": 86 },
  "offers": {
    "@type": "Offer",
    "url": "https://example.pl/plecaki/tatra-40",
    "price": 349.0,
    "priceCurrency": "PLN",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### Czym różni się JSON-LD od microdata? {#seo-structured-data-q2}

Microdata to atrybuty (`itemscope`, `itemprop`) dopisane do elementów HTML, więc markup jest spleciony z szablonem. Każda zmiana layoutu może go zepsuć. JSON-LD to osobny blok `<script>` z obiektem JSON, niezależny od struktury DOM, łatwy do wygenerowania z danych i do zagnieżdżania. Dla Google oba formaty są równoważne, jeśli są poprawne, ale Google zaleca JSON-LD jako najprostszy w utrzymaniu.

### Markup przechodzi Rich Results Test, a wyniku rozszerzonego nie ma. Dlaczego? {#seo-structured-data-q3}

Google nie gwarantuje wyświetlenia wyniku rozszerzonego nawet przy poprawnym markupie. Konkretne przyczyny, które warto sprawdzić: markup opisuje treść niewidoczną dla użytkownika, strona ma ręczne działanie za spam w danych strukturalnych, typ wyniku został wycofany (FAQ, HowTo) albo strona nie jest jeszcze ponownie przetworzona. Warto sprawdzić raport w Search Console i stan indeksowania w narzędziu Sprawdzanie adresu URL.

### Czym Open Graph różni się od danych strukturalnych schema.org? {#seo-structured-data-q4}

Open Graph to tagi `<meta property="og:...">` czytane przez serwisy, które budują podgląd udostępnionego linku: tytuł, obrazek, opis. Schema.org opisuje znaczenie treści dla wyszukiwarek i może dać wynik rozszerzony. To dwa niezależne mechanizmy i zwykle potrzebujesz obu. Boty podglądów często nie wykonują JavaScriptu, więc tagi OG muszą być w HTML z serwera.

## Quiz

### Który format danych strukturalnych Google zaleca w większości przypadków? {#seo-structured-data-z1}

- [ ] Microdata
- [ ] RDFa
- [x] JSON-LD
- [ ] Open Graph

Google akceptuje wszystkie trzy formaty schema.org, ale jako najłatwiejszy w utrzymaniu zaleca JSON-LD; Open Graph nie jest formatem schema.org.

### Który z tych wyników rozszerzonych Google nadal wyświetla w 2026 roku? {#seo-structured-data-z2}

- [ ] FAQ
- [ ] HowTo
- [ ] Pole wyszukiwania w sitelinkach
- [x] Ścieżka okruszków (BreadcrumbList)

FAQ, HowTo i pole wyszukiwania w sitelinkach zostały wycofane, a breadcrumb jest nadal na liście obsługiwanych funkcji.
