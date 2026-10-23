---
title: "Współpraca w zespole: spory, feedback, wpływ"
level: mid
added: 2026-10-23
tags:
  - współpraca
  - komunikacja
  - disagree and commit
  - onboarding
  - estymacja
summary: "Dobra współpraca to rozstrzyganie sporów kryteriami zamiast opiniami, wczesne zgłaszanie ryzyk i dokumentacja, którą ktoś faktycznie czyta. Gdy decyzja zapadnie, wspierasz ją, nawet jeśli wolałeś inną opcję."
sources:
  - title: "Amazon: Leadership Principles (Have Backbone; Disagree and Commit)"
    url: https://www.amazon.jobs/content/en/our-workplace/leadership-principles
  - title: "Google Engineering Practices: Handling pushback in code reviews"
    url: https://google.github.io/eng-practices/review/reviewer/pushback.html
  - title: "StaffEng: Staying aligned with authority"
    url: https://staffeng.com/guides/staying-aligned-with-authority/
---

## Wyjaśnienie

Ten temat dotyczy pracy z ludźmi poza samym review kodu (o review i mentoringu jest osobny temat).

W sporze o podejście techniczne, zanim zaczniesz bronić swojego rozwiązania, uzgodnij kryteria: "Co jest ważniejsze w tym module: czas dowiezienia, wydajność czy łatwość zmian?". Potem porównujecie opcje według tych kryteriów, a nie według tego, kto ma większy staż. Jeśli brakuje danych, zaproponuj krótki spike: "Dajmy sobie dzień na prototyp obu wersji i porównajmy rozmiar bundla". Decyzje łatwe do odwrócenia podejmujcie szybko. Gdy nie dochodzicie do zgody, opiszcie obie opcje w jednym dokumencie i oddajcie decyzję osobie, która za nią odpowiada.

**Disagree and commit** to zasada z listy Amazon: masz obowiązek z szacunkiem kwestionować decyzję, z którą się nie zgadzasz, a gdy już zapadnie, angażujesz się w nią w pełni. Bez cichego sabotażu i bez "a nie mówiłem" przy pierwszym problemie. Możesz za to umówić punkt kontrolny: "Jeśli po dwóch sprintach czas builda przekroczy 5 minut, wracamy do tematu".

Gdy dostajesz feedback, z którym się nie zgadzasz, najpierw dopytaj i powtórz własnymi słowami, co usłyszałeś. Wytyczne Google do review radzą, żeby przy sprzeciwie najpierw sprawdzić, czy druga strona nie ma racji, i to samo działa w drugą stronę. Podziękuj, nawet jeśli się nie zgadzasz. Jeśli po namyśle dalej masz inne zdanie, wróć z konkretem: przykładem, pomiarem, linkiem do dokumentacji.

Przy estymacji rozbij zadanie na części po dzień-dwa i podawaj zakres ("3-5 dni"), a nie jedną liczbę. Wypisz niewiadome, na przykład "nie wiem, czy API zwraca paginację". O opóźnieniu mów wtedy, gdy się o nim dowiesz, a nie w dniu terminu, i od razu z opcjami: "Do piątku dowiozę wersję bez filtrów albo całość w środę. Co jest ważniejsze?".

Nowa osoba w zespole powinna pierwszego dnia uruchomić projekt jedną komendą, a w pierwszym tygodniu wdrożyć mały, prawdziwy PR. Pomaga przypisany buddy, krótka mapa repo (gdzie routing, gdzie API, gdzie design system) i lista osób od poszczególnych obszarów. Poproś nową osobę, żeby poprawiała dokumentację w miejscach, w których sama się zgubiła.

Ludzie czytają dokumentację, która leży tam, gdzie szukają (README obok kodu), zaczyna się od zadania ("Jak dodać nowy język") i ma komendy do skopiowania. **Runbook** to instrukcja na awarię: opisuje objaw, sprawdzenie, akcję i eskalację. Każdy dokument ma właściciela i datę ostatniej weryfikacji.

W rozmowie z produktem i designem, zanim powiesz "nie da się", zapytaj o cel. Potem zaproponuj wariant z kosztem: "Animacja z makiety to tydzień pracy i ryzyko dla INP. Podobny efekt da przejście CSS w pół dnia". Problemy z dostępnością i wydajnością zgłaszaj na etapie makiety, nie po wdrożeniu.

Wpływ na zespół nie wymaga stanowiska lidera. Przykład: zespół co sprint wypuszcza błędy w module płatności, a ty nie jesteś liderem. Zbierz dane (lista incydentów z ostatniego kwartału i ich przyczyny), zaproponuj mały eksperyment (testy integracyjne dla trzech głównych ścieżek, checklista w PR), zrób pierwszy krok sam i pokaż wynik na retro. Uzgodnij to wcześniej z liderem, żeby nie był zaskoczony.

## Kod

```md title="docs/runbooks/payments-timeout.md"
# Runbook: timeouts on payment confirmation

Owner: @team-checkout · Last verified: 2026-09-14

## Symptom
Alert "payment_confirm_timeout > 2%" or users stuck on "Przetwarzanie płatności".

## Check
1. Status page of the payment provider.
2. Grafana dashboard "Checkout" -> p75 latency of /api/payments/confirm.
3. Recent deploys: `gh run list --workflow deploy --limit 5`

## Act
- Provider outage: enable flag `payments.fallback-bank-transfer` in the flag service.
- Our deploy: roll back with `pnpm deploy:rollback checkout`.

## Escalate
No improvement after 15 min: page the on-call backend engineer in #incidents.
```

