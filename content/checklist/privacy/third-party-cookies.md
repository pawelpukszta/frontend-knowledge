---
title: Bez cookies firm trzecich
priority: medium
---

Cookies śledzące między serwisami wymagają zgody, Safari blokuje je domyślnie, a Firefox izoluje per witryna (Total Cookie Protection). Zastępuj je analityką first-party, danymi zbieranymi przez własną domenę i osadzeniami w trybie zwiększonej prywatności.

## Dlaczego to ważne

- Safari i Firefox domyślnie odcinają śledzenie przez cookies firm trzecich, więc remarketing i analityka oparte na nich i tak tracą dużą część danych.
- Chrome nadal domyślnie je dopuszcza (w 2025 r. Google zrezygnował z planu ich wyłączenia i wycofał większość API Privacy Sandbox), ale użytkownik może je zablokować, a w trybie incognito są blokowane; nie da się na nich polegać.
- Każdy skrypt firmy trzeciej (piksel, widget czatu, odtwarzacz) to także dodatkowe zapytania, wolniejsze ładowanie i ryzyko przekazania danych poza EOG.

## Jak sprawdzić

Application → Cookies: cookies z domen innych niż własna; w panelu Network filtr `-domain:example.pl` pokazuje wszystkie zapytania do zewnętrznych hostów.

## Kod

```html title="Osadzenie wideo"
<!-- Privacy-enhanced mode: no tracking cookies before the user plays the video -->
<iframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  title="Wideo: Hotel Lindos Bay"
  loading="lazy"
  allowfullscreen
></iframe>
```

```ts title="src/lib/track.ts"
// First-party, cookieless events sent to our own domain and stored aggregated
export function track(name: string, props: Record<string, string | number> = {}) {
  const body = JSON.stringify({ name, props, path: location.pathname });
  navigator.sendBeacon('/api/events', new Blob([body], { type: 'application/json' }));
}
```

## Częste błędy

- Analityka "bez cookies" oparta na fingerprintingu; odczyt cech urządzenia też podlega przepisom o zgodzie.
- Ładowanie piksela reklamowego lub widgetu czatu przed zgodą, bo "to tylko jeden skrypt".
