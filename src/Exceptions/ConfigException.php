<?php namespace RHRK\TemplateTool\Exceptions;

use Exception;

class ConfigException extends Exception
{
    public static function wrongDatatype($type, $info = '')
    {
        $msg = 'Wrong datatype used: ' . $type . '. ' . $info;
        return new static($msg);
    }

}
