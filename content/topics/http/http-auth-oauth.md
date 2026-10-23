---
title: "Uwierzytelnianie, autoryzacja i OAuth 2.0"
level: mid
added: 2026-10-23
tags:
  - OAuth 2.0
  - PKCE
  - OpenID Connect
  - auth
  - refresh token
  - BFF
summary: Uwierzytelnianie ustala, kim jest użytkownik, a autoryzacja decyduje, co może zrobić. W SPA i aplikacjach mobilnych używa się OAuth 2.0 z authorization code flow i PKCE; OpenID Connect dodaje do tego informację o zalogowanym użytkowniku.
sources:
  - title: "RFC 9700: Best Current Practice for OAuth 2.0 Security"
    url: https://www.rfc-editor.org/rfc/rfc9700.html
  - title: "RFC 10017: OAuth 2.0 for Browser-Based Applications"
    url: https://www.rfc-editor.org/rfc/rfc10017.html
  - title: "oauth.net: PKCE"
    url: https://oauth.net/2/pkce/
  - title: "OpenID Connect Core 1.0"
    url: https://openid.net/specs/openid-connect-core-1_0.html
  - title: "OWASP: OAuth 2.0 Protocol Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html
  - title: "MDN: 401 Unauthorized"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401
---

## Wyjaśnienie

**Uwierzytelnianie** (authentication, authn) odpowiada na pytanie "kim jesteś?": hasło, passkey, logowanie przez Google. **Autoryzacja** (authorization, authz) odpowiada na pytanie "co Ci wolno?": role i uprawnienia do konkretnego zasobu. Najpierw jest uwierzytelnienie, potem autoryzacja. W HTTP brak albo nieważne dane logowania kończą się statusem `401`, a znany użytkownik bez uprawnień dostaje `403`.

Po zalogowaniu serwer musi rozpoznać użytkownika przy kolejnych żądaniach. Robi to na jeden z dwóch sposobów:

- **Sesja**: stan żyje na serwerze, a przeglądarka trzyma tylko identyfikator w cookie. Wylogowanie to usunięcie sesji.
- **Token** (np. JWT): klient wysyła go w nagłówku `Authorization: Bearer ...`, a API sprawdza podpis bez zaglądania do bazy. Takiego tokenu nie da się łatwo unieważnić przed końcem jego ważności.

Gdzie trzymać tokeny w przeglądarce, opisuje temat o sesji i tokenach w kategorii bezpieczeństwa.

**OAuth 2.0** służy do delegowania dostępu. Aplikacja dostaje ograniczony dostęp do API w imieniu użytkownika i nigdy nie widzi jego hasła. Występują w nim cztery role:

| Rola | Przykład |
|---|---|
| Resource owner | użytkownik |
| Client | Twoja SPA, aplikacja mobilna albo backend |
| Authorization server | Keycloak, Auth0, Entra ID: loguje użytkownika i wydaje tokeny |
| Resource server | API, które przyjmuje access token |

**Authorization code flow z PKCE** wygląda tak:

1. Klient losuje `code_verifier` i liczy z niego `code_challenge` (SHA-256, metoda `S256`).
2. Przekierowuje użytkownika do authorization servera, dołączając `code_challenge`, `state`, `scope` i `redirect_uri`.
3. Użytkownik się loguje, a serwer odsyła go na `redirect_uri` z jednorazowym `code`.
4. Klient wysyła `code` razem z `code_verifier` do endpointu tokenów (`POST`, poza paskiem adresu).
5. Serwer sprawdza, czy verifier pasuje do challenge. Kod przechwycony przez kogoś innego nic mu nie da.

RFC 9700 (OAuth 2.0 Security Best Current Practice, styczeń 2025) wymaga PKCE od klientów publicznych, czyli SPA i aplikacji mobilnych, które nie mogą bezpiecznie przechować sekretu. Pozostałym klientom go zaleca. **Implicit flow** (`response_type=token`) oddawał access token od razu w URL po przekierowaniu. Token lądował w historii przeglądarki i był dostępny dla skryptów na stronie; nie dało się też powiązać go z konkretnym klientem. RFC 9700 mówi, że klienci nie powinni go używać, a grant z hasłem użytkownika (password grant) zakazuje całkowicie.

**OpenID Connect (OIDC)** to warstwa tożsamości nad OAuth 2.0. Sam OAuth mówi tylko, że klient ma dostęp do API, nie mówi, kto się zalogował. Gdy dodasz scope `openid`, dostaniesz też **ID token**: JWT z claimami `iss`, `sub` (stały identyfikator użytkownika), `aud` (Twój `client_id`), `exp` i `iat`. ID token czyta klient, access token wysyła się do API. Dodatkowe dane profilu zwraca endpoint UserInfo po okazaniu access tokenu.

Access token żyje krótko, zwykle kilka minut. Nowy pobiera się refresh tokenem, bez ponownego logowania. Przy **rotacji refresh tokenów** każde odświeżenie zwraca nowy refresh token, a stary traci ważność. Jeśli atakujący ukradnie token i obie strony go użyją, jedna z nich pokaże już unieważniony token. Serwer nie wie która, więc unieważnia aktywny refresh token i obie muszą zalogować się od nowa. RFC 9700 wymaga od klientów publicznych rotacji albo tokenów powiązanych z nadawcą (np. DPoP).

RFC 10017 (OAuth 2.0 for Browser-Based Applications, sierpień 2026) uznaje **Backend for Frontend (BFF)** za najbezpieczniejszy wzorzec dla aplikacji w przeglądarce. Serwer jest klientem poufnym: sam przeprowadza flow, trzyma tokeny i przekazuje wywołania do API. Przeglądarka ma tylko cookie sesyjne z flagą `HttpOnly`, więc skrypt wstrzyknięty przez XSS nie odczyta tokenów. Budowę takiego serwera opisuje temat o BFF w kategorii Node.

