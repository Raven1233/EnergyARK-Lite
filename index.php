<?php

// First, the TemplateTool class is included.
// This can be done through Composer's autoloader.
require __DIR__ . '/vendor/autoload.php';

use RHRK\TemplateTool\TemplateTool;

//require 'src/TemplateTool.php';

// If there is multilingualism, the active language must be determined
// Depending on the area of ​​application, this can be implemented differently
$lang = 'de';
if (isset($_GET['lang'])) $lang = $_GET['lang'];
// For security reasons, please check the language so that cache files can only be created for permitted values.
if(!in_array($lang, ['de','en'])) $lang = 'de'; //Fallback 'de'

// URL of a TYPO3 page of the TU from which the template should be loaded
if ($lang == 'en') $url = 'https://rptu.de/index.php?id=33642&L=1';
else $url = 'https://rptu.de/index.php?id=33642';

// Path of the cache file in which the template should be saved
// For multilingual templates, it is recommended to distinguish between cases for language-dependent cache files.
//$cache = 'cache/template.html';
$cache = 'cache/template_' . $lang . '.html';

// The TemplateTool is instantiated. Cache options can optionally be passed
// become. If no cache_file is specified, the template is used for every request
// Reloaded. The cache_time parameter specifies after how many seconds
// Template is reloaded even though it exists in the cache. Should be independent of the cache_time
// no update is carried out, prevent_update must be set to true.
// The template can only be loaded successfully for the codes stored in accepted_http_codes.
$template = new TemplateTool($url, [
    'cache_file' => $cache,
    'cache_time' => 3600, //default = 3600
    'prevent_update' => true, //default = false
    'accepted_http_codes' => [200,301] //default = [200,301]
]);


require 'example_layout.php';

