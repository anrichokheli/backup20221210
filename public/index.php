<?php
    define("protectedPath", dirname($_SERVER["DOCUMENT_ROOT"]) . "/protected/");
    define("protectedPublicPath", protectedPath . "public/");
    define("protectedPrivatePath", protectedPath . "private/");
    define("htmlPath", $_SERVER["DOCUMENT_ROOT"] . "/html/");
    define("phpPath", protectedPrivatePath . "php/");
    define("defaultLang", "en");
    define("jsonLanguagesPath", $_SERVER["DOCUMENT_ROOT"] . "/json/languages/");
    if(file_exists(phpPath . "setup.php")){
        require_once(phpPath . "setup.php");
    }
    if(!empty($_GET["lang"])){
        $lang = $_GET["lang"];
    }
    else if(!empty($_COOKIE["lang"])){
        $lang = $_COOKIE["lang"];
    }
    else if(!empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])){
        $lang = explode(",", $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0];
    }
    else{
        $lang = defaultLang;
    }
    $lang = substr($lang, 0, 2);
    if(!file_exists(jsonLanguagesPath . $lang . ".json")){
        $lang = defaultLang;
    }
    $langJSON = json_decode(file_get_contents(jsonLanguagesPath . $lang . ".json"), 1);
    function setLanguage($html) {
        foreach($GLOBALS["langJSON"] as $key => $val)   {
            $html = str_replace("<string>" . $key . "</string>", $val, $html);
        }
        return $html;
    }
    if(strpos($_SERVER["REQUEST_URI"], /*"/" . basename(getcwd()) . */"/?") === 0)    {
        if(strpos($_SERVER["REQUEST_URI"], "&") !== FALSE)    {
            $_GET["n"] = substr($_SERVER["REQUEST_URI"], /*6*/2, strpos($_SERVER["REQUEST_URI"], "&") - 2);
        }
        else    {
            $_GET["n"] = substr($_SERVER["REQUEST_URI"], /*6*/2);
        }
        if(ctype_digit($_GET["n"]) || isset($_GET["view"]))    {
            include(phpPath . "view.php");
            exit;
        }
    }
    include(phpPath . "uploadphotovideo.php");
    include(phpPath . "uploadstring.php");
    include(phpPath . "uploadvoice.php");
    if(!empty($_GET["download"])){
        include(phpPath . "download.php");
    }
    if(!defined("ps")){
        if(isset($_GET["noscript"])){
            $indexHTML = file_get_contents(htmlPath . "indexnoscript.html");
        }else{
            $indexHTML = file_get_contents(htmlPath . "index.html");
        }
        if($lang != defaultLang){
            $langget = "&lang=" . $lang;
        }
        else{
            $langget = "";
        }
        $indexHTML = str_replace("<php>LANG</php>", $langget, $indexHTML);
        $indexHTML = str_replace("<htmllang>lang</htmllang>", $lang, $indexHTML);
        $indexHTML = setLanguage($indexHTML);
        echo $indexHTML;
    }
?>