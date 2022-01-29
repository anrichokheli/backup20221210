<?php
    define("upload", "uploads/");
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
    define("jsonLanguagesPath", "json/languages/");
    function setLanguage($lang, $html) {
        $json = json_decode(file_get_contents(jsonLanguagesPath . $lang . ".json", 1));
        foreach($json as $key => $val)   {
            $html = str_replace("<string>" . $key . "</string>", $val, $html);
        }
        return $html;
    }
    $language = "en";
    if(isset($_GET["lang"]) && file_exists(jsonLanguagesPath . $_GET["lang"] . ".json"))    {
        $language = $_GET["lang"];
    }
    $indexHTML = file_get_contents("html/indexjs.html");
    $indexHTML = str_replace("<htmllang>lang</htmllang>", $language, $indexHTML);
    $indexHTML = setLanguage($language, $indexHTML);
    echo $indexHTML;
?>