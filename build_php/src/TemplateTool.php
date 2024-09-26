<?php namespace RHRK\TemplateTool;

use RHRK\CurlBuilder\CurlBuilder;
use RHRK\TemplateTool\Exceptions\CacheException;
use RHRK\TemplateTool\Exceptions\ConfigException;
use RHRK\TemplateTool\Exceptions\ResponseException;

class TemplateTool
{
    protected $url;
    protected $config = [
        'cache_time' => 3600,
        'prevent_update' => false,
        'accepted_http_codes' => [200, 301]
    ];
    protected $host;
    protected $head;
    protected $body;
    protected $body_attributes;
    protected $content_before;
    protected $content;
    protected $content_after;

    public function __construct(string $url, array $config = [])
    {
        $this->url = $url;
        $parts = parse_url($url);
        $this->host = $parts['scheme'] . '://' . $parts['host'];

        $this->config = array_merge($this->config, $config);

        $template = $this->load_template();
        $this->split_template($template);
    }

    public function head(): string
    {
        return $this->head;
    }

    public function body(): string
    {
        return $this->body;
    }

    /**
     * @deprecated use content_before() instead
     */
    public function header()
    {
        return $this->content_before();
    }

    /**
     * @deprecated use content_after() instead
     */
    public function footer()
    {
        return $this->content_after();
    }

    public function body_attributes(): string
    {
        return implode(' ', $this->body_attributes);
    }

    public function meta(): string
    {
        return $this->extract_head_tags('~<meta[^>]*>~s');
    }

    public function styles(): string
    {
        $styles = $this->extract_head_tags('~<link[^>]*>~s');
        $styles .= $this->extract_head_tags('~<style[^>]*>(.|\n)*?</style>~s');
        return $styles;
    }

    public function scripts(): string
    {
        return $this->extract_head_tags('~<script[^>]*>(.|\n)*?</script>~s');
    }

    public function content(): string
    {
        $content_start = '<!--t3-content start-->';
        $content_stop = '<!--t3-content stop-->';
        $this->content = explode($content_stop, $this->body, 2)[0];
        $this->content = explode($content_start, $this->content, 2)[1];
        $this->content = $content_start . $this->content . $content_stop;
        return $this->content;
    }

    public function content_before(): string
    {
        $content_start = '<!--t3-content start-->';
        $this->content_before = explode($content_start, $this->body, 2)[0];
        return $this->content_before;
    }

    public function content_after(): string
    {
        $content_stop = '<!--t3-content stop-->';
        $this->content_after = explode($content_stop, $this->body, 2)[1];
        $this->add_pageinfo();
        return $this->content_after;
    }

    public function set_nav_main_menu($html, $add = false): TemplateTool
    {
        $name = 'menu-main-menu';
        if ($add) $html = $this->get_nav_template($name) . $html;

        $this->replace_nav_html($html, $name);
        return $this;
    }

    public function set_nav_link_collection($html = false, $add = false): TemplateTool
    {
        $name = 'menu-link-collection';
        if ($add) $html = $this->get_nav_template($name) . $html;
        $this->replace_nav_html($html, $name);
        return $this;
    }

    public function set_nav_audience_access($html = false, $add = false): TemplateTool
    {
        $name = 'menu-audience-access';
        if ($add) $html = $this->get_nav_template($name) . $html;
        $this->replace_nav_html($html, $name);
        return $this;
    }

    public function set_breadcrumb_top($html = false): TemplateTool
    {
        $name = 'breadcrumb-top';
        $this->replace_nav_html($html, $name);
        return $this;
    }

    public function set_breadcrumb_content($html = false, $replace_last_list_item_only = false): TemplateTool
    {
        $name = 'breadcrumb-content';
        if ($replace_last_list_item_only) {
            $nav_html = $this->get_nav_template($name);
            //search li elements
            $regex = '~<li [^>]*?>.*?</li>~s';
            preg_match_all($regex, $nav_html, $match);
            $last_element = end($match[0]);

            //replace last li element
            $regex = '~' . $last_element . '~';
            $html = preg_replace($regex, $html, $nav_html);
        }
        $this->replace_nav_html($html, $name);
        return $this;
    }

