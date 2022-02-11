<?php
    if(isset($_POST["n"]) && isset($_POST["key"])
    &&
    ctype_digit($_POST["n"]) && ctype_digit($_POST["key"])/* && ctype_digit($_POST["string"]) && ctype_digit($_POST["type"])*/
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
        $keyPath = keysPath . $_POST["n"];
        if(!file_exists($keyPath))    {
            exit("-1");
        }
        function saveData($dataPath, $timePath, $string)  {
            $path = $dataPath . $_POST["n"] . ".txt";
            if(file_exists($path))    {
                exit("-3");
            }
            if(!password_verify($_POST["key"], file_get_contents($GLOBALS["keyPath"])))    {
                exit("-4");
            }
            if(file_put_contents($path, $string))   {
                file_put_contents($timePath . $_POST["n"] . ".txt", time());
            }
        }
        if(isset($_POST["description"]))    {
            saveData(descriptions, descriptiontimes, $_POST["description"]);
            if(isset($_POST["submit"]))    {
                if($lang != defaultLang)    {
                    $langget = "&lang=" . $lang;
                    $langinput = "<input type=\"hidden\" name=\"lang\" value=\"" . $lang . "\">";
                }else{
                    $langget = "";
                    $langinput = "";
                }
                $descriptionHTML = file_get_contents(htmlPath . "uploaddescription.html");
                $voiceHTML = file_get_contents(htmlPath . "uploadvoice.html");
                if(isset($_GET["noscript"])){
                    $noscript = "noscript";
                    $descriptionHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $descriptionHTML);
                    $voiceHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $voiceHTML);
                }else{
                    $noscript = "";
                }
                $html = "<div class=\"boxs texts\">";
                $html .= "<div class=\"texts\">#: " . $_POST["n"] . "</div><a href=\"?" . $_POST["n"] . $langget . "\" target=\"_blank\" class=\"buttons afteruploadbuttons viewuploadsbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;<span><string>viewupload</string></span></a><br><br>";
                if(!file_exists(descriptions . $_POST["n"] . ".txt"))    {
                    $html .= str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], $descriptionHTML));
                }
                else    {
                    $html .= "<div style=\"border:1px solid #00ff00;padding:1px;\"><img width=\"16\" height=\"16\" src=\"images/description.svg\"> <string>description</string>; <string>uploadcompleted</string></div>";
                }
                $html .= "<br><br>";
                if(!file_exists(glob("uploads/files/voices/" . $_POST["n"] . ".*")[0]))    {
                    $html .= str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], $voiceHTML));
                }
                else    {
                    $html .= "<div style=\"border:1px solid #00ff00;padding:1px;\"><img width=\"16\" height=\"16\" src=\"images/microphone.svg\"> <string>voice</string>; <string>uploadcompleted</string></div>";
                }
                $html .= "</div>";
                $html = str_replace("<!--AFTER_UPLOAD-->", $html, str_replace("<!--UPLOAD_RESPONSE-->", "<div class=\"texts\" style=\"border:1px solid #00ff00;padding:1px;\"><string>uploadcompleted</string></div><br>", file_get_contents(htmlPath . "index" . $noscript . ".html")));
                $html = str_replace("<htmllang>lang</htmllang>", $lang, $html);
                $html = setLanguage($html);
                $html = str_replace("<php>LANG</php>", $langget, $html);
                $html = str_replace("<!--LANG-->", $langinput, $html);
                echo $html;
            }
            else    {
                echo("1");
            }
        }
        else if(isset($_POST["latitude"]) && isset($_POST["longitude"]) && is_numeric($_POST["latitude"]) && is_numeric($_POST["longitude"]))   {
            $location = $_POST["latitude"] . ", " . $_POST["longitude"];
            function addLocationString($postname)    {
                $GLOBALS["location"] .= "; ";
                if(isset($_POST[$postname]) && is_numeric($_POST[$postname]))    {
                    $GLOBALS["location"] .= $_POST[$postname];
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