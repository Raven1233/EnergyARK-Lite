<?php namespace RHRK\TemplateTool\Exceptions;

use Exception;

class CacheException extends Exception
{
    public static function fileCreateError($path)
    {
        $msg = 'Cannot create cache file: '.$path;
        return new static($msg);
    }
    public static function directoryCreateError($path)
    {
        $msg = 'Cannot create cache directory: '.$path;
        return new static($msg);
    }

}
