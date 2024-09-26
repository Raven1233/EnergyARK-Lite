# RHRK Template Tool

Wenn Sie kein TYPO3 nutzen, aber Ihre Webseiten dennoch im Corporate Design der TU anbieten
möchten, können Sie diese PHP-Klasse verwenden, um das aktuelle TU-Template in Ihren eigenen
Projekten einzubinden.

## Inhalt

* [Installation](#installation)
* [Verwendungsbeispiel](#verwendungsbeispiel)
* [Klasse TemplateTool](#klasse-templatetool)

## Installation

Das Template Tool sollte mit dem [Composer](https://getcomposer.org) Dependency Manager
installiert werden. Es wird mindestens PHP 7.3 benötigt.

Folgende Abhängigkeiten werden mitinstalliert: [CurlBuilder](https://gitlab.rhrk.uni-kl.de/rhrk-webdev/services/curl)

Die Datei `composer.json` muss folgende Einträge beinhalten.
Danach kann der Befehl `composer install` ausgeführt werden.

```
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://gitlab.rhrk.uni-kl.de/rhrk-webdev/template-tools.git"
        }
    ],
    "require": {
        "rhrk-webdev/template-tools": "^3.0"
    }
}
```

## Verwendungsbeispiel

Ein kommentiertes Verwendungsbeispiel findet sich in der Datei `example.php`. Die Datei
`example_layout.php` enthält das HTML-Grundgerüst und bindet die benötigten Teile des Templates
ein. Die einzelnen Methoden der Klasse `TemplateTool` werden im folgenden Abschnitt erläutert.

## Klasse TemplateTool

Hier eine Übersicht über die Klasse `RHRK\TemplateTool`.

* `__construct($url, $config = [])` instanziiert das Template Tool und lädt das Template zu
  einer bestimmten `url`. Optional können Cache-Optionen übergeben werden, siehe `example.php`.
  Wird kein `cache_file` angegeben, wird das Template bei jedem Request neu geladen. Der Parameter
  `cache_time` gibt an, nach wie vielen Sekunden das Template neu geladen wird, obwohl es im Cache
  existiert. Der Standardwert ist `3600` (eine Stunde). Soll unabhängig von der `cache_time` kein Update durchgeführt
  werden, muss `prevent_update` auf `true` gesetzt werden. Das Template kann nur für die in `accepted_http_codes`
  hinterlegten HTTP Codes erfolgreich geladen werden. Standardmäßig werden die Codes 200 und 301 akzeptiert.
* `meta()` liefert alle Tags vom Typ `<meta>` aus dem `<head>` des Templates.
* `styles()` liefert alle Tags vom Typ `<link rel="stylesheet">` sowie `<styles>` aus dem `<head>` des Templates.
* `scripts()` liefert alle Tags vom Typ `<script>` aus dem `<head>` des Templates.
* `content_before()` liefert den Inhalt vor `<!--t3-content start-->` aus dem `<body>` des Templates.
* `content_after()` liefert den Inhalt nach `<!--t3-content stop-->` aus dem `<body>` des Templates.
* `head()` liefert den Inhalt des `<head>`-Tags des Templates.
* `body()` liefert den Inhalt des `<body>`-Tags des Templates.
* `body_attributes()` liefert die Attribute des `<body>`-Tags des Templates.
* Navigation:
    * Nachfolgenden Methoden greifen nur wenn dass entsprechende Element im Template vorhanden ist.
    * Es muss ein HTML-String übergeben werden, der `<li>`-Elemente enthält.
    * Wird kein Wert gesetzt, wird der jeweilige Bereich im Template entfernt.
        * Hauptmenü: Optionaler 2. Parameter `true` stellt die vorhandene Navigation der eigenen voran.
            * `set_nav_main_menu($html,$bool)` ersetzt die Hauptnavigation im Hauptmenü im Template.
            * `set_nav_link_collection($html,$bool)` ersetzt die Linksliste im Hauptmenü im Template.
            * `set_nav_audience_access($html,$bool)` ersetzt die Zielgruppennavigation im Hauptmenü im Template.
            * `set_menu($html)` ersetzt das komplette Hauptmenü. Wird das Menü komplett entfernt, muss zurzeit mit
              JavaScript Fehlern gerechnet werden.
        * `set_breadcrumb_top($html)` ersetzt die obere Breadcrumbnavigation im Template.
        * `set_breadcrumb_content($html, $bool)` ersetzt untere Breadcrumbnavigation im Template. Bei Bedarf kann auch
          nur das letzte Listenelement ausgetauscht werden.
        * `set_language_switch($html,$lang)` ersetzt die Links für den Sprachwechsel im Template. Als zusätzlicher
          Parameter wird die aktive Sprache benötigt.
        * `set_search($html)` ersetzt die Suche.
* `set_pageinfo_last_modified($html)` ersetzt den Wert hinter "Zuletzt bearbeitet: " im Footer.
* `set_pageinfo_responsible($html)` ersetzt den Wert hinter "Red. verantwortl.: " im Footer.
* `set_page_title($text,$href)` ersetzt, falls vorhanden, den verlinkten Seitentitel unterhalb des RPTU Logos sowie im
  Hauptmenü. Als Parameter wird ein Titel sowie eine URL erwartet.
