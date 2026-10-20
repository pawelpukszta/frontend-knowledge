---
title: Zakładki obsługiwane klawiaturą
priority: medium
sources:
  - title: "W3C APG: Tabs Pattern"
    url: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
---

Wzorzec tabs: `tablist`, `tab` z `aria-selected`, `tabpanel`; strzałki zmieniają zakładkę, Home i End przenoszą na pierwszą i ostatnią, Tab przechodzi do panelu (roving tabindex).

## Dlaczego to ważne

- Roving tabindex sprawia, że cała lista zakładek to jeden przystanek Tab; bez niego użytkownik przechodzi przez wszystkie karty, zanim dotrze do treści.
- `aria-selected` oraz powiązania `aria-controls` i `aria-labelledby` pozwalają czytnikowi ogłosić "karta, Pokoje, zaznaczona, 2 z 3".
- Użytkownicy czytników oczekują obsługi strzałkami, bo tak działają zakładki w aplikacjach systemowych; widget, który ogłasza się jako zakładki, a reaguje tylko na Tab, łamie te oczekiwania.

## Jak sprawdzić

Przełączaj zakładki strzałkami, Home i End, sprawdź ogłaszanie stanu i to, że Tab z aktywnej karty przenosi do panelu.

## Kod

```html
<div role="tablist" aria-label="Szczegóły hotelu">
  <button role="tab" id="tab-desc" aria-selected="true" aria-controls="panel-desc">Opis</button>
  <button role="tab" id="tab-rooms" aria-selected="false" aria-controls="panel-rooms" tabindex="-1">Pokoje</button>
  <button role="tab" id="tab-reviews" aria-selected="false" aria-controls="panel-reviews" tabindex="-1">Opinie</button>
</div>
<div role="tabpanel" id="panel-desc" aria-labelledby="tab-desc" tabindex="0">...</div>
<div role="tabpanel" id="panel-rooms" aria-labelledby="tab-rooms" tabindex="0" hidden>...</div>
<div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" tabindex="0" hidden>...</div>
```

```ts
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role="tab"]')];

function select(tab: HTMLButtonElement) {
  for (const t of tabs) {
    const active = t === tab;
    t.setAttribute("aria-selected", String(active));
    t.tabIndex = active ? 0 : -1; // roving tabindex
    document.getElementById(t.getAttribute("aria-controls")!)!.hidden = !active;
  }
  tab.focus();
}

tabs.forEach((tab, i) => {
  const last = tabs.length - 1;
  const keys: Record<string, number> = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last };
  tab.addEventListener("click", () => select(tab));
  tab.addEventListener("keydown", (e) => {
    if (e.key in keys) { e.preventDefault(); select(tabs[keys[e.key]]); }
  });
});
```

## Częste błędy

- Zakładki użyte jako nawigacja między stronami; wtedy to zwykłe linki z `aria-current="page"`, nie wzorzec tabs.
- Każda karta z `tabindex="0"`: Tab przechodzi przez wszystkie karty, a strzałki nie działają.
