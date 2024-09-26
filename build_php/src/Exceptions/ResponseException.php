<?php namespace RHRK\TemplateTool\Exceptions;

use Exception;

class ResponseException extends Exception
{
    public static function curlError($error)
    {
        $msg = 'Received curl error while fetching the template: ' . $error;
        return new static($msg);
    }

    public static function emptyTemplate()
    {
        $msg = 'Fetched template is empty.';
        return new static($msg);
    }

    public static function invalidTemplate()
    {
        $msg = 'Fetched template is invalid.';
        return new static($msg);
    }

    public static function unexpectedStatusCode($code)
    {
        $msg = 'Received http code is not allowed: ' . $code;
        return new static($msg);
    }
}
