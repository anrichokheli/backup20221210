<?php
    /*echo "#: " . basename(getcwd());
    echo "<br><br>";
    echo "<a href=\"" . glob("f.*")[0] . "\" target=\"_blank\">view uploaded file</a>";
    echo "<br><br>";
    echo "<a href=\"../../\" target=\"_blank\">open main page</a>";*/
    if(!defined("upload"))define("upload", "../uploads/");
    define("uploadfiles", upload . "files/");
    define("uploadstrings", upload . "strings/");
    define("photovideos", uploadfiles . "photovideos/");
    define("photovideotimes", uploadstrings . "photovideotimes/");
    define("descriptiontimes", uploadstrings . "descriptiontimes/");
    define("descriptions", uploadstrings . "descriptions/");
    define("locations", uploadstrings . "locations/");
    define("locationtimes", uploadstrings . "locationtimes/");
    define("voices", uploadfiles . "voices/");
    define("voicetimes", uploadstrings . "voicetimes/");
    /*function echoString($dataPath, $timePath, $n)  {
        $localTimePath = $timePath . $n . ".txt";
        if(file_exists($localTimePath))    {
            $path = $dataPath . $n . ".txt";
            echo "<br><br>";
            echo "<a href=\"" . $path . "\" target=\"_blank\">" . basename($path) . "</a>";
            echo "<br><br>";
            echo date("Y-m-d H:i:s", file_get_contents($timePath . $n . ".txt"));
        }
    }
    function echoFile($filePath, $timePath, $n, $echoNotExists) {
        $path = glob($filePath . $n . ".*")[0];
        $fileExists = file_exists($path);
        if($fileExists || $echoNotExists)    {
            echo "<br><br>";
            if($fileExists)    {
                echo "<a href=\"" . $path . "\" target=\"_blank\">" . basename($path) . "</a>";
                echo "<br><br>";
                echo date("Y-m-d H:i:s", file_get_contents($timePath . $n . ".txt"));
            }
            else    {
                echo("not exists");
            }
        }
    }
    function getData($n, $a)  {
        echo "<div class=\"a\">";
        if($a)
            echo "<a href=\"view.php?n=" . $n . "\" target=\"_blank\">";
        echo "#: " . $n;
        if($a)
            echo "</a>";
        echoFile(photovideos, photovideotimes, $n, 1);
        echoString(descriptions, descriptiontimes, $n);
        echoString(locations, locationtimes, $n);
        echoFile(voices, voicetimes, $n, 0);
        //echo "<a href=\"../\" target=\"_blank\">open main page</a>";
        echo "</div>";
    }*/
    function setValue($name, $value, $html) {
        return str_replace("<php>" . $name . "</php>", $value, $html);
    }
    function getData($n, $rawData)  {
        $pvtimePath = photovideotimes . $n . ".txt";
        if(!file_exists($pvtimePath))    {
            if($rawData)    {
                return "0";
            }
            else    {
                echo "#: " . $n . "<br>not exists";
                return;
            }
        }
        if($rawData)    {
            $dataArray = array();
        }
        else    {
            $html = file_get_contents("html/view.html");
            $html = setValue("N", $n, $html);
            $html = setValue("LINK", $n . $GLOBALS["langget"], $html);
        }
        $path = glob(photovideos . $n . ".*")[0];
        if(file_exists($path))    {
            if($rawData)    {
                array_push($dataArray, $path, file_get_contents($pvtimePath));
            }
            else    {
                $fileType = explode("/", mime_content_type($path))[0];
                if($fileType == "image")    {
                    $tagName = "img";
                    $attributes = "";
                    $fileTypeTag = "<img width=\"16\" height=\"16\" src=\"images/photo.svg\"><string>photo</string>";
                }
                else/* if($fileType == "video")*/   {
                    $tagName = "video";
                    $attributes = " controls";
                    $fileTypeTag = "<img width=\"16\" height=\"16\" src=\"images/video.svg\"><string>video</string>";
                }
                $photovideoTag = "<" . $tagName . $attributes . " src=\"" . $path . "\"></" . $tagName . ">";
                $html = setValue("FILETYPE", $fileTypeTag, $html);
                $html = setValue("PHOTOVIDEO", $photovideoTag, $html);
                $html = setValue("FILEPATH", $path, $html);
                $html = setValue("PVTIME", date("Y-m-d H:i:s", file_get_contents($pvtimePath)), $html);
            }
            $locationPath = locations . $n . ".txt";
            if(file_exists($locationPath))    {
                $locationData = file_get_contents($locationPath);
                $locationTime = date("Y-m-d H:i:s", file_get_contents(locationtimes . $n . ".txt"));
            }
            else    {
                $locationData = "";
                $locationTime = "";
            }
            if($rawData)    {
                array_push($dataArray, $locationData, $locationTime);
            }
            else    {
                $locationArray = explode("; ", $locationData);
                $html = setValue("LATLONG", $locationArray[0], $html);
                $html = setValue("Z", $locationArray[1], $html);
                $html = setValue("ACCURACY", $locationArray[2], $html);
                $html = setValue("ACCURACYZ", $locationArray[3], $html);
                $html = setValue("LTIME", $locationTime, $html);
            }
            $descriptionPath = descriptions . $n . ".txt";
            if(file_exists($descriptionPath))    {
                $descriptionData = file_get_contents($descriptionPath);
                $descriptionTime = date("Y-m-d H:i:s", file_get_contents(descriptiontimes . $n . ".txt"));
                
            }
            else    {
                $descriptionData = "";
                $descriptionTime = "";
            }
            if($rawData)    {
                array_push($dataArray, $descriptionData, $descriptionTime);
            }
            else    {
                $html = setValue("DESCRIPTION", nl2br(htmlspecialchars($descriptionData)), $html);
                $html = setValue("DTIME", $descriptionTime, $html);
            }
            $vtimePath = voicetimes . $n . ".txt";
            $voicePath = "";
            if(file_exists($vtimePath))    {
                $voicePath = glob(voices . $n . ".*")[0];
                $voiceTime = date("Y-m-d H:i:s", file_get_contents(voicetimes . $n . ".txt"));
            }
            else    {
                $voiceTag = "";
                $voiceTime = "";
            }
            if($rawData)    {
                array_push($dataArray, $voicePath, $vtimePath);
            }
            else    {
                if(!empty($voicePath))    {
                    $voiceTag = "<audio controls src=\"" . $voicePath . "\"></audio>";
                }
                $html = setValue("VOICE", $voiceTag, $html);
                $html = setValue("VTIME", $voiceTime, $html);
            }
        }
        if($rawData)    {
            return json_encode($dataArray);
        }
        else    {
            return setLanguage($html);
        }
    }
    $rawData = isset($_GET["raw"]) && ($_GET["raw"] == 1);
    if(!$rawData)    {
        $topHTML = "<!DOCTYPE html><html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta charset=\"UTF-8\"><link rel=\"stylesheet\" href=\"styles/view.css\"><title><string>pedestrian</string> SOS!</title><link rel=\"icon\" href=\"images/pedestriansos_16.png\"></head>";
        $topHTML .= "<body><div id=\"main\"><div id=\"top\"><img width=\"64\" height=\"64\" src=\"images/pedestriansos.svg\"><h1><span id=\"pedestrian\"><string>pedestrian</string></span>&nbsp;<span id=\"sos\">SOS!</span></h1></div>";
        echo setLanguage($topHTML);
        if($lang != defaultLang){
            $langget = "&lang=" . $lang;
        }
        else{
            $langget = "";
        }
    }
    //echo "<style>.a{font-size:25px;border:solid 2px #0000ff;border-radius:4px;padding:1%;margin:1%;width:90%;text-align:center;}</style>";
    if(isset($_GET["n"]) && ctype_digit($_GET["n"]))    {
        /*if(!ctype_digit($n))    {
            exit("parameter is not id");
        }*/
        //echo getData($_GET["n"], 0);
        echo getData($_GET["n"], $rawData);
    }
    else    {
        //$filesQuantity = count(scandir(photovideos)) - 2;
        /*for ($i = 0; $i < $filesQuantity; $i++) {
            echo getData($i, 1);
        }
        for ($i = $filesQuantity - 1; $i >= 0; $i--) {
            //echo getData($i, 1);
            echo getData($i);
        }*/
        $files = array_slice(scandir(photovideotimes), 2);
        for($i = 0; $i < count($files); $i++)   {
            $files[$i] = str_replace(".txt", "", $files[$i]);
        }
        if(!$rawData)    {
            define("maxQuantity", 10);
            rsort($files);
            if(isset($_GET["t"]) && ctype_digit($_GET["t"]))    {
                $topN = $_GET["t"];
                $files = array_slice($files, array_search($topN, $files));
            }
            else    {
                $topN = $files[0];
            }
            $page = 0;
            if(isset($_GET["p"]) && ctype_digit($_GET["p"]))    {
                $page = $_GET["p"];
            }
            $files = array_slice($files, maxQuantity * $page, maxQuantity);
        }
        foreach($files as $n)    {
            echo getData($n, $rawData);
        }
        if(!$rawData && (count($files) == maxQuantity))    {
            echo "<a href=\"?view&p=" . ($page + 1) . "&t=" . $topN . $langget . "\">>><br>" . $langJSON["next"] . "</a><br>";
        }
    }
    if(!$rawData)    {
        echo "</div></body></html>";
    }
?>