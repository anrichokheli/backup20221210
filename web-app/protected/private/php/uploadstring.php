<?php
    if(isset($_POST["n"]) && isset($_POST["key"])
    &&
    ctype_digit($_POST["n"])/* && ctype_digit($_POST["key"])*//* && ctype_digit($_POST["string"]) && ctype_digit($_POST["type"])*/
    &&
    (isset($_POST["description"]) || (isset($_POST["latitude"]) && isset($_POST["longitude"])))
    )    {
        define("upload", protectedPublicPath . "uploads/");
        define("uploadstrings", upload . "strings/");
        define("descriptions", uploadstrings . "descriptions/");
        define("descriptiontimes", uploadstrings . "descriptiontimes/");
        define("locations", uploadstrings . "locations/");
        define("locationtimes", uploadstrings . "locationtimes/");
        define("secretPath", protectedPrivatePath . "secret/");
        define("keysPath", secretPath . "keys/");
        define("uploadfiles", upload . "files/");
        define("voices", uploadfiles . "voices/");
        $keyPath = keysPath . $_POST["n"];
        if(!file_exists($keyPath))    {
            exit("-1");
        }
        function saveData($dataPath, $timePath, $string)  {
            $dirPath = $dataPath . $_POST["n"] . "/";
            if(!file_exists($dirPath))    {
                mkdir($dirPath);
            }
            $path = $dirPath . (count(scandir($dirPath)) - 2) . ".txt";
            $dirPathT = $timePath . $_POST["n"] . "/";
            if(!file_exists($dirPathT))    {
                mkdir($dirPathT);
            }
            $pathT = $dirPathT . (count(scandir($dirPathT)) - 2) . ".txt";
            if(!password_verify($_POST["key"], file_get_contents($GLOBALS["keyPath"])))    {
                exit("-4");
            }
            if(file_put_contents($path, $string))   {
                if(!file_put_contents($pathT, time())){
                    echo("-5");
                }
                return TRUE;
            }
            return FALSE;
        }
        function getMainWebAddress(){
            if(isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] === "on"){
                $protocol = "https";
            }else{
                $protocol = "http";
            }
            return $protocol . "://" . $_SERVER["HTTP_HOST"];
        }
        if(isset($_POST["description"]))    {
            define("maxDescriptionLength", 100000);
            if(saveData(descriptions, descriptiontimes, mb_substr($_POST["description"], 0, maxDescriptionLength))){
                if(isset($_POST["submit"]) || isset($_POST["ps"]))    {
                    /*if(!file_exists(descriptions . $_POST["n"] . ".txt"))    {
                        $descriptionHTML = file_get_contents(htmlPath . "uploaddescription.html");
                        $descriptionHTML = str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], $descriptionHTML));
                        $descriptionHTML = str_replace("<php>MAX_DESCRIPTION_LENGTH</php>", maxDescriptionLength, $descriptionHTML);
                    }
                    else    {
                        $descriptionHTML = "<div style=\"border:1px solid #00ff00;padding:1px;\"><img width=\"16\" height=\"16\" src=\"/images/description.svg\"> <string>description</string>; <string>uploadcompleted</string></div>";
                    }
                    if(!glob(voices . $_POST["n"] . ".*"))    {
                        define("maxVoiceFileSize", 25000000);
                        $voiceHTML = file_get_contents(htmlPath . "uploadvoice.html");
                        $voiceHTML = str_replace("<php>MAX_VOICE_SIZE</php>", maxVoiceFileSize / 1000000, $voiceHTML);
                        $voiceHTML = str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], $voiceHTML));
                    }
                    else    {
                        $voiceHTML = "<div style=\"border:1px solid #00ff00;padding:1px;\"><img width=\"16\" height=\"16\" src=\"/images/microphone.svg\"> <string>voice</string>; <string>uploadcompleted</string></div>";
                    }*/
                    $filesHTML = file_get_contents(htmlPath . "uploadfiles.html");
                    $filesHTML = str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], $filesHTML));
                    $descriptionHTML = file_get_contents(htmlPath . "uploaddescription.html");
                    $descriptionHTML = str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], $descriptionHTML));
                    $descriptionHTML = str_replace("<php>MAX_DESCRIPTION_LENGTH</php>", maxDescriptionLength, $descriptionHTML);
                    //if(file_exists(descriptions . $_POST["n"] . "/0.txt"))    {
                        $descriptionHTML .= "<div style=\"border:1px solid #00ff00;padding:1px;\"><img width=\"16\" height=\"16\" src=\"/images/description.svg\"> <string>description</string>; <string>uploadcompleted</string></div>";
                    //}
                    define("maxVoiceFileSize", 25000000);
                    $voiceHTML = file_get_contents(htmlPath . "uploadvoice.html");
                    $voiceHTML = str_replace("<php>MAX_VOICE_SIZE</php>", maxVoiceFileSize / 1000000, $voiceHTML);
                    $voiceHTML = str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], $voiceHTML));
                    /*if(glob(voices . $_POST["n"] . "/0.*"))    {
                        $voiceHTML .= "<div style=\"border:1px solid #00ff00;padding:1px;\"><img width=\"16\" height=\"16\" src=\"/images/microphone.svg\"> <string>voice</string>; <string>uploadcompleted</string></div>";
                    }*/
                    if(isset($_POST["ps"])){
                        $psContent = file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/ps/index.php");
                        echo(str_replace("}label", "}label,.buttons", str_replace("</h1>", "</h1><div style=\"border:2px solid #00ff00;\">upload completed<br><a href=\"../?" . $_POST["n"] . "\">view upload</a></div>", substr($psContent, strpos($psContent, "<!DOCTYPE html>")))));
                        $filesHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $filesHTML);
                        $descriptionHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $descriptionHTML);
                        $voiceHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $voiceHTML);
                        echo '<div id="afterupload">' . setLanguage($filesHTML) . '<br>' . setLanguage($descriptionHTML) . '<br>' . setLanguage($voiceHTML) . '</div>';
                    }else{
                        if($lang != defaultLang)    {
                            $langget = "&lang=" . $lang;
                            $langinput = "<input type=\"hidden\" name=\"lang\" value=\"" . $lang . "\">";
                        }else{
                            $langget = "";
                            $langinput = "";
                        }
                        if(isset($_GET["noscript"])){
                            $noscript = "noscript";
                            $filesHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $filesHTML);
                            $descriptionHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $descriptionHTML);
                            $voiceHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $voiceHTML);
                        }else{
                            $noscript = "";
                        }
                        $html = "<div class=\"boxs texts\">";
                        $html .= "<div class=\"texts\">#: " . $_POST["n"] . "</div><div><label for=\"link" . $_POST["n"] . "\"><img width=\"16\" height=\"16\" src=\"images/link.svg\"><span class=\"link title\"><string>link</string></span></label><input type=\"text\" readonly value=\"" . getMainWebAddress() . "/?" . $_POST["n"] . "\" id=\"link" . $_POST["n"] . "\"></div><a href=\"?" . $_POST["n"] . $langget . "\" class=\"buttons afteruploadbuttons viewuploadsbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;<span><string>viewupload</string></span></a><a href=\"?" . $_POST["n"] . $langget . "\" target=\"_blank\" class=\"buttons afteruploadbuttons viewuploadsbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;<span><string>viewupload</string></span>&nbsp;<img width=\"32\" height=\"32\" src=\"images/newtab.svg\"></a><br><br>";
                        $html .= $filesHTML;
                        $html .= "<br><br>";
                        $html .= $descriptionHTML;
                        $html .= "<br><br>";
                        $html .= $voiceHTML;
                        $html .= "</div>";
                        $html = str_replace("<!--AFTER_UPLOAD-->", $html, str_replace("<!--UPLOAD_RESPONSE-->", "<div class=\"texts\" style=\"border:1px solid #00ff00;padding:1px;\"><string>uploadcompleted</string></div><br>", file_get_contents(htmlPath . "index" . $noscript . ".html")));
                        $html = str_replace("<htmllang>lang</htmllang>", $lang, $html);
                        $html = setLanguage($html);
                        $html = str_replace("<php>LANG</php>", $langget, $html);
                        $html = str_replace("<!--LANG-->", $langinput, $html);
                        echo $html;
                    }
                }
                else    {
                    echo("1");
                }
            }else{
                exit("-6");
            }
        }
        else if(isset($_POST["latitude"]) && isset($_POST["longitude"]) && is_numeric($_POST["latitude"]) && is_numeric($_POST["longitude"]))   {
            define("maxLocationStringLength", 100);
            $location = substr($_POST["latitude"], 0, maxLocationStringLength) . ", " . substr($_POST["longitude"], 0, maxLocationStringLength);
            function addLocationString($postname)    {
                $GLOBALS["location"] .= "; ";
                if(isset($_POST[$postname]) && is_numeric($_POST[$postname]))    {
                    $GLOBALS["location"] .= substr($_POST[$postname], 0, maxLocationStringLength);
                }
                else    {
                    $GLOBALS["location"] .= '-';
                }
            }
            addLocationString("altitude");
            addLocationString("accuracy");
            addLocationString("altitudeAccuracy");
            saveData(locations, locationtimes, $location);
            echo "1";
        }
        exit;
    }
?>