## Kod

```ts title="PKCE w przeglądarce (Web Crypto)"
function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function startLogin() {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const state = crypto.randomUUID();
  sessionStorage.setItem('oauth', JSON.stringify({ verifier, state })); // read back on /callback

  const url = new URL('https://auth.example.pl/authorize');
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: 'travel-spa',
    redirect_uri: 'https://app.example.pl/callback',
    scope: 'openid profile offers:read',
    code_challenge: base64url(new Uint8Array(hash)),
    code_challenge_method: 'S256',
    state,
  }).toString();
  location.assign(url);
}
```

```http title="Wymiana kodu na tokeny"
POST /token HTTP/1.1
Host: auth.example.pl
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA&client_id=travel-spa&redirect_uri=https%3A%2F%2Fapp.example.pl%2Fcallback&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{ "access_token": "eyJhbGciOi...", "token_type": "Bearer", "expires_in": 300,
  "refresh_token": "8xLOxBtZp8", "id_token": "eyJraWQiOi..." }
```

## Częste błędy

- Implicit flow albo password grant w nowej aplikacji.
- Wysyłanie ID tokenu do API jako przepustki. API przyjmuje access token; ID token jest dla klienta.
- Pomijanie sprawdzenia `state` (lub `nonce` w OIDC) po powrocie z authorization servera.
- Wildcardy w `redirect_uri` u dostawcy. RFC 9700 wymaga dokładnego porównania adresu.

## Pytania

### Czym różni się uwierzytelnianie od autoryzacji? {#http-auth-oauth-q1}

Uwierzytelnianie sprawdza tożsamość: kim jest użytkownik albo aplikacja. Robi się to hasłem, passkeyem, logowaniem przez zewnętrznego dostawcę. Autoryzacja sprawdza uprawnienia: czy ten konkretny użytkownik może odczytać fakturę albo usunąć ofertę. Autoryzacja zawsze idzie po uwierzytelnieniu, bo trzeba wiedzieć, kogo pytamy o uprawnienia. W HTTP widać to w statusach: `401` oznacza brak lub nieważne dane logowania (zaloguj się i spróbuj ponownie), `403` oznacza, że serwer wie, kim jesteś, ale nie pozwala na tę akcję. Uprawnienia zawsze sprawdza serwer; ukrycie przycisku na froncie to tylko wygoda.

### Jak działa authorization code flow z PKCE i dlaczego zastąpił implicit flow? {#http-auth-oauth-q2}

Klient losuje sekret `code_verifier`, a do authorization servera wysyła tylko jego skrót `code_challenge`. Po zalogowaniu użytkownik wraca z jednorazowym kodem. Klient wymienia go na tokeny w osobnym żądaniu `POST` i dołącza wtedy oryginalny verifier. Serwer liczy skrót i porównuje go z challenge, więc kod przechwycony po drodze jest bezużyteczny bez verifiera. Implicit flow zwracał access token bezpośrednio w URL. Taki token trafiał do historii przeglądarki i był dostępny dla skryptów, a nie dało się go powiązać z klientem. RFC 9700 odradza implicit flow i wymaga PKCE od klientów publicznych, czyli SPA i aplikacji mobilnych.

### Czym jest OpenID Connect i czym różni się ID token od access tokenu? {#http-auth-oauth-q3}

OAuth 2.0 służy do autoryzacji dostępu do API i nie definiuje, jak przekazać klientowi, kto się zalogował. OpenID Connect dokłada tę warstwę: po dodaniu scope `openid` authorization server zwraca ID token. To JWT z informacją o zalogowaniu: `iss` (kto wydał), `sub` (identyfikator użytkownika), `aud` (dla którego klienta), `exp` i `iat`. ID token czyta i weryfikuje klient, np. żeby pokazać nazwę użytkownika. Access token jest przepustką do API i klient nie powinien zakładać nic o jego treści. Dodatkowe dane profilu można pobrać z endpointu UserInfo.

### Jak bezpiecznie obsłużyć tokeny OAuth w aplikacji SPA? {#http-auth-oauth-q4}

Najbezpieczniej przenieść całe OAuth na serwer, czyli zastosować BFF. Serwer jest klientem poufnym, trzyma tokeny i przekazuje wywołania do API, a przeglądarka dostaje tylko cookie sesyjne `HttpOnly`. RFC 10017 wskazuje ten wzorzec jako najbezpieczniejszy dla aplikacji przeglądarkowych. Jeśli SPA musi być klientem publicznym, to: authorization code flow z PKCE, krótko żyjące access tokeny i rotacja refresh tokenów. Przy rotacji każde odświeżenie unieważnia poprzedni refresh token, więc ponowne użycie starego tokenu ujawnia kradzież i serwer może odciąć sesję.

## Quiz

### Który flow wybrać dla nowej SPA logującej użytkowników przez OAuth 2.0? {#http-auth-oauth-z1}

- [ ] Implicit flow, bo nie wymaga backendu
- [x] Authorization code flow z PKCE
- [ ] Resource owner password credentials
- [ ] Client credentials

RFC 9700 wymaga PKCE od klientów publicznych, odradza implicit flow i zakazuje password grantu; client credentials nie loguje użytkownika.

### Co OpenID Connect dodaje do OAuth 2.0? {#http-auth-oauth-z2}

- [ ] Szyfrowanie access tokenów
- [x] ID token z informacją, kto się zalogował
- [ ] Ochronę przed CSRF w formularzach
- [ ] Automatyczne odświeżanie tokenów bez refresh tokenu

OIDC to warstwa tożsamości: po scope `openid` klient dostaje ID token z claimami takimi jak `sub` i `iss`.
