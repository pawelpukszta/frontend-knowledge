---
title: Zgoda na cookies przed ich ustawieniem
priority: high
sources:
  - title: "Google: Set up consent mode on websites"
    url: https://developers.google.com/tag-platform/security/guides/consent
---

Niezbędne cookies działają bez zgody, ale analityczne i marketingowe (oraz skrypty, które je ustawiają) dopiero po świadomej, dobrowolnej zgodzie. Odmowa musi być równie łatwa jak akceptacja, a zgodę trzeba móc w każdej chwili wycofać.

## Dlaczego to ważne

- Wymóg wynika z dyrektywy ePrivacy (w Polsce z Prawa komunikacji elektronicznej) i RODO; kary za naruszenie RODO sięgają 20 mln euro lub 4% światowego rocznego obrotu.
- Organy ochrony danych (raport grupy roboczej EDPB ds. banerów cookie z 2023 r.) wskazują jako naruszenia m.in. brak przycisku "Odrzuć" na pierwszej warstwie, domyślnie zaznaczone zgody i ukrywanie odmowy kolorem lub kontrastem.
- Baner, który tylko informuje, a skrypty i tak ładuje od razu, nie spełnia wymogów; liczy się to, co faktycznie trafia do przeglądarki przed kliknięciem.
- Google wymaga w EOG Consent Mode v2 (parametry `ad_user_data` i `ad_personalization`), aby korzystać z funkcji reklamowych, więc poprawna implementacja zgód to także warunek działania kampanii.

## Jak sprawdzić

Czysta sesja (okno incognito): Application → Cookies i panel Network przed kliknięciem w baner, po odmowie i po wycofaniu zgody; przed zgodą nie może być cookies `_ga` ani zapytań do domen reklamowych.

## Kod

```js title="consent.js"
// 1. Before any tag: deny everything by default (Consent Mode v2)
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', wait_for_update: 500,
});

// 2. Called by the banner buttons ("Akceptuj", "Odrzuć", "Zapisz wybór")
export function applyConsent({ analytics, marketing }) {
  const v = (on) => (on ? 'granted' : 'denied');
  gtag('consent', 'update', {
    analytics_storage: v(analytics),
    ad_storage: v(marketing), ad_user_data: v(marketing), ad_personalization: v(marketing),
  });
  // Load the analytics script only after an explicit opt-in
  if (analytics && !document.getElementById('gtag-js')) {
    document.head.append(Object.assign(document.createElement('script'), {
      id: 'gtag-js', async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX',
    }));
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');
  }
  // Consent Mode does not store the choice: persist it and re-apply it on every page
  localStorage.setItem('consent', JSON.stringify({ analytics, marketing, at: Date.now() }));
}
```

## Częste błędy

- Przycisk "Odrzuć" schowany w drugiej warstwie lub w formie ledwie widocznego linku.
- Brak linku "Ustawienia cookies" w stopce, przez co nie da się zmienić ani wycofać decyzji.
- Wycofanie zgody bez usunięcia już ustawionych cookies analitycznych.
