<?php

// Zunächst wird die Klasse TemplateTool eingebunden.
// Dies kann durch den Autoloader von Composer geschehen.
require __DIR__ . '/vendor/autoload.php';

use RHRK\TemplateTool\TemplateTool;

//require 'src/TemplateTool.php';

// Bei Mehrsprachigkeit ist muss die aktive Sprache ermittelt werden
// Je nach Einsatzbereich ist dies anders zu implementieren
$lang = 'de';
if (isset($_GET['lang'])) $lang = $_GET['lang'];
// Bitte aus Sicherheitsgründen die Sprache überprüfen, sodass nur für erlaubte Werte Cache-Dateien erzeugt werden können.
if(!in_array($lang, ['de','en'])) $lang = 'de'; //Fallback 'de'

// URL einer TYPO3-Seite der TU, von der das Template geladen werden soll
if ($lang == 'en') $url = 'https://rptu.de/index.php?id=33642&L=1';
else $url = 'https://rptu.de/index.php?id=33642';

// Pfad der Cache-Datei, in der das Template gespeichert werden soll
// Bei mehrsprachigen Templates empfiehlt sich eine Fallunterscheidung für sprachabhängige Cache-Dateien.
//$cache = 'cache/template.html';
$cache = 'cache/template_' . $lang . '.html';

// Das TemplateTool wird instanziiert. Optional können Cache-Optionen übergeben
// werden. Wird kein cache_file angegeben, wird das Template bei jedem Request
// neu geladen. Der Parameter cache_time gibt an, nach wie vielen Sekunden das
// Template neu geladen wird, obwohl es im Cache existiert. Soll unabhängig von der cache_time
// kein Update durchgeführt werden, muss prevent_update auf true gesetzt werden.
// Das Template kann nur für die in accepted_http_codes hinterlegten Codes erfolgreich geladen werden.
$template = new TemplateTool($url, [
    'cache_file' => $cache,
    'cache_time' => 0, //default = 3600
    'prevent_update' => false, //default = false
    'accepted_http_codes' => [200,301] //default = [200,301]
]);

// Jede im Template vorhandene Navigation sowie der Sprachumschalter können durch eigenes HTML ersetzt werden.
// Es muss ein HTML-String übergeben werden, der <li>-Elemente (siehe Beispiele) enthält.
// Wird false statt HTML übergeben, wird sie komplett entfernt.
// Optional kann ein boolescher Parameter übergeben werden, um die vorhandene Navigationen zu übernehmen
// Navigation: Hauptmenü (links oben)


// Das Beispiel-Layout wird aufgerufen. Es enthält das HTML-Grundgerüst
// und bindet die benötigten Teile des Templates ein.
require 'example_layout.php';
