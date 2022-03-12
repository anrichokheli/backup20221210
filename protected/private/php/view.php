<?php
    /*echo "#: " . basename(getcwd());
    echo "<br><br>";
    echo "<a href=\"" . glob("f.*")[0] . "\" target=\"_blank\">view uploaded file</a>";
    echo "<br><br>";
    echo "<a href=\"../../\" target=\"_blank\">open main page</a>";*/
    define("upload", protectedPublicPath . "uploads/");
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
    if(isset($_GET["v"])){
        $path = realpath(protectedPublicPath . $_GET["v"]);
        if(strpos($path, realpath(protectedPublicPath)) === 0){
            if(is_file($path)){
                header("Content-Type: " . mime_content_type($path));
                echo file_get_contents($path);
            }else{
                foreach(scandir($path) as $link){
                    echo "<a href=\"?view&v=" . $_GET["v"] . "/" . $link . "\">" . $link . "</a><br>";
                }
            }
            exit;
        }
    }
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
    if(isset($_COOKIE["timezone"])){
        date_default_timezone_set("Etc/GMT" . ($_COOKIE["timezone"] / 60));
    }
    function getT($t){
        return date("Y-m-d H:i:s", $t) . "<br><div>" . date('O') . "<br>" . $t . "</div>";
    }
    function getData($n, $rawData)  {
        //$pvtimePath = photovideotimes . $n . ".txt";
        $dirpvtimePath = photovideotimes . $n;
        if(!file_exists($dirpvtimePath))    {
            if($rawData)    {
                return "0";
            }
            else    {
                echo "<br>#: " . $n . "<br>not exists<br>";
                return;
            }
        }
        if($rawData)    {
            $dataArray = array();
        }
        else    {
            $html = file_get_contents(htmlPath . "view.html");
            $html = setValue("N", $n, $html);
            $html = setValue("LINK", $n . $GLOBALS["langget"], $html);
        }
        //$path = glob(photovideos . $n . ".*")[0];
        $dirpath = photovideos . $n;
        if(file_exists($dirpath))    {
            $dirFiles = array_slice(scandir($dirpath), 2);
            $timeFiles = array_slice(scandir($dirpvtimePath), 2);
            $dirPublicPath = "?view&v=uploads/files/photovideos/" . basename($dirpath) . "/";
            $dirFilesQuantity = count($dirFiles);
            if($rawData)    {
                $filePaths = array();
                $timeDatas = array();
                for($i = 0; $i < $dirFilesQuantity; $i++){
                    array_push($filePaths, $dirPublicPath . $dirFiles[$i]);
                    array_push($timeDatas, file_get_contents(photovideotimes . $n . "/" . $timeFiles[$i]));
                }
                array_push($dataArray, $filePaths, $timeDatas);
            }else{
                $photovideoHTML = "";
                for($i = 0; $i < $dirFilesQuantity; $i++){
                    $path = $dirPublicPath . $dirFiles[$i];
                    $fileType = explode("/", mime_content_type($dirpath . "/" . $dirFiles[$i]))[0];
                    if($fileType == "image")    {
                        $tagName = "img";
                        $attributes = "";
                        $fileTypeTag = "<img width=\"16\" height=\"16\" src=\"images/photo.svg\"><span class=\"photo\"><string>photo</string></span>";
                    }
                    else   {
                        $tagName = "video";
                        $attributes = " controls";
                        $fileTypeTag = "<img width=\"16\" height=\"16\" src=\"images/video.svg\"><span class=\"video\"><string>video</string></span>";
                    }
                    $photovideoTag = "<" . $tagName . $attributes . " src=\"" . $path . "\"></" . $tagName . ">";
                    if(isset($_GET["all"]) || $dirFilesQuantity <= 2 || $i == 0){
                        $photovideoHTML .= '
                            <div class="filetype">' . $fileTypeTag . '</div>
                            <br>
                            <div class="photovideo">' . $photovideoTag . '</div>
                            <br>
                            <div class="buttonsdivs">
                                <a target="_blank" href="' . $path . '" class="buttons"><img width="32" height="32" src="images/open.svg"><span class="open"><string>open</string></span></a>
                                <a target="_blank" href="' . $path . '" download="' . $n . "_" . $i . '" class="buttons"><img width="32" height="32" src="images/download.svg"><span class="download"><string>download</string></span></a>
                            </div>
                            <br>
                            <div class="pvtime">' . getT(file_get_contents(photovideotimes . $n . "/" . $timeFiles[$i])) . '</div>
                        ';
                        if($dirFilesQuantity - $i != 1){
                            $photovideoHTML .= "<hr>";
                        }
                    }else{
                        if($dirFilesQuantity == 2 || $i == 0){
                            $photovideoHTML .= '<div class="photovideo">' . $photovideoTag . '</div>';
                        }else if($i == 1){
                            $photovideoHTML .= '<div class="photovideo pvoverlay0" style="border-style:solid;">' . $photovideoTag . '<a href="?' . $n . '&all" target="_blank" class="pvoverlay">+' . ($dirFilesQuantity - 1) . '</a></div>';
                        }else{
                            break;
                        }
                    }
                }
                $html = setValue("PHOTOVIDEO", $photovideoHTML, $html);
            }
            $locationPath = locations . $n . ".txt";
            if(file_exists($locationPath))    {
                $locationData = file_get_contents($locationPath);
                $locationTime = getT(file_get_contents(locationtimes . $n . ".txt"));
            }
            else    {
                $locationData = "-; -; -; -";
                $locationTime = "";
            }
            if($rawData)    {
                array_push($dataArray, $locationData, $locationTime);
            }
            else    {
                $locationArray = explode("; ", $locationData);
                for($i = 0; $i < count($locationArray); $i++){
                    if($locationArray[$i] == "-"){
                        $locationArray[$i] = "<span style=\"background-color:#ff000080;\" class=\"nodata\"><string>nodata</string></span>";
                    }
                }
                if(strpos($locationArray[0], ", ") !== FALSE){
                    $latlongarray = explode(", ", $locationArray[0]);
                    $latitude = $latlongarray[0];
                    $longitude = $latlongarray[1];
                    $maps = '
                        <div class="boxs">
                            <div>
                                <img width="32" height="32" src="images/maps.svg">
                                <span class="maps"><string>maps</string></span>
                            </div>
                            <hr>
                            <a target="_blank" href="https://www.bing.com/maps?where1=' . $latitude . ',' . $longitude . '" class="buttons"><img width="32" height="32" src="images/maps/bingmaps.ico"><span>Bing Maps</span></a>
                            <a target="_blank" href="https://www.google.com/maps/place/' . $latitude . ',' . $longitude . '" class="buttons"><img width="32" height="32" src="images/maps/googlemaps.ico"><span>Google Maps</span></a>
                            <a target="_blank" href="https://www.openstreetmap.org/?mlat=' . $latitude . '&mlon=' . $longitude . '" class="buttons"><img width="32" height="32" src="images/maps/openstreetmap.png"><span>OpenStreetMap</span></a>
                        </div>
                    ';
                    $html = str_replace("<!--MAPS-->", $maps, $html);
                }
                $html = setValue("LATLONG", $locationArray[0], $html);
                $html = setValue("Z", $locationArray[1], $html);
                $html = setValue("ACCURACY", $locationArray[2], $html);
                $html = setValue("ACCURACYZ", $locationArray[3], $html);
                $html = setValue("LTIME", $locationTime, $html);
            }
            $descriptionPath = descriptions . $n . ".txt";
            if(file_exists($descriptionPath))    {
                $descriptionData = nl2br(htmlspecialchars(file_get_contents($descriptionPath)));
                $descriptionTime = getT(file_get_contents(descriptiontimes . $n . ".txt"));
                
            }
            else    {
                $descriptionData = "<span style=\"background-color:#ff000080;\" class=\"nodata\"><string>nodata</string></span>";
                $descriptionTime = "";
            }
            if($rawData)    {
                array_push($dataArray, $descriptionData, $descriptionTime);
            }
            else    {
                $html = setValue("DESCRIPTION", $descriptionData, $html);
                $html = setValue("DTIME", $descriptionTime, $html);
            }
            $vtimePath = voicetimes . $n . ".txt";
            $voicePath = "";
            if(file_exists($vtimePath))    {
                $voicePath = glob(voices . $n . ".*")[0];
                $voicePublicPath = "?view&v=uploads/files/voices/" . basename($voicePath);
                $voiceTime = getT(file_get_contents(voicetimes . $n . ".txt"));
            }
            else    {
                $voiceTag = "<span style=\"background-color:#ff000080;\" class=\"nodata\"><string>nodata</string></span>";
                $voiceTime = "";
                $voicePublicPath = "";
            }
            if($rawData)    {
                array_push($dataArray, $voicePublicPath, $voiceTime);
            }
            else    {
                if(!empty($voicePath))    {
                    $voiceTag = "<audio controls src=\"" . $voicePublicPath . "\"></audio>";
                    $voiceDownload = "<a target=\"_blank\" href=\"" . $voicePublicPath . "\" download=\"" . $n . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/download.svg\"><span class=\"download\"><string>download</string></span></a>";
                }else{
                    $voiceDownload = "";
                }
                $html = setValue("VOICE", $voiceTag, $html);
                $html = setValue("VDOWNLOAD", $voiceDownload, $html);
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
        $topHTML = "<!DOCTYPE html><html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta charset=\"UTF-8\"><link rel=\"stylesheet\" href=\"styles/view.css\"><title><string>pedestrian</string> SOS!</title></head>";
        $topHTML .= "<body><div id=\"main\"><div id=\"top\"><img width=\"64\" height=\"64\" src=\"images/pedestriansos.svg\"> <h1><span class=\"pedestrian\"><string>pedestrian</string></span>&nbsp;<span id=\"sos\">SOS!</span></h1></div>";
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
        if(/*!file_exists(photovideotimes)*/count(scandir(photovideotimes)) == 2){
            exit("<br>" . $langJSON["nodata"]);
        }
        //$filesQuantity = count(scandir(photovideos)) - 2;
        /*for ($i = 0; $i < $filesQuantity; $i++) {
            echo getData($i, 1);
        }
        for ($i = $filesQuantity - 1; $i >= 0; $i--) {
            //echo getData($i, 1);
            echo getData($i);
        }*/
        $files = array_slice(scandir(photovideotimes), 2);
        // for($i = 0; $i < count($files); $i++)   {
        //     $files[$i] = str_replace(".txt", "", $files[$i]);
        // }
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
            echo "<a href=\"?view&p=" . ($page + 1) . "&t=" . $topN . $langget . "\" class=\"buttons\" id=\"nextbutton\"><span style=\"color:#256aff;font-size:32px;\">>></span> <span class=\"next\">" . $langJSON["next"] . "</span></a><br><br>";
        }
    }
    if(!$rawData)    {
        echo "</div><script src=\"scripts/view.js\"></script></body></html>";
    }
?>