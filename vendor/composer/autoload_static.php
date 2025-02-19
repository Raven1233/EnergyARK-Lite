<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit527e4d5019168d078019490342fc4318
{
    public static $prefixLengthsPsr4 = array (
        'R' => 
        array (
            'RHRK\\TemplateTool\\' => 18,
            'RHRK\\CurlBuilder\\' => 17,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'RHRK\\TemplateTool\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
        'RHRK\\CurlBuilder\\' => 
        array (
            0 => __DIR__ . '/..' . '/rhrk-webdev/curl/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit527e4d5019168d078019490342fc4318::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit527e4d5019168d078019490342fc4318::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit527e4d5019168d078019490342fc4318::$classMap;

        }, null, ClassLoader::class);
    }
}
