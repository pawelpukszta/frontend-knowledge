---
title: HTML w granicach limitów crawlera
priority: medium
sources:
  - title: "Google: Overview of Google crawlers"
    url: https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
  - title: "Google: Googlebot"
    url: https://developers.google.com/search/docs/crawling-indexing/googlebot
---

Googlebot pobiera tylko pierwsze 2 MB pliku HTML (liczone bez kompresji); treść i linki poza tym limitem nie istnieją dla wyszukiwarki. Celuj w znacznie mniej, bo ogromny HTML (np. z wielkim JSON stanu aplikacji) to też problem wydajności.

## Dlaczego to ważne

- Wszystko po 2 MB jest obcinane: opisy, linki do ofert i dane strukturalne umieszczone na końcu dokumentu nie zostaną zindeksowane.
- Zserializowany stan (np. pełne obiekty 500 ofert w payloadzie RSC lub `__NEXT_DATA__`) wydłuża parsowanie i hydratację, pogarszając INP na słabszych telefonach.
- Ten sam limit dotyczy osobno każdego zasobu (CSS, JS); wyjątkiem są pliki PDF z limitem 64 MB.

## Jak sprawdzić

Network w DevTools: rozmiar dokumentu po rozpakowaniu (Resource size) albo `curl` poniżej.

## Kod

```bash title="Rozmiar HTML bez kompresji"
# Ask for identity encoding so wc counts the raw bytes Googlebot is limited by
curl -s -H 'Accept-Encoding: identity' https://example.pl/wakacje/grecja \
  | wc -c | awk '{ printf "%.2f MB\n", $1 / 1024 / 1024 }'
```

```tsx title="Dobrze: tylko potrzebne pola trafiają do klienta"
// Server component: do not serialize full offer objects into the RSC payload
const offers = await getOffers({ country: "grecja", limit: 24 });
const cards = offers.map(({ id, slug, title, priceFrom, image }) => ({
  id, slug, title, priceFrom, image,
}));
return <OfferGrid offers={cards} />; // client component gets 5 fields, not 80
```

## Częste błędy

- Inline SVG i base64 obrazów w HTML, które w sumie dają kilka megabajtów.
