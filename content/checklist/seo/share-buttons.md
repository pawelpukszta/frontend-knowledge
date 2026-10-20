---
title: Przyciski udostępniania
priority: low
---

Ułatwiaj dzielenie się treścią prostymi linkami lub Web Share API zamiast ciężkich widżetów zewnętrznych, które śledzą użytkowników i spowalniają stronę.

## Dlaczego to ważne

- Oficjalne widżety społecznościowe ładują skrypty z zewnętrznych domen, często setki KB JS, co pogarsza LCP i INP.
- Skrypty platform ustawiają ciasteczka śledzące, więc wymagają zgody (RODO, prawo telekomunikacyjne); bez zgody i tak nie powinny się ładować.
- Web Share API otwiera natywny arkusz udostępniania z aplikacjami, których użytkownik faktycznie używa (WhatsApp, Messenger, SMS).

## Jak sprawdzić

Panel Network w DevTools: liczba i waga zapytań do domen społecznościowych; test na telefonie i fallbacku na desktopie.

## Kod

```js title="Web Share API z fallbackiem"
const btn = document.querySelector('#share');

btn.addEventListener('click', async () => {
  const url = document.querySelector('link[rel="canonical"]')?.href ?? location.href;
  if (navigator.share) {
    try { await navigator.share({ title: document.title, url }); } catch { /* user cancelled */ }
    return;
  }
  // Desktop browsers without Web Share: copy the link instead
  await navigator.clipboard.writeText(url);
  btn.textContent = 'Skopiowano link';
});
```

## Częste błędy

- Liczniki udostępnień pokazujące "0", które zniechęcają zamiast zachęcać.
