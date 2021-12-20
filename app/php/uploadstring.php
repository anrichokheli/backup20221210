<?php
    if(isset($_POST["n"]) && isset($_POST["key"])
    &&
    ctype_digit($_POST["n"]) && ctype_digit($_POST["key"])/* && ctype_digit($_POST["string"]) && ctype_digit($_POST["type"])*/
    )    {
        define("protectedPrivateKeysPath", dirname($_SERVER["DOCUMENT_ROOT"]) . "/protected/private/keys/");
        define("upload", "../uploads/");
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
                echo str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], file_get_contents("../html/uploadvoice.html")));
            }
            else    {
                echo("1");
            }
        }
        else if(isset($_POST["latitude"]) && isset($_POST["longitude"]) && is_numeric($_POST["latitude"]) && is_numeric($_POST["longitude"]))   {
            $location = $_POST["latitude"] . ", " . $_POST["longitude"];
            function addLocationString($postname)    {
                $GLOBALS["location"] .= "; ";
                if($_POST[$postname] && is_numeric($_POST[$postname]))    {
                    $GLOBALS["location"] .= $_POST[$postname];
                }
                else    {
                    $GLOBALS["location"] .= '-';
                }
            }
            addLocationString("altitude");
            addLocationString("accuracy");
            saveData(locations, locationtimes, $location);
            echo "1";
        }
    }
    else    {
        exit("0");
    }
?>