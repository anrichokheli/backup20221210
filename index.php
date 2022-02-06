<?php
    define("defaultLang", "en");
    define("jsonLanguagesPath", "json/languages/");
    if(isset($_GET["lang"]) && file_exists(jsonLanguagesPath . $_GET["lang"] . ".json")){
        $lang = $_GET["lang"];
    }
    else{
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
            include("php/view.php");
            exit;
        }
    }
    include("php/uploadphotovideo.php");
    include("php/uploadstring.php");
    include("php/uploadvoice.php");
    if(isset($_GET["noscript"])){
        $indexHTML = file_get_contents("html/indexnoscript.html");
        if($lang != defaultLang)    {
            $indexHTML = str_replace("action=\"?noscript/\"", "action=\"?noscript&lang=" . $lang . "\"", $indexHTML);
        }
        $indexHTML = setLanguage($indexHTML);
        if($lang != defaultLang){
            $langget = "&lang=" . $lang;
        }
        else{
            $langget = "";
        }
        $indexHTML = str_replace("<php>LANG</php>", $langget, $indexHTML);
    }else{
        $indexHTML = file_get_contents("html/indexjs.html");
    }
    $indexHTML = str_replace("<htmllang>lang</htmllang>", $lang, $indexHTML);
    $indexHTML = setLanguage($indexHTML);
    echo $indexHTML;
?>