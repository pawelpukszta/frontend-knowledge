---
title: Google Consent Mode v2
priority: high
sources:
  - title: "Google: Consent mode overview"
    url: https://developers.google.com/tag-platform/security/concepts/consent-mode
---

Tagi Google dostosowują zachowanie do zgód użytkownika (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`). Domyślny stan zgód ustawiasz przed załadowaniem tagów, a po decyzji w banerze aktualizujesz go. Google wymaga tych sygnałów dla ruchu z EOG, aby korzystać z pomiaru konwersji, personalizacji reklam i remarketingu.

## Dlaczego to ważne

- Od marca 2024 Google wymaga sygnałów `ad_user_data` i `ad_personalization` dla użytkowników z EOG; bez nich kampanie tracą remarketing i część danych o konwersjach.
- Ustawienie stanu domyślnego na `denied` przed ładowaniem tagów to warunek zgodności z RODO i dyrektywą ePrivacy: żadne cookies reklamowe nie mogą powstać przed zgodą.
- Tryb zaawansowany (tagi ładują się, ale wysyłają pingi bez cookies) pozwala modelować konwersje dla osób bez zgody; tryb podstawowy w ogóle nie ładuje tagów do czasu zgody.

## Jak sprawdzić

Tag Assistant: stan zgód przed i po akceptacji banera; w Network parametr `gcs`/`gcd` w zapytaniach do Google; Application → Cookies: brak `_ga` i cookies reklamowych przed zgodą.

## Kod

```html title="Stan domyślny przed tagami, aktualizacja po decyzji"
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  // Must run before GTM / gtag.js loads
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500, // ms to wait for the consent banner (CMP)
  });
  dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' }); // part of the standard GTM snippet
</script>
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX"></script>
<script>
  // Called by the consent banner after the user's choice
  function onConsentSaved({ analytics, marketing }) {
    gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
    });
  }
</script>
```

## Częste błędy

- Wywołanie `gtag('consent', 'default', ...)` dopiero po załadowaniu GTM: pierwsze tagi zdążą zapisać cookies.
- Baner zgód ładowany jako ciężki, blokujący skrypt, który sam staje się elementem LCP lub przyczyną CLS.
