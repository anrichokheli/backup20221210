<?php
define("notmain", "");
include($_SERVER["DOCUMENT_ROOT"] . "/index.php");
if(isset($_GET["noscript"])){
    $indexHTML = file_get_contents(htmlPath . "indexappnoscript.html");
}else{
    $indexHTML = file_get_contents(htmlPath . "indexapp.html");
}
if($lang != defaultLang){
    $langget = "&lang=" . $lang;
}
else{
    $langget = "";
}
$indexHTML = str_replace("<php>LANG</php>", $langget, $indexHTML);
$indexHTML = str_replace("<htmllang>lang</htmllang>", $lang, $indexHTML);
$indexHTML = str_replace("<php>langoptions</php>", getLangOptions(), $indexHTML);
$indexHTML = setLanguage($indexHTML);
echo $indexHTML;
?>