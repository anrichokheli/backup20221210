<?php
    define("jsonLanguagesPath", "../json/languages/");
    function setLanguage($lang, $html) {
        $json = json_decode(file_get_contents(jsonLanguagesPath . $lang . ".json"), 1);
        foreach($json as $key => $val)   {
            $html = str_replace("<string>" . $key . "</string>", $val, $html);
        }
        return $html;
    }
    define("defaultlanguage", "en");
    $language = defaultlanguage;
    if(isset($_GET["lang"]) && file_exists(jsonLanguagesPath . $_GET["lang"] . ".json"))    {
        $language = $_GET["lang"];
    }
    include("../php/uploadphotovideo.php");
    include("../php/uploadstring.php");
    include("../php/uploadvoice.php");
    $indexHTML = file_get_contents("../html/indexnoscript.html");
    if($language != defaultlanguage)    {
        $indexHTML = str_replace("action=\"../noscript/\"", "action=\"../noscript/?lang=" . $language . "\"", $indexHTML);
    }
    $indexHTML = str_replace("<htmllang>lang</htmllang>", $language, $indexHTML);
    $indexHTML = setLanguage($language, $indexHTML);
    echo $indexHTML;
?>