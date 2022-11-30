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
    if($rawData){
        header("Access-Control-Allow-Origin: *");
    }
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
        $emergencyModePath = uploadstrings . "emergencymodes/" . $n . ".txt";
        if(file_exists($emergencyModePath)){
            $emergencyMode = file_get_contents($emergencyModePath);
        }
        if($rawData)    {
            $dataArray = [$n];
        }
        else    {
            $html = file_get_contents(htmlPath . "view.html");
            $html = setValue("N", $n, $html);
            $html = setValue("LINK", $n . $GLOBALS["langget"], $html);
            //$html = setValue("FULLLINK", getMainWebAddress() . "/?" . $n, $html);
            $html = setValue("FULLLINK", getMainWebAddress() . "/?view&n=" . $n, $html);
            $emergencyModeHtml = '';
            if(isset($emergencyMode)){
                $emergencyModeHtml = '
                    <div class="boxs">
                        <img width="16" height="16" src="/images/emergency.svg"><span class="emergencymode"><string>emergencymode</string></span>
                        <div>
                            ' . getT($emergencyMode) . '
                        </div>
                    </div>
                ';
            }
            $html = setValue("EMERGENCYMODE", $emergencyModeHtml, $html);
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
                    $type = explode("/", mime_content_type($dirpath . "/" . $dirFiles[$i]))[0];
                    if($type != "image" && $type != "video"){
                        $type = "live";
                        $path = "?view&v=uploads/livevideos/" . $dirFiles[$i] . ".webm";
                    }else{
                        $path = $dirPublicPath . $dirFiles[$i];
                    }
                    array_push($filePaths, $path);
                    array_push($timeDatas, file_get_contents(photovideotimes . $n . "/" . $timeFiles[$i]));
                    array_push($fileTypes, $type);
                }
                array_push($dataArray, $filePaths, $timeDatas, $fileTypes);
            }else{
                /*$photovideoHTML = "";
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
                            $photovideoHTML .= '<div class="photovideo pvoverlay0" style="border-style:solid;">' . $photovideoTag . '<a href="?view&n=' . $n . '&all" class="pvoverlay">+' . ($dirFilesQuantity - 1) . '</a></div>';
                            $photovideoHTML .= '<a target="_blank" href="?view&n=' . $n . '&all" class="buttons"><img width="32" height="32" src="images/open.svg"> <span class="open"><string>open</string></span> <img width="32" height="32" src="images/newtab.svg"></a>';
                        }else{
                            break;
                        }
                    }
                }
                $html = setValue("PHOTOVIDEO", $photovideoHTML, $html);*/
                $allFile = (isset($_GET["all"]) && ($_GET["all"] == "file"));
                $photovideoHTML = "";
                for($i = 0; $i < $dirFilesQuantity; $i++){
                    $path = $dirPublicPath . $dirFiles[$i];
                    $fileType = explode("/", mime_content_type($dirpath . "/" . $dirFiles[$i]))[0];
                    if($fileType == "image")    {
                        $tagName = "img";
                        $attributes = "";
                        $fileTypeTag = "<img width=\"16\" height=\"16\" src=\"images/photo.svg\"><span class=\"photo\"><string>photo</string></span>";
                    }
                    else if($fileType == "video")   {
                        $tagName = "video";
                        $attributes = " controls";
                        $fileTypeTag = "<img width=\"16\" height=\"16\" src=\"images/video.svg\"><span class=\"video\"><string>video</string></span>";
                    }else{
                        $tagName = "video";
                        $attributes = " controls";
                        $fileTypeTag = "<img width=\"16\" height=\"16\" src=\"images/live.svg\"><span class=\"livestream\"><string>livestream</string></span>";
                        $path = "?view&v=uploads/livevideos/" . $dirFiles[$i] . ".webm";
                    }
                    $photovideoTag = "<" . $tagName . $attributes . " src=\"" . $path . "\"></" . $tagName . ">";
                    if($allFile || $i == 0){
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
                            if(!$allFile && $i == 0){
                                $photovideoHTML .= "<br>";
                            }else{
                                $photovideoHTML .= "<hr>";
                            }
                        }
                    }else{
                        if($i == 0){
                            $photovideoHTML .= '<div class="photovideo">' . $photovideoTag . '</div>';
                        }else{
                            $photovideoHTML .= '<a href="?view&n=' . $n . '&all=file" class="buttons"><img width="32" height="32" src="images/multiple.svg"> <span class="viewall"><string>viewall</string></span></a>';
                            $photovideoHTML .= '<a target="_blank" href="?view&n=' . $n . '&all=file" class="buttons"><img width="32" height="32" src="images/newtab.svg"></a>';
                            break;
                        }
                    }
                }
                $html = setValue("PHOTOVIDEO", $photovideoHTML, $html);
            }
            $locationPath = locations . $n . "/";
            if(file_exists($locationPath))    {
                $allLocation = (isset($_GET["all"]) && ($_GET["all"] == "location"));
                //$locationPath .= scandir($locationPath)[2];
                //$locationData = file_get_contents($locationPath);
                //$locationTime = getT(file_get_contents(locationtimes . $n . "/" . scandir(locationtimes . $n)[2]));
                $locationPaths = array_slice(scandir($locationPath), 2);
                $locationData = [];
                if($rawData || $allLocation){
                    foreach($locationPaths as $path){
                        array_push($locationData, file_get_contents($locationPath . $path));
                    }
                }else{
                    array_push($locationData, file_get_contents($locationPath . $locationPaths[0]));
                }
                $locationTimePath = locationtimes . $n . "/";
                $locationTime = [];
                $locationTimePaths = array_slice(scandir($locationTimePath), 2);
                if($rawData || $allLocation){
                    foreach($locationTimePaths as $path){
                        array_push($locationTime, getT(file_get_contents($locationTimePath . $path)));
                    }
                }else{
                    array_push($locationTime, getT(file_get_contents($locationTimePath . $locationTimePaths[0])));
                }
            }
            else    {
                $locationData = "";
                $locationTime = "";
            }
            if($rawData)    {
                array_push($dataArray, $locationData, $locationTime);
            }
            else    {
                if(!empty($locationTime))    {
                    //$locationData = $locationData[0];
                    //$locationTime = $locationTime[0];
                    $locationHTML = '';
                    $locationQuantity = count($locationData);
                    for($i = 0; $i < $locationQuantity; $i++){
                        $locationArray = explode("; ", $locationData[$i]);
                        for($j = 0; $j < count($locationArray); $j++){
                            if($locationArray[$j] == "-"){
                                $locationArray[$j] = getNoData();
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
                            //$html = str_replace("<!--MAPS-->", $maps, $html);
                        }
                        $locationPublicPath = "?view&v=uploads/strings/locations/" . $n . "/" . basename($locationPaths[$i]);
                        $locationButtons = "<div class=\"buttonsdivs\">";
                        $locationButtons .= "<a href=\"" . $locationPublicPath . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/newtab.svg\"> <span class=\"open\"><string>open</string></span></a>";
                        $locationButtons .= "<a target=\"_blank\" href=\"" . $locationPublicPath . "\" class=\"buttons\"> <img width=\"32\" height=\"32\" src=\"images/newtab.svg\"></a>";
                        $locationButtons .= "<a href=\"" . $locationPublicPath . "\" download=\"" . $n . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/download.svg\"><span class=\"download\"><string>download</string></span></a>";
                        $locationButtons .= "</div>";
                        $locationHTML .= '
                            <div>
                                <img width="16" height="16" src="images/location.svg">
                                <span class="locationcoordinates title"><string>locationcoordinates</string></span>
                            </div>
                            <br>
                            <div>
                            <div class="latitudelongitude title"><string>latitudelongitude</string></div>
                            <div class="latlong">' . $locationArray[0] . '</div>
                            </div>
                            <div>
                            <div class="altitude title"><string>altitude</string></div>
                            <div class="z">' . $locationArray[1] . '</div>
                            </div>
                            <div>
                            <div class="accuracy title"><string>accuracy</string></div>
                                <div class="accuracydiv">' . $locationArray[2] . '</div>
                            </div>
                            <div>
                                <div class="altitudeaccuracy title"><string>altitudeaccuracy</string></div>
                                <div class="accuracyz">' . $locationArray[3] . '</div>
                            </div>
                            <br>
                            ' . $locationButtons . '
                            <br>
                            <div class="ltime">' . $locationTime[$i] . '</div>
                        ' . $maps;
                        if($locationQuantity - $i != 1){
                            $locationHTML .= "<hr>";
                        }
                    }
                    if(!$allLocation && (count($locationPaths) > 1)){
                        $locationHTML .= '<br><a href="?view&n=' . $n . '&all=location" class="buttons"><img width="32" height="32" src="images/multiple.svg"> <span class="viewall"><string>viewall</string></span></a>';
                        $locationHTML .= '<a target="_blank" href="?view&n=' . $n . '&all=location" class="buttons"><img width="32" height="32" src="images/newtab.svg"></a>';
                    }
                    $link = '<a href="?view&v=uploads/strings/locations/' . $n . '">..locations/' . $n . '</a>';
                    $link2 = '<a href="?view&v=uploads/strings/locationtimes/' . $n . '">..locationtimes/' . $n . '</a>';
                }else{
                    //$locationArray = [getNoData(), getNoData(), getNoData(), getNoData()];
                    //$locationButtons = "";
                    $locationHTML = '
                        <div>
                            <img width="16" height="16" src="images/location.svg">
                            <span class="locationcoordinates title"><string>locationcoordinates</string></span>
                        </div>
                    ' . getNoData();
                    $link = '';
                    $link2 = '';
                }
                //$html = setValue("LATLONG", $locationArray[0], $html);
                //$html = setValue("Z", $locationArray[1], $html);
                //$html = setValue("ACCURACY", $locationArray[2], $html);
                //$html = setValue("ACCURACYZ", $locationArray[3], $html);
                //$html = setValue("LTIME", $locationTime, $html);
                //$html = setValue("LBUTTONS", $locationButtons, $html);
                $html = setValue("LOCATION", $locationHTML, $html);
                $html = setValue("LLINK", $link, $html);
                $html = setValue("LTLINK", $link2, $html);
            }
            $descriptionPath = descriptions . $n . "/";
            if(file_exists($descriptionPath))    {
                //$descriptionPath .= scandir($descriptionPath)[2];
                //$descriptionData = htmlspecialchars(file_get_contents($descriptionPath));
                $descriptionData = [];
                $descriptionTime = [];
                $descriptionTimePath = descriptiontimes . $n . "/";
                $descriptionPaths = array_slice(scandir($descriptionPath), 2);
                $allDescription = (isset($_GET["all"]) && ($_GET["all"] == "description"));
                if($rawData || $allDescription){
                    foreach($descriptionPaths as $path){
                        array_push($descriptionData, htmlspecialchars(file_get_contents($descriptionPath . $path)));
                    }
                }else{
                    array_push($descriptionData, htmlspecialchars(file_get_contents($descriptionPath . $descriptionPaths[0])));
                }
                $descriptionTimePaths = array_slice(scandir($descriptionTimePath), 2);
                if($rawData || $allDescription){
                    foreach($descriptionTimePaths as $path){
                        array_push($descriptionTime, getT(file_get_contents($descriptionTimePath . $path)));
                    }
                }else{
                    array_push($descriptionTime, getT(file_get_contents($descriptionTimePath . $descriptionTimePaths[0])));
                }
                if(!$rawData){
                    for($i = 0; $i < count($descriptionData); $i++){
                        if((substr_count($descriptionData[$i], "\n") + 1) > textNewlineDisplay){
                            $lastPos = 0;
                            for($i = 0; $i < textNewlineDisplay; $i++){
                                $lastPos = strpos($descriptionData[$i], "\n", $lastPos);
                                $lastPos++;
                            }
                            $moreTextIndex = $lastPos;
                        }
                        else if(strlen($descriptionData[$i]) > textLengthDisplay){
                            $moreTextIndex = textLengthDisplay;
                        }
                        if(isset($moreTextIndex)){
                            $descriptionData[$i] = substr_replace($descriptionData[$i], "<span id=\"moretext" . $n . "\" class=\"moretext\" style=\"display:inline;vertical-align:initial;\">", $moreTextIndex, 0) . "</span><button id=\"seemore" . $n . "\" class=\"seemore\" style=\"display:none;\">...&#62;&#62;</button>";
                        }
                    }
                }
                //$descriptionTime = getT(file_get_contents(descriptiontimes . $n . "/" . scandir(descriptiontimes . $n)[2]));
                
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
                $descriptionHTML = "";
                if(!empty($descriptionTime))    {
                    $descriptionQuantity = count($descriptionData);
                    for($i = 0; $i < $descriptionQuantity; $i++){
                        $descriptionPublicPath = "?view&v=uploads/strings/descriptions/" . $n . "/" . $descriptionPaths[$i];
                        $descriptionButtons = "<div class=\"buttonsdivs\">";
                        $descriptionButtons .= "<a href=\"" . $descriptionPublicPath . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/newtab.svg\"> <span class=\"open\"><string>open</string></span></a>";
                        $descriptionButtons .= "<a target=\"_blank\" href=\"" . $descriptionPublicPath . "\" class=\"buttons\"> <img width=\"32\" height=\"32\" src=\"images/newtab.svg\"></a>";
                        $descriptionButtons .= "<a href=\"" . $descriptionPublicPath . "\" download=\"" . $n . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/download.svg\"><span class=\"download\"><string>download</string></span></a>";
                        $descriptionButtons .= "</div>";
                        $descriptionHTML .= '
                            <div>
                                <img width="16" height="16" src="images/description.svg">
                                <span class="description title"><string>description</string></span>
                            </div>
                            <br>
                            <div class="descriptiondiv">' . $descriptionData[$i] . '</div>
                            <br>
                            ' . $descriptionButtons . '
                            <br>
                            <div class="dtime">' . $descriptionTime[$i] . '</div>
                        ';
                        if($descriptionQuantity - $i != 1){
                            $descriptionHTML .= "<hr>";
                        }
                    }
                    if(!$allDescription && (count($descriptionPaths) > 1)){
                        $descriptionHTML .= '<br><a href="?view&n=' . $n . '&all=description" class="buttons"><img width="32" height="32" src="images/multiple.svg"> <span class="viewall"><string>viewall</string></span></a>';
                        $descriptionHTML .= '<a target="_blank" href="?view&n=' . $n . '&all=description" class="buttons"><img width="32" height="32" src="images/newtab.svg"></a>';
                    }
                    $link = '<a href="?view&v=uploads/strings/descriptions/' . $n . '">..descriptions/' . $n . '</a>';
                    $link2 = '<a href="?view&v=uploads/strings/descriptiontimes/' . $n . '">..descriptiontimes/' . $n . '</a>';
                }else{
                    $descriptionHTML .= '
                        <div>
                            <img width="16" height="16" src="images/description.svg">
                            <span class="description title"><string>description</string></span>
                        </div>
                        ' . getNoData() . '
                    ';
                    $link = '';
                    $link2 = '';
                }
                //$html = setValue("DESCRIPTION", $descriptionData, $html);
                //$html = setValue("DBUTTONS", $descriptionButtons, $html);
                //$html = setValue("DTIME", $descriptionTime, $html);
                $html = setValue("DESCRIPTION", $descriptionHTML, $html);
                $html = setValue("DLINK", $link, $html);
                $html = setValue("DTLINK", $link2, $html);
            }
            $vtimePath = voicetimes . $n . "/";
            $voicePath = "";
            if(file_exists($vtimePath))    {
                $allVoice = (isset($_GET["all"]) && ($_GET["all"] == "voice"));
                //$vtimePath .= scandir($vtimePath)[2];
                //$voicePath = glob(voices . $n . "/0.*")[0];
                $voiceFiles = array_slice(scandir(voices . $n . "/"), 2);
                //$voicePath .= scandir($voicePath)[2];
                //$voicePublicPath = "?view&v=uploads/files/voices/" . $n . "/" . basename($voicePath);
                $voicePath = "?view&v=uploads/files/voices/" . $n . "/";
                $voicePublicPath = [];
                if($rawData || $allVoice){
                    foreach($voiceFiles as $file){
                        array_push($voicePublicPath, $voicePath . $file);
                    }
                }else{
                    array_push($voicePublicPath, $voicePath . $voiceFiles[0]);
                }
                $voiceTimePath = voicetimes . $n . "/";
                $voiceTimeFiles = array_slice(scandir($voiceTimePath), 2);
                $voiceTime = [];
                if($rawData || $allVoice){
                    foreach($voiceTimeFiles as $file){
                        array_push($voiceTime, getT(file_get_contents($voiceTimePath . $file)));
                    }
                }else{
                    array_push($voiceTime, getT(file_get_contents($voiceTimePath . $voiceTimeFiles[0])));
                }
                //$voiceTime = getT(file_get_contents( . scandir(voicetimes . $n)[2]));
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
                    //$voicePublicPath = $voicePublicPath[0];
                    //$voiceTime = $voiceTime[0];
                    $voiceQuantity = count($voicePublicPath);
                    $voiceHTML = '';
                    for($i = 0; $i < $voiceQuantity; $i++){
                        $voiceTag = "<audio controls src=\"" . $voicePublicPath[$i] . "\"></audio>";
                        $voiceButtons = "<div class=\"buttonsdivs\">";
                        $voiceButtons .= "<a href=\"" . $voicePublicPath[$i] . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/open.svg\"> <span class=\"open\"><string>open</string></span></a>";
                        $voiceButtons .= "<a target=\"_blank\" href=\"" . $voicePublicPath[$i] . "\" class=\"buttons\"> <img width=\"32\" height=\"32\" src=\"images/newtab.svg\"></a>";
                        $voiceButtons .= "<a href=\"" . $voicePublicPath[$i] . "\" download=\"" . $n . "\" class=\"buttons\"><img width=\"32\" height=\"32\" src=\"images/download.svg\"><span class=\"download\"><string>download</string></span></a>";
                        $voiceButtons .= "</div>";
                        $voiceHTML .= '
                            <div>
                                <img width="16" height="16" src="images/microphone.svg">
                                <span class="voice title"><string>voice</string></span>
                            </div>
                            <br>
                            <div class="voicediv">' . $voiceTag . '</div>
                            <br>
                            ' . $voiceButtons . '
                            <br>
                            <div class="vtime">' . $voiceTime[$i] . '</div>
                        ';
                        if($voiceQuantity - $i != 1){
                            $voiceHTML .= "<hr>";
                        }
                    }
                    if(!$allVoice && (count($voiceFiles) > 1)){
                        $voiceHTML .= '<br><a href="?view&n=' . $n . '&all=voice" class="buttons"><img width="32" height="32" src="images/multiple.svg"> <span class="viewall"><string>viewall</string></span></a>';
                        $voiceHTML .= '<a target="_blank" href="?view&n=' . $n . '&all=voice" class="buttons"><img width="32" height="32" src="images/newtab.svg"></a>';
                    }
                    $link = '<a href="?view&v=uploads/files/voices/' . $n . '">..voices/' . $n . '</a>';
                    $link2 = '<a href="?view&v=uploads/strings/voicetimes/' . $n . '">..voicetimes/' . $n . '</a>';
                }else{
                    $voiceHTML = '
                        <div>
                            <img width="16" height="16" src="images/microphone.svg">
                            <span class="voice title"><string>voice</string></span>
                        </div>
                    ' . getNoData();
                    $link = '';
                    $link2 = '';
                }
                //$html = setValue("VOICE", $voiceTag, $html);
                //$html = setValue("VBUTTONS", $voiceButtons, $html);
                //$html = setValue("VTIME", $voiceTime, $html);
                $html = setValue("VOICE", $voiceHTML, $html);
                $html = setValue("VLINK", $link, $html);
                $html = setValue("VTLINK", $link2, $html);
            }
        }
        if($rawData)    {
            return json_encode($dataArray);
        }
        else    {
            return setLanguage($html/*, $GLOBALS["langJSON"]*/);
        }
    }
    $ajax = isset($_GET["ajax"]) && ($_GET["ajax"] == 1);
    if(!$rawData && !$ajax)    {
        $topHTML = "<!DOCTYPE html><html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta charset=\"UTF-8\"><link rel=\"stylesheet\" href=\"styles/view.css\"><title><string>viewuploads</string> | <string>pedestrian</string> SOS!</title></head>";
        $topHTML .= "<body><div id=\"main\"><div id=\"top\"><a href=\"/\" style=\"text-decoration: none;\"><img width=\"64\" height=\"64\" src=\"images/pedestriansos.svg\"> <h1><span class=\"pedestrian\"><string>pedestrian</string></span>&nbsp;<span id=\"sos\">SOS!</span></h1></a></div>";
        echo setLanguage($topHTML/*, $GLOBALS["langJSON"]*/);
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
    if(!$rawData && !$ajax){
        echo '
        <h2>
            <span class="viewuploads">' . $langJSON["viewuploads"] . '</span>
        </h2>
        <a href="/" class="buttons">
            <img width="32" height="32" src="images/homepage.svg">&nbsp;<span class="gomainpage">' . $langJSON["gomainpage"] . '</span>
        </a>
        <br>
        ';
    }
    if(isset($_GET["n"]) && ctype_digit($_GET["n"]))    {
        /*if(!ctype_digit($n))    {
            exit("parameter is not id");
        }*/
        //echo getData($_GET["n"], 0);
        echo getData($_GET["n"], $rawData);
    }
    else    {
        if(!$rawData && !$ajax){
            echo '<br><a href="?view&v=uploads/">..uploads/</a><br>';
        }
        $serverName = "localhost";
        $userName = "root";
        $password = "";
        $dbname = "pedestriansos";
        $conn = mysqli_connect($serverName, $userName, $password, $dbname);
        if($conn){
            $page = 0;
            $limitSQL = "";
            if(!$rawData || ($rawData && ((isset($_GET["t"]) && ctype_digit($_GET["t"])) || (isset($_GET["p"]) && ctype_digit($_GET["p"])))))    {
                define("maxQuantity", 10);
                if(isset($_GET["p"]) && ctype_digit($_GET["p"]))    {
                    $page = $_GET["p"];
                }
                $limitSQL = " LIMIT " . (maxQuantity * $page) . ", " . maxQuantity;
                $count = 0;
            }
            $timeFromSQL = "";
            if(isset($_GET["t"]) && ctype_digit($_GET["t"]))    {
                $topN = $_GET["t"];
                $timeFromSQL = " WHERE filetime < " . $_GET["t"];
            }
            $sql = "SELECT filepath, filetime from uploads" . $timeFromSQL . " ORDER BY id DESC" . $limitSQL;
            $result = mysqli_query($conn, $sql);
            if(mysqli_num_rows($result) > 0){
                if(!$rawData && !$ajax){
                    echo '<div id="content">';
                }
                $firstLoop = 1;
                while($row = mysqli_fetch_assoc($result)){
                    if($rawData){
                        if($firstLoop){
                            $firstLoop = 0;
                        }else{
                            echo ">";
                        }
                    }
                    echo getData($row["filepath"], $rawData);
                    if(isset($count)){
                        if($count == 0){
                            if($timeFromSQL == ""){
                                $topN = $row["filetime"];
                            }   
                        }
                        $count++;
                    }
                }
                if(!$rawData && !$ajax){
                    echo '</div>';
                }
                if(!$rawData)    {
                    // $nextAvailable = (count($files) == maxQuantity);
                    $nextAvailable = ($count == maxQuantity);
                    if($nextAvailable){
                        echo '<br><button class="buttons" id="viewmore" onclick="viewMore(this)" page="' . ($page + 1) . '" topn="' . $topN . '"><img width="32" height="32" src="images/viewmore.svg"> <span class="viewmore">' . $langJSON["viewmore"] . '</span></button><br>';
                    }
                    if(!$ajax){
                        //if($nextAvailable){
                            echo '<div id="newcontent"></div><div class="loader" id="loader"></div><br><div id="loaderror"></div>';
                        //}
                        if($page){
                            echo "<a href=\"?view&p=" . ($page - 1) . "&t=" . $topN . $langget . "\" class=\"buttons\"><span style=\"color:#256aff;font-size:32px;\">&#60;&#60;</span> <span class=\"previous\">" . $langJSON["previous"] . "</span></a>";
                        }
                        if($nextAvailable){
                            echo "<a href=\"?view&p=" . ($page + 1) . "&t=" . $topN . $langget . "\" class=\"buttons\"><span style=\"color:#256aff;font-size:32px;\">&#62;&#62;</span> <span class=\"next\">" . $langJSON["next"] . "</span></a>";   
                        }
                        if(isset($_GET["t"]) && ctype_digit($_GET["t"])){
                            // echo '<br>' . getT(file_get_contents(photovideotimes . $_GET["t"] . "/0.txt"));
                            // $path = photovideotimes . $_GET["t"];
                            // echo '<br>' . getT(file_get_contents($path . "/" . scandir($path)[2]));
                            echo '<br>' . getT($_GET["t"]);
                            echo '<br><a href="?view" class="buttons"><img width="32" height="32" src="images/viewicon.svg"> <span class="viewnewest">' . $langJSON["viewnewest"] . '</span></a>';
                        }
                    }
                }
            }else{
                if($rawData){
                    echo "0";
                }else{
                    echo("<br><br>" . getNoData());
                }
            }
            mysqli_close($conn);
        }
        // if(/*!file_exists(photovideotimes)*/count(scandir(photovideotimes)) == 2){
        //     if($rawData){
        //         echo "0";
        //     }else{
        //         echo("<br><br>" . getNoData());
        //     }
        // }else{
        //     /*$files0 = array_slice(scandir(photovideotimes), 2);
        //     $filestimes = [];
        //     foreach($files0 as $file){
        //         array_push($filestimes, file_get_contents(photovideotimes . $file . "/0.txt"));
        //     }
        //     $filestimes0 = $filestimes;
        //     arsort($filestimes);
        //     $files = [];
        //     foreach($filestimes as $filetime){
        //         $index = array_search($filetime, $filestimes0);
        //         array_push($files, $files0[$index]);
        //         unset($filestimes0[$index]);
        //     }*/
        //     //$files = array_slice(scandir(photovideotimes), 2);
        //     //$files = array_reverse($files);
        //     // $files = array_slice(scandir(photovideotimes, 1), 0, -2);
        //     // if(!$rawData || ($rawData && ((isset($_GET["t"]) && ctype_digit($_GET["t"])) || (isset($_GET["p"]) && ctype_digit($_GET["p"])))))    {
        //     //     define("maxQuantity", 10);
        //     //     if(isset($_GET["t"]) && ctype_digit($_GET["t"]))    {
        //     //         $topN = $_GET["t"];
        //     //         // $files = array_slice($files, array_search($topN, $files));
        //     //     }
        //     //     else    {
        //     //         // $topN = $files[0];
        //     //     }
        //     //     $page = 0;
        //     //     if(isset($_GET["p"]) && ctype_digit($_GET["p"]))    {
        //     //         $page = $_GET["p"];
        //     //     }
        //     //     // $files = array_slice($files, maxQuantity * $page, maxQuantity);
        //     // }
        //     if(!$rawData && !$ajax){
        //         echo '<div id="content">';
        //     }
        //     // $filesQuantity = count($files);
        //     /*for($i = 0; $i < $filesQuantity; $i++)    {
        //         echo getData($files[$i], $rawData);
        //         if($rawData && ($i < ($filesQuantity - 1))){
        //             echo ">";
        //         }
        //     }*/
        //     if(!$rawData && !$ajax){
        //         echo '</div>';
        //     }
        //     if(!$rawData)    {
        //         $nextAvailable = (count($files) == maxQuantity);
        //         if($nextAvailable){
        //             echo '<br><button class="buttons" id="viewmore" onclick="viewMore(this)" page="' . ($page + 1) . '" topn="' . $topN . '"><img width="32" height="32" src="images/viewmore.svg"> <span class="viewmore">' . $langJSON["viewmore"] . '</span></button><br>';
        //         }
        //         if(!$ajax){
        //             //if($nextAvailable){
        //                 echo '<div id="newcontent"></div><div class="loader" id="loader"></div><br><div id="loaderror"></div>';
        //             //}
        //             if($page){
        //                 echo "<a href=\"?view&p=" . ($page - 1) . "&t=" . $topN . $langget . "\" class=\"buttons\"><span style=\"color:#256aff;font-size:32px;\">&#60;&#60;</span> <span class=\"previous\">" . $langJSON["previous"] . "</span></a>";
        //             }
        //             if($nextAvailable){
        //                 echo "<a href=\"?view&p=" . ($page + 1) . "&t=" . $topN . $langget . "\" class=\"buttons\"><span style=\"color:#256aff;font-size:32px;\">&#62;&#62;</span> <span class=\"next\">" . $langJSON["next"] . "</span></a>";   
        //             }
        //             if(isset($_GET["t"]) && ctype_digit($_GET["t"])){
        //                 // echo '<br>' . getT(file_get_contents(photovideotimes . $_GET["t"] . "/0.txt"));
        //                 $path = photovideotimes . $_GET["t"];
        //                 echo '<br>' . getT(file_get_contents($path . "/" . scandir($path)[2]));
        //                 echo '<br><a href="?view" class="buttons"><img width="32" height="32" src="images/viewicon.svg"> <span class="viewnewest">' . $langJSON["viewnewest"] . '</span></a>';
        //             }
        //         }
        //     }
        // }
    }
    if(!$rawData && !$ajax)    {
        echo "<br><br></div><script src=\"scripts/view.js\"></script>";
        echoConsoleWarningScript();
        echo "</body></html>";
    }
?>