    public function set_search($html = false): TemplateTool
    {
        $name = 'search';
        $this->replace_t3_pattern($html, $name, '');
        return $this;
    }

    public function set_menu($html = false): TemplateTool
    {
        $name = 'menu-off-canvas';
        $this->replace_t3_pattern($html, $name, '');
        return $this;
    }

    public function set_page_title($text = false, $href = ''): TemplateTool
    {
        $names = ['menu-page-title', 'page-title'];
        foreach ($names as $index => $name) {
            $regex = '~<!--t3-' . $name . '-link start-->.*?<!--t3-' . $name . '-link stop-->~s';
            preg_match($regex, $this->body, $match);
            if ($match[0] ?? false) {
                $regex = '~(.* href=")(.*?)(".*)~s';
                $link = preg_replace($regex, '${1}' . $href . '${3}', $match[0]);
                $this->replace_t3_pattern($link, $name, 'link');
                $this->replace_t3_pattern($text, $name, 'text');
            }
        }
        return $this;
    }

    public function set_language_switch($html = false, string $lang = 'de'): TemplateTool
    {
        $name = 'languagenavigation';
        if ($html) {
            //replace current language name
            $html_title = '<span class="" data-iso-code="' . $lang . '">' . strtoupper($lang) . '</span>';
            $this->replace_t3_pattern($html_title, $name, 'title');

            //remove current language from dropdown html
            $regex = '~<li><a [^>]*?data-iso-code="' . $lang . '">.*?</a></li>~s';
            $html = preg_replace($regex, '', $html);
        }
        $this->replace_nav_html($html, $name);
        return $this;
    }

    public function set_pageinfo_last_modified($html): TemplateTool
    {
        $name = 'footer-pageinfo-last_modified';
        $this->replace_t3_pattern($html, $name);
        return $this;
    }

    /* page_id changes are not allowed
    public function set_pageinfo_page_id($html): TemplateTool
    {
        $name = 'footer-pageinfo-page_id';
        $this->replace_t3_pattern($html, $name);
        return $this;
    }*/

    public function set_pageinfo_responsible($html): TemplateTool
    {
        $name = 'footer-pageinfo-responsible';
        $this->replace_t3_pattern($html, $name);
        return $this;
    }

    public function remove_sitemap_link(): TemplateTool
    {
        $regex = '~<div class="siteMapLink">.*?</div>~s';
        $this->body = preg_replace($regex, '', $this->body);
        return $this;
    }

    protected function load_template()
    {
        if (!isset($this->config['cache_file'])) return $this->fetch_template();
        return $this->load_cached_template($this->config['cache_file'], $this->config['cache_time'], $this->config['prevent_update']);
    }

    protected function split_template($html): void
    {
        // clean body tag
        preg_match('~<body[^>]*>~', $html, $matches);
        $this->body_attributes = $this->extract_attributes($matches[0]);
        $html = preg_replace('~<body[^>]*>~', '<body>', $html);

        $this->head = explode('<head>', explode('</head>', $html, 2)[0], 2)[1];
        $this->body = explode('<body>', explode('</body>', $html, 2)[0], 2)[1];
    }

    protected function load_cached_template(string $file, int $time, bool $prevent_update)
    {
        $dir = pathinfo($file)['dirname'];

        if (!is_dir($dir)) {
            if (!mkdir($dir, 0777, true)) {
                throw CacheException::directoryCreateError($dir);
            }
        }

        if (!file_exists($file) || (time() - filemtime($file) > $time && !$prevent_update)) {
            try {
                $html = $this->fetch_template();
                if (file_put_contents($file, $html) === false) {
                    throw CacheException::fileCreateError($file);
                }
            }
            catch (ResponseException $e) {
                //ignore ResponseExceptions if cache exists
                if (!file_exists($file)) throw $e;
            }
        }

        return file_get_contents($file);
    }

