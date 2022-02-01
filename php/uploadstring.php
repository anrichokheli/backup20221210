<?php
    if(isset($_POST["n"]) && isset($_POST["key"])
    &&
    ctype_digit($_POST["n"]) && ctype_digit($_POST["key"])/* && ctype_digit($_POST["string"]) && ctype_digit($_POST["type"])*/
    &&
    (isset($_POST["description"]) || (isset($_POST["latitude"]) && isset($_POST["longitude"])))
    )    {
        define("protectedPrivateKeysPath", dirname($_SERVER["DOCUMENT_ROOT"]) . "/protected/private/keys/");
        if(!defined("upload"))define("upload", "../uploads/");
        define("uploadstrings", upload . "strings/");
        define("descriptions", uploadstrings . "descriptions/");
        define("descriptiontimes", uploadstrings . "descriptiontimes/");
        define("locations", uploadstrings . "locations/");
        define("locationtimes", uploadstrings . "locationtimes/");
        $keyPath = protectedPrivateKeysPath . $_POST["n"];
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
                //echo str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], file_get_contents("../html/uploadvoice.html")));
                $html = "<div class=\"boxs texts\">";
                $html .= "<div class=\"texts\">#: " . $_POST["n"] . "</div><a href=\"../?" . $_POST["n"] . "\" target=\"_blank\" class=\"buttons afteruploadbuttons texts\"><img width=\"32\" height=\"32\" src=\"../images/viewicon.svg\">&nbsp;view upload</a><br>";
                if(!file_exists(descriptions . $_POST["n"] . ".txt"))    {
                    $html .= str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], file_get_contents("../html/uploaddescription.html")));
                }
                else    {
                    $html .= "description uploaded";
                }
                $html .= "<br><br>";
                if(!file_exists(glob("../uploads/files/voices/" . $_POST["n"] . ".*")[0]))    {
                    $html .= str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], file_get_contents("../html/uploadvoice.html")));
                }
                else    {
                    $html .= "voice uploaded";
                }
                $html .= "</div>";
                $html = str_replace("<!--AFTER_UPLOAD-->", $html, str_replace("<!--UPLOAD_RESPONSE-->", "<div class=\"texts\" style=\"border:1px solid #00ff00;padding:1px;\"><string>uploadcompleted</string></div><br>", file_get_contents("../html/indexnoscript.html")));
                $html = str_replace("<htmllang>lang</htmllang>", $language, $html);
                $html = setLanguage($language, $html);
                if($language != defaultlanguage)    {
                    $html = str_replace("action=\"../noscript/\"", "action=\"../noscript/?lang=" . $language . "\"", $html);
                }
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