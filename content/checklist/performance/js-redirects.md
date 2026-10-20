---
title: Bez przekierowań zasobów JS
priority: medium
---

Skrypty, które zwracają 3xx, dodają cały round-trip (czasem także nowe połączenie) przed pobraniem i wykonaniem. Linkuj od razu do docelowego adresu.

## Dlaczego to ważne

- Każde przekierowanie to dodatkowe 100-300 ms na sieci mobilnej, a dla skryptu w `<head>` opóźnienie przenosi się na FCP i LCP.
- Przekierowania często biorą się z adresów bez wersji (`/latest/`) lub z `http://`; adres z wersją jest też bezpieczniejszy i lepiej się cache'uje.
- Przekierowanie na inną domenę wymaga nowego DNS, TCP i TLS, co niweczy efekt `preconnect` do pierwotnej domeny.

## Jak sprawdzić

Filtr JS w Network i kolumna Status (301, 302, 307, 308); w Lighthouse przekierowania dokumentu trafiają do insightu o opóźnieniu dokumentu.

## Kod

```html title="Źle"
<!-- 302 to /widget/v3.4.1/widget.min.js, then the real download -->
<script src="http://cdn.example-widget.com/widget/latest/widget.js" defer></script>
```

```html title="Dobrze"
<script src="https://cdn.example-widget.com/widget/v3.4.1/widget.min.js" defer
        integrity="sha384-..." crossorigin="anonymous"></script>
```

## Częste błędy

- Skrócone linki lub adresy trackingowe w `src` skryptów.
