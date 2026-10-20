---
title: Weryfikuj treści generowane przez AI
priority: medium
sources:
  - title: "Google: Guidance about AI-generated content"
    url: https://developers.google.com/search/blog/2023/02/google-search-and-ai-content
  - title: "Google: Using generative AI content on your website"
    url: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
---

AI może pomagać w researchu i pisaniu, ale masowe generowanie stron bez wartości dodanej Google traktuje jako spam ("scaled content abuse"). Każdy tekst przechodzi redakcję człowieka: fakty, źródła, własna perspektywa.

## Dlaczego to ważne

- Modele językowe przewidują prawdopodobne słowa, a nie sprawdzają faktów; zmyślona godzina odprawy czy wymóg wizowy trafia prosto do klienta.
- Polityka "scaled content abuse" (od marca 2024 r.) dotyczy masowej produkcji stron niezależnie od tego, czy pisze je człowiek, czy AI; karane jest zachowanie, nie narzędzie.
- Google zaleca sprawdzać także generowane automatycznie tytuły, meta description, dane strukturalne i teksty alternatywne obrazów.

## Jak sprawdzić

Redakcyjny przegląd przed publikacją: weryfikacja faktów, źródła, unikalne informacje, ton marki; w CMS zapisz, kto i kiedy zatwierdził tekst.

## Kod

```ts title="Bramka publikacji w CMS"
// AI-assisted drafts cannot be published without a human fact-check
type Draft = {
  aiAssisted: boolean;
  factCheckedBy?: string; // editor id
  factCheckedAt?: string; // ISO 8601
  sources: string[];
};

export function canPublish(d: Draft): { ok: boolean; reason?: string } {
  if (!d.aiAssisted) return { ok: true };
  if (!d.factCheckedBy || !d.factCheckedAt) return { ok: false, reason: 'Missing human fact-check' };
  if (d.sources.length === 0) return { ok: false, reason: 'AI-assisted text needs sources' };
  return { ok: true };
}
```

## Częste błędy

- Generowanie setek stron "Wakacje w {miasto}" z jednego promptu.
- Obrazy produktów z AI bez metadanych IPTC `DigitalSourceType`, których Google Merchant Center wymaga dla treści generowanych.