    protected function fetch_template(): string
    {
        $curl = CurlBuilder::builder($this->url)->setUserAgent('TemplateTools');
        $result = $curl->exec([CURLOPT_HTTPHEADER => ['Accept' => 'text/html'], CURLOPT_CONNECTTIMEOUT => 5]);

        if ($result === false) {
            throw ResponseException::curlError($curl->getError());
        }

        if (!in_array($curl->getHttpCode(), $this->config['accepted_http_codes'])) {
            throw ResponseException::unexpectedStatusCode($curl->getHttpCode());
        }

        $result = trim($result);
        if ($result === '') {
            throw ResponseException::emptyTemplate();
        }

        if (strpos($result, '<!--t3') === false) {
            throw ResponseException::invalidTemplate();
        }

        return $this->modify_template($result);
    }

    protected function modify_template($html): string
    {
        // replace relative with absolute paths
        $regex = '~(href|src|srcset)="(?![a-z0-9]+:|//|#|")/?~s';
        $html = preg_replace($regex, '$1="' . $this->host . '/', $html);

        // remove piwik code
        $before_piwik = explode('<!-- Piwik -->', $html, 2)[0];
        $after_piwik = explode('<!-- End Piwik Code -->', $html, 2);
        $after_piwik = $after_piwik[1] ?? ($before_piwik[1] ?? '');
        $html = $before_piwik . $after_piwik;


        // replace http:// links
        $html = preg_replace('~http://~i', 'https://', $html);

        return $html;
    }

    protected function extract_head_tags($regex): string
    {
        preg_match_all($regex, $this->head, $matches);
        $output = PHP_EOL;

        foreach ($matches[0] as $match) {
            $output .= str_repeat(' ', 4) . $match . PHP_EOL;
        }

        return $output;
    }

    protected function extract_attributes($html)
    {
        $regex = '~(\S+)=[\"\']?((?:.(?![\"\']?\s+(?:\S+)=|\s*\/?[>\"\']))+.)[\"\']?~';
        preg_match_all($regex, $html, $matches);
        return $matches[0];
    }

    protected function add_pageinfo(): void
    {
        $after = ' (<a href="https://gitlab.rhrk.uni-kl.de/rhrk-webdev/template-tools" target="_blank" title="TemplateTools">TemplateTools</a>)';
        $stop = '<!--t3-footer-pageinfo-page_id stop-->';
        $regex = '~' . $stop . '~s';
        $html = $stop . $after;
        $this->content_after = preg_replace($regex, $html, $this->content_after);
    }

    protected function get_nav_template(string $name): string
    {
        $html = explode('<!--t3-' . $name . '-list start-->', $this->body, 2);
        if (isset($html[1])) {
            $html = $html[1];
            $html = explode('<!--t3-' . $name . '-list stop-->', $html, 2)[0];
            return $html;
        }
        return '';
    }

    protected function replace_t3_pattern($html, string $name, $inner = false): void
    {
        //replace inner parts
        if ($inner) $inner = '-' . $inner;
        else $inner = '';

        $start = '<!--t3-' . $name . $inner . ' start-->';
        $stop = '<!--t3-' . $name . $inner . ' stop-->';

        if ($html === false) {
            //remove with outer parts
            $start = '<!--t3-' . $name . ' start-->';
            $stop = '<!--t3-' . $name . ' stop-->';
            $html = '';
        } else if (!is_string($html)) throw ConfigException::wrongDatatype(gettype($html), 'parameter "html" - allowed types: string|false');

        $regex = '~' . $start . '.*?' . $stop . '~s';
        $this->body = preg_replace($regex, $start . $html . $stop, $this->body);
    }

    protected function replace_nav_html($html, string $name): void
    {
        $this->replace_t3_pattern($html, $name, 'list');
    }
}
