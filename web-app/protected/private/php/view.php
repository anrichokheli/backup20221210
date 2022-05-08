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
                $mimeContentType = mime_content_type($path);
                if((strpos($mimeContentType, "image/") === FALSE) && (strpos($mimeContentType, "video/") === FALSE) && (strpos($mimeContentType, "audio/") === FALSE)){
                    header("X-Frame-Options: DENY");
                }
                header("Content-Type: " . $mimeContentType);
                header("Content-Length: " . filesize($path));
                if(strpos($path, "descriptions") !== FALSE){
                    echo htmlspecialchars(file_get_contents($path));
                }else{
                    echo file_get_contents($path);
                }
            }else{
                header("X-Frame-Options: DENY");
                foreach(scandir($path) as $link){
                    echo "<a href=\"?view&v=" . $_GET["v"] . "/" . $link . "\">" . $link . "</a><br>";
                }
            }
            exit;
        }
    }
    header("X-Frame-Options: DENY");
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
    function setTimezone($timezone, $invert){
        if(ctype_digit($timezone)){
            $timezone = "+" . $timezone;
        }
        $timezonesign = substr($timezone, 0, 1);
        if($invert){
            if($timezonesign == "+"){
                $timezonesign = "-";
            }else if($timezonesign == "-"){
                $timezonesign = "+";
            }
        }
        $timezonenum = substr($timezone, 1);
        if(($timezonesign == "+") || ($timezonesign == "-") && (ctype_digit($timezonenum))){
            if(!$invert){
                $timezonenum /= 60;
            }
            $timezonenum = round($timezonenum);
            if($timezonesign == "-"){
                $maxGMT = 14;
            }else if($timezonesign == "+"){
                $maxGMT = 12;
            }
            if($timezonenum > $maxGMT){
                $timezonenum = $maxGMT;
            }
            date_default_timezone_set("Etc/GMT" . $timezonesign . $timezonenum);
        }
    }
    $rawData = isset($_GET["raw"]) && ($_GET["raw"] == 1);
    if(!$rawData){
        if(!empty($_COOKIE["settingstimezone"])){
            setTimezone($_COOKIE["settingstimezone"], 1);
        }else if(!empty($_COOKIE["timezone"])){
            setTimezone($_COOKIE["timezone"], 0);
        }
    }
    function getT($t){
        if($GLOBALS["rawData"]){
            return $t;
        }else{
            $datetime = date("Y-m-d H:i:s", $t);
            $timezone = date('O');
            return $datetime . "<br><div>" . $timezone . "<br>" . $t . "</div>";
        }
    }
    function getMainWebAddress(){
        if(isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] === "on"){
            $protocol = "https";
        }else{
            $protocol = "http";
        }
        return $protocol . "://" . $_SERVER["HTTP_HOST"];
    }
    define("textLengthDisplay", 100);
    define("textNewlineDisplay", 4);
    function getNoData(){
        return "<span style=\"background-color:#ff000080;\" class=\"nodata\"><string>nodata</string></span>";
    }
    function getData($n, $rawData)  {
        //$pvtimePath = photovideotimes . $n . ".txt";
        $dirpvtimePath = photovideotimes . $n;
        if(!file_exists($dirpvtimePath))    {
            if($rawData)    {
                return "0";
            }
            else    {
                echo "<br>#: " . $n . "<br>" . getNoData() . "<br>";
                return;
            }
        }
        if($rawData)    {
            $dataArray = [$n];
        }
        else    {
            $html = file_get_contents(htmlPath . "view.html");
            $html = setValue("N", $n, $html);
            $html = setValue("LINK", $n . $GLOBALS["langget"], $html);
            $html = setValue("FULLLINK", getMainWebAddress() . "/?" . $n, $html);
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
                $fileTypes = [];
                for($i = 0; $i < $dirFilesQuantity; $i++){
                    array_push($filePaths, $dirPublicPath . $dirFiles[$i]);
                    array_push($timeDatas, file_get_contents(photovideotimes . $n . "/" . $timeFiles[$i]));
                    array_push($fileTypes, explode("/", mime_content_type($dirpath . "/" . $dirFiles[$i]))[0]);
                }
                array_push($dataArray, $filePaths, $timeDatas, $fileTypes);
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
                                <a href="' . $path . '" class="buttons"><img width="32" height="32" src="images/open.svg"> <span class="open"><string>open</string></span></a>
                                <a target="_blank" href="' . $path . '" class="buttons"><img width="32" height="32" src="images/newtab.svg"></a>
                                <a target="_blank" href="' . $path . '" download="' . $n . "_" . $i . '" class="buttons"><img width="32" height="32" src="images/download.svg"> <span class="download"><string>download</string></span></a>
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
                            $photovideoHTML .= '<div class="photovideo pvoverlay0" style="border-style:solid;">' . $photovideoTag . '<a href="?' . $n . '&all" class="pvoverlay">+' . ($dirFilesQuantity - 1) . '</a></div>';
                            $photovideoHTML .= '<a target="_blank" href="?' . $n . '&all" class="buttons"><img width="32" height="32" src="images/open.svg"> <span class="open"><string>open</string></span> <img width="32" height="32" src="images/newtab.svg"></a>';
                        }else{
                            break;
                        }
                    }
                }
                $html = setValue("PHOTOVIDEO", $photovideoHTML, $html);
            }
            $locationPath = locations . $n . "/";
            if(file_exists($locationPath))    {
                $locationPath .= scandir($locationPath)[2];
                $locationData = file_get_contents($locationPath);
                $locationTime = getT(file_get_contents(locationtimes . $n . "/" . scandir(locationtimes . $n)[2]));
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
                        $locationArray[$i] = getNoData();
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
                                <span class="maps title"><string>maps</string></span>
                            </div>
                            <br>
                            <div>
                                <a target="_blank" href="https://www.bing.com/maps?where1=' . $latitude . ',' . $longitude . '" class="buttons"><img width="32" height="32" src="images/maps/bingmaps.ico"> <span>Bing Maps</span> <img width="32" height="32" src="images/newtab.svg"> <img width="32" height="32" src="images/leaving.svg"></a>
                                <a target="_blank" href="https://www.google.com/maps/place/' . $latitude . ',' . $longitude . '" class="buttons"><img width="32" height="32" src="images/maps/googlemaps.ico"> <span>Google Maps</span> <img width="32" height="32" src="images/newtab.svg"> <img width="32" height="32" src="images/leaving.svg"></a>
                                <a target="_blank" href="https://www.openstreetmap.org/?mlat=' . $latitude . '&mlon=' . $longitude . '" class="buttons"><img width="32" height="32" src="images/maps/openstreetmap.png"> <span>OpenStreetMap</span> <img width="32" height="32" src="images/newtab.svg"> <img width="32" height="32" src="images/leaving.svg"></a>
                            </div>
                        </div>
                    ';
                    $html = str_replace("<!--MAPS-->", $maps, $html);
                }
                if(!empty($locationTime))    {
                    $locationPublicPath = "?view&v=uploads/strings/locations/" . $n . "/" . basename($locationPath);
                    $locationButtons = "<div class=\"buttonsdivs\">";
                    $locationButtons .= "<a href=\"" . $locationPublicPath . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/newtab.svg\"> <span class=\"open\"><string>open</string></span></a>";
                    $locationButtons .= "<a target=\"_blank\" href=\"" . $locationPublicPath . "\" class=\"buttons\"> <img width=\"32\" height=\"32\" src=\"images/newtab.svg\"></a>";
                    $locationButtons .= "<a href=\"" . $locationPublicPath . "\" download=\"" . $n . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/download.svg\"><span class=\"download\"><string>download</string></span></a>";
                    $locationButtons .= "</div>";
                }else{
                    $locationButtons = "";
                }
                $html = setValue("LATLONG", $locationArray[0], $html);
                $html = setValue("Z", $locationArray[1], $html);
                $html = setValue("ACCURACY", $locationArray[2], $html);
                $html = setValue("ACCURACYZ", $locationArray[3], $html);
                $html = setValue("LTIME", $locationTime, $html);
                $html = setValue("LBUTTONS", $locationButtons, $html);
            }
            $descriptionPath = descriptions . $n . "/";
            if(file_exists($descriptionPath))    {
                $descriptionPath .= scandir($descriptionPath)[2];
                $descriptionData = htmlspecialchars(file_get_contents($descriptionPath));
                if(!$rawData){
                    if((substr_count($descriptionData, "\n") + 1) > textNewlineDisplay){
                        $lastPos = 0;
                        for($i = 0; $i < textNewlineDisplay; $i++){
                            $lastPos = strpos($descriptionData, "\n", $lastPos);
                            $lastPos++;
                        }
                        $moreTextIndex = $lastPos;
                    }
                    else if(strlen($descriptionData) > textLengthDisplay){
                        $moreTextIndex = textLengthDisplay;
                    }
                    if(isset($moreTextIndex)){
                        $descriptionData = substr_replace($descriptionData, "<span id=\"moretext" . $n . "\" class=\"moretext\" style=\"display:inline;vertical-align:initial;\">", $moreTextIndex, 0) . "</span><button id=\"seemore" . $n . "\" class=\"seemore\" style=\"display:none;\">...>></button>";
                    }
                }
                $descriptionTime = getT(file_get_contents(descriptiontimes . $n . "/" . scandir(descriptiontimes . $n)[2]));
                
            }
            else    {
                if($rawData){
                    $descriptionData = "";
                }else{
                    $descriptionData = getNoData();
                }
                $descriptionTime = "";
            }
            if($rawData)    {
                array_push($dataArray, $descriptionData, $descriptionTime);
            }
            else    {
                if(!empty($descriptionTime))    {
                    $descriptionPublicPath = "?view&v=uploads/strings/descriptions/" . $n . "/" . basename($descriptionPath);
                    $descriptionButtons = "<div class=\"buttonsdivs\">";
                    $descriptionButtons .= "<a href=\"" . $descriptionPublicPath . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/newtab.svg\"> <span class=\"open\"><string>open</string></span></a>";
                    $descriptionButtons .= "<a target=\"_blank\" href=\"" . $descriptionPublicPath . "\" class=\"buttons\"> <img width=\"32\" height=\"32\" src=\"images/newtab.svg\"></a>";
                    $descriptionButtons .= "<a href=\"" . $descriptionPublicPath . "\" download=\"" . $n . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/download.svg\"><span class=\"download\"><string>download</string></span></a>";
                    $descriptionButtons .= "</div>";
                }else{
                    $descriptionButtons = "";
                }
                $html = setValue("DESCRIPTION", $descriptionData, $html);
                $html = setValue("DBUTTONS", $descriptionButtons, $html);
                $html = setValue("DTIME", $descriptionTime, $html);
            }
            $vtimePath = voicetimes . $n . "/";
            $voicePath = "";
            if(file_exists($vtimePath))    {
                $vtimePath .= scandir($vtimePath)[2];
                //$voicePath = glob(voices . $n . "/0.*")[0];
                $voicePath = voices . $n . "/";
                $voicePath .= scandir($voicePath)[2];
                $voicePublicPath = "?view&v=uploads/files/voices/" . $n . "/" . basename($voicePath);
                $voiceTime = getT(file_get_contents(voicetimes . $n . "/" . scandir(voicetimes . $n)[2]));
            }
            else    {
                $voiceTag = getNoData();
                $voiceTime = "";
                $voicePublicPath = "";
            }
            if($rawData)    {
                array_push($dataArray, $voicePublicPath, $voiceTime);
            }
            else    {
                if(!empty($voicePath))    {
                    $voiceTag = "<audio controls src=\"" . $voicePublicPath . "\"></audio>";
                    $voiceButtons = "<div class=\"buttonsdivs\">";
                    $voiceButtons .= "<a href=\"" . $voicePublicPath . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/open.svg\"> <span class=\"open\"><string>open</string></span></a>";
                    $voiceButtons .= "<a target=\"_blank\" href=\"" . $voicePublicPath . "\" class=\"buttons\"> <img width=\"32\" height=\"32\" src=\"images/newtab.svg\"></a>";
                    $voiceButtons .= "<a href=\"" . $voicePublicPath . "\" download=\"" . $n . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/download.svg\"><span class=\"download\"><string>download</string></span></a>";
                    $voiceButtons .= "</div>";
                }else{
                    $voiceButtons = "";
                }
                $html = setValue("VOICE", $voiceTag, $html);
                $html = setValue("VBUTTONS", $voiceButtons, $html);
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
    $ajax = isset($_GET["ajax"]) && ($_GET["ajax"] == 1);
    if(!$rawData && !$ajax)    {
        $topHTML = "<!DOCTYPE html><html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta charset=\"UTF-8\"><link rel=\"stylesheet\" href=\"styles/view.css\"><title><string>pedestrian</string> SOS!</title></head>";
        $topHTML .= "<body><div id=\"main\"><div id=\"top\"><a href=\"/\" style=\"text-decoration: none;\"><img width=\"64\" height=\"64\" src=\"images/pedestriansos.svg\"> <h1><span class=\"pedestrian\"><string>pedestrian</string></span>&nbsp;<span id=\"sos\">SOS!</span></h1></a></div>";
        echo setLanguage($topHTML);
    }
    if(!$rawData){
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
        if(!$rawData && !$ajax){
            echo '<a href="?view&v=uploads/">..uploads/</a><br>';
        }
        if(/*!file_exists(photovideotimes)*/count(scandir(photovideotimes)) == 2){
            if($rawData){
                echo "0";
            }else{
                echo("<br><br>" . getNoData());
            }
        }else{
            /*$files0 = array_slice(scandir(photovideotimes), 2);
            $filestimes = [];
            foreach($files0 as $file){
                array_push($filestimes, file_get_contents(photovideotimes . $file . "/0.txt"));
            }
            $filestimes0 = $filestimes;
            arsort($filestimes);
            $files = [];
            foreach($filestimes as $filetime){
                $index = array_search($filetime, $filestimes0);
                array_push($files, $files0[$index]);
                unset($filestimes0[$index]);
            }*/
            //$files = array_slice(scandir(photovideotimes), 2);
            //$files = array_reverse($files);
            $files = array_slice(scandir(photovideotimes, 1), 0, -2);
            if(!$rawData || ($rawData && ((isset($_GET["t"]) && ctype_digit($_GET["t"])) || (isset($_GET["p"]) && ctype_digit($_GET["p"])))))    {
                define("maxQuantity", 10);
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
            if(!$rawData){
                echo '<div id="content">';
            }
            $filesQuantity = count($files);
            for($i = 0; $i < $filesQuantity; $i++)    {
                echo getData($files[$i], $rawData);
                if($rawData && ($i < ($filesQuantity - 1))){
                    echo ">";
                }
            }
            if(!$rawData){
                echo '</div>';
            }
            if(!$rawData)    {
                $nextAvailable = (count($files) == maxQuantity);
                if($nextAvailable){
                    echo '<br><button class="buttons" id="viewmore" onclick="viewMore(this)" page="' . ($page + 1) . '" topn="' . $topN . '"><img width="32" height="32" src="images/viewmore.svg"> <span class="viewmore">' . $langJSON["viewmore"] . '</span></button><br>';
                }
                if(!$ajax){
                    //if($nextAvailable){
                        echo '<div id="newcontent"></div><div class="loader" id="loader"></div><br><div id="loaderror"></div>';
                    //}
                    if($page){
                        echo "<a href=\"?view&p=" . ($page - 1) . "&t=" . $topN . $langget . "\" class=\"buttons\"><span style=\"color:#256aff;font-size:32px;\"><<</span> <span class=\"previous\">" . $langJSON["previous"] . "</span></a>";
                    }
                    if($nextAvailable){
                        echo "<a href=\"?view&p=" . ($page + 1) . "&t=" . $topN . $langget . "\" class=\"buttons\"><span style=\"color:#256aff;font-size:32px;\">>></span> <span class=\"next\">" . $langJSON["next"] . "</span></a>";   
                    }
                    if(isset($_GET["t"]) && ctype_digit($_GET["t"])){
                        echo '<br>' . getT(file_get_contents(photovideotimes . $_GET["t"] . "/0.txt"));
                        echo '<br><a href="?view" class="buttons"><img width="32" height="32" src="images/viewicon.svg"> <span class="viewnewest">' . $langJSON["viewnewest"] . '</span></a>';
                    }
                }
            }
        }
    }
    if(!$rawData && !$ajax)    {
        echo "<br><br></div><script src=\"scripts/view.js\"></script>";
        echoConsoleWarningScript();
        echo "</body></html>";
    }
?>