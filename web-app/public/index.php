<?php
    define("protectedPath", dirname($_SERVER["DOCUMENT_ROOT"]) . "/protected/");
    define("protectedPublicPath", protectedPath . "public/");
    define("protectedPrivatePath", protectedPath . "private/");
    define("htmlPath", protectedPublicPath . "html/");
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
    function echoConsoleWarningScript(){
        if((isset($GLOBALS["rawData"]) && !$GLOBALS["rawData"]) || !isset($GLOBALS["rawData"])){
            echo '<script>try{function consoleWarning(a,b){for(var i=0;i<3;i++){console.log("%c!!!!!!!!!!","color:#ff0000;font-size:64px;font-weight:bold;");console.log("%c"+a+"!","color:#ff0000;font-size:32px;font-weight:bold;");console.log("%c"+b,"font-size:25px");console.log("%c!!!!!!!!!!","color:#ff0000;font-size:64px;font-weight:bold;");}}consoleWarning("' . $GLOBALS["langJSON"]["warning"] . '","' . $GLOBALS["langJSON"]["consolewarning"] . '");}catch(e){}</script>';
        }
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
            echoConsoleWarningScript();
            exit;
        }
    }
    header("X-Frame-Options: DENY");
    require(phpPath . "security.php");
    include(phpPath . "uploadphotovideo.php");
    include(phpPath . "uploadstring.php");
    include(phpPath . "uploadvoice.php");
    if(!empty($_GET["download"])){
        include(phpPath . "download.php");
    }
    if(!defined("notmain")){
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
    echoConsoleWarningScript();
?>