## Częste błędy

- Wygrywanie sporu zamiast rozwiązywania problemu: dyskusja o tym, kto ma rację, bez ustalenia kryteriów.
- Zgłaszanie ryzyka dopiero w dniu terminu, gdy nikt już nie ma pola manewru.
- Samo "nie da się" w rozmowie z produktem, bez wariantu alternatywnego i jego kosztu.
- "Disagree and commit" udawane: zgoda na spotkaniu, a potem wdrożenie po swojemu albo krytyka decyzji na prywatnym czacie.

## Pytania

### Opowiedz o sytuacji, gdy nie zgadzałeś się z rozwiązaniem kolegi. Jak to się skończyło? {#sr-collaboration-q1}

Dobra odpowiedź ma strukturę: sytuacja, co zrobiłeś, wynik i wniosek. Przykład szkieletu. Sytuacja: kolega chciał trzymać stan filtrów wyszukiwarki w globalnym store, a ja w URL, bo użytkownicy udostępniają linki do wyników. Co zrobiłem: zapytałem o jego powody (prostszy kod, mniej parsowania), zaproponowałem kryteria (linki do udostępnienia, przycisk wstecz, koszt implementacji) i pół dnia na prototyp obu wersji. Wynik: przy prototypie okazało się, że parsowanie URL to jeden mały hook, więc wybraliśmy URL, a jego pomysł na typowany schemat filtrów włączyliśmy do rozwiązania. Wniosek: od tamtej pory zaczynam spór od kryteriów. Jeśli decyzja wypadła nie po mojej myśli, powiedz to wprost i pokaż, że wdrożyłeś ją porządnie (disagree and commit). Unikaj historii, w której jedyną puentą jest to, że miałeś rację.

### Co robisz, gdy widzisz, że nie zdążysz z zadaniem? {#sr-collaboration-q2}

Mówię o tym od razu, gdy to wiem, a nie w dniu terminu. Przychodzę z konkretem: co jest gotowe, co zostało, co spowodowało opóźnienie (na przykład API nie zwraca paginacji). Daję opcje: okrojony zakres na czas, pełny zakres później albo pomoc drugiej osoby. Decyzję o priorytetach zostawiam osobie odpowiedzialnej za produkt, a po wszystkim zapisuję, co zmienić w estymacji następnym razem.

### Jak wdrożysz nową osobę do projektu? {#sr-collaboration-q3}

Przed pierwszym dniem sprawdzam, czy projekt uruchamia się według README na czystej maszynie. Pierwszego dnia: dostęp do repo i narzędzi, krótki przegląd architektury na żywo, buddy do pytań. W pierwszym tygodniu: małe zadanie, które przechodzi przez całą ścieżkę od PR przez review i CI do wdrożenia. Pytam ją, gdzie się zgubiła, i proszę, żeby poprawiła te miejsca w dokumentacji, bo jako jedyna widzi je świeżym okiem. Po dwóch-trzech tygodniach rozmowa: co było trudne, czego brakuje.

### Zespół ciągle wypuszcza błędy w jednym module, a ty nie jesteś liderem. Co robisz? {#sr-collaboration-q4}

Zaczynam od danych: zbieram zgłoszenia z ostatnich miesięcy i szukam wspólnej przyczyny, na przykład brak testów dla przeliczania cen albo zmiany bez review osoby znającej moduł. Rozmawiam z liderem, zanim cokolwiek ogłoszę, żeby propozycja była wspólna, a nie zaskoczeniem. Proponuję mały, mierzalny eksperyment na dwa sprinty: testy dla głównych ścieżek, `CODEOWNERS` dla modułu, punkt w checkliście PR. Pierwszą część robię sam, żeby nie zostać przy samym pomyśle. Na retro pokazuję wynik i zespół decyduje, czy zostawić zmianę.

## Quiz

### Co oznacza zasada "disagree and commit"? {#sr-collaboration-z1}

- [ ] Nie zgadzasz się, więc robisz po swojemu w swojej części kodu
- [x] Zgłaszasz sprzeciw przed decyzją, a po niej w pełni ją realizujesz
- [ ] Zgadzasz się na wszystko, żeby uniknąć konfliktu
- [ ] Wracasz do sporu przy każdym kolejnym problemie

Sprzeciw ma miejsce przed decyzją, a po niej cały zespół działa w jednym kierunku.

### Produkt prosi o funkcję, która wydaje ci się zbyt kosztowna. Najlepsza reakcja to: {#sr-collaboration-z2}

- [ ] Odpowiedzieć, że się nie da
- [ ] Zrobić bez dyskusji, nawet jeśli zajmie to miesiąc
- [x] Zapytać o cel i zaproponować tańszy wariant z jego kosztem
- [ ] Przekazać decyzję liderowi technicznemu bez własnej opinii

Partner dla produktu rozumie cel i pokazuje alternatywy z kosztami, a nie tylko sprzeciw.
