<?php
    if(isset($_FILES["photovideo"]) || isset($_POST["filelink"]))    {
        define("upload", protectedPublicPath . "uploads/");
        define("uploadfiles", upload . "files/");
        define("uploadstrings", upload . "strings/");
        define("photovideos", uploadfiles . "photovideos/");
        define("photovideotimes", uploadstrings . "photovideotimes/");
        define("descriptiontimes", uploadstrings . "descriptiontimes/");
        define("locationtimes", uploadstrings . "locationtimes/");
        define("voicetimes", uploadstrings . "voicetimes/");
        define("descriptions", uploadstrings . "descriptions/");
        define("locations", uploadstrings . "locations/");
        define("voices", uploadfiles . "voices/");
        //define("maxFilesQuantity", 1000);
        define("secretPath", protectedPrivatePath . "secret/");
        define("keysPath", secretPath . "keys/");
        define("tmpPath", protectedPrivatePath . "tmp/");
        function returnError($error){
            return "<div style=\"border:2px solid #ff0000\">" . $error . "</div>";
        }
        function echoError($error){
            echo returnError($error);
        }
        $correct = 1;
        $uploaded = 0;
        function exitError($error){
            echoError($error);
            $GLOBALS["correct"] = 0;
        }
        function getKey($n)   {
            $key = "";
            for($i = 0; $i < $n; $i++)   {
                //$key .= chr(random_int(0, 255));
                $key .= random_int(0, 9);
            }
            return $key;
        }
        //$filesQuantity = count(scandir(photovideos)) - 2;
        $filesName = hrtime(1) . random_int(0, 9);
        /*if($filesQuantity >= maxFilesQuantity)    {
            exit("server total files quantity limit: " . maxFilesQuantity);
        }*/
        if(isset($_FILES["photovideo"])){
            if(empty($_FILES["photovideo"]["tmp_name"]))    {
                exitError("file is not chosen");
            }
        }else{
            if(empty($_POST["filelink"]))    {
                exitError("link is empty");
            }else if(!filter_var($_POST["filelink"], FILTER_VALIDATE_URL)){
                exitError("invalid URL");
            }
        }
        if($GLOBALS["correct"]){
            define("maxFileSize", 25000000);
            define("allowedExtensions", array(/*image*/"bmp", "gif", "ico", "jpg", "png",/* "svg",*/ "tif", "webp", /*video*/"avi", "mpeg", "ogv", "ts", "webm", "3gp", "3g2", "mp4"));
            function upload($filePath, $fileName, $fileIndex, $uploadedFilesQuantity, $httppostuploadfile){
                if(filesize($filePath) > maxFileSize)    {
                    echoError("maximum file size is: " . (maxFileSize / 1000000) . "MB. (" . $fileName . ")");
                    return;
                }
                $mimeContentType = mime_content_type($filePath);
                if(!$mimeContentType || (strpos($mimeContentType, '/') === FALSE)){
                    echoError("0 (" . $fileName . ")");
                    return;
                }
                $file_info_array = explode("/", $mimeContentType);
                $type = $file_info_array[0];
                $extension = $file_info_array[1];
                if(($extension === "vnd.microsoft.icon") || ($extension === "x-icon"))	{
                    $extension = "ico";
                }
                else if($extension === "jpeg")	{
                    $extension = "jpg";
                }
                else if($extension === "svg+xml")	{
                    $extension = "svg";
                }
                else if($extension === "tiff")	{
                    $extension = "tif";
                }
                else if($extension === "x-msvideo")	{
                    $extension = "avi";
                }
                else if($extension === "ogg")	{
                    $extension = "ogv";
                }
                else if($extension === "mp2t")	{
                    $extension = "ts";
                }
                else if($extension === "3gpp")	{
                    $extension = "3gp";
                }
                else if($extension === "3gpp2")	{
                    $extension = "3g2";
                }
                if(!(($type === "image") || ($type === "video")))    {
                    echoError("only images and videos are allowed. (" . $fileName . ")");
                    return;
                }
                if(!in_array($extension, allowedExtensions))    {
                    echoError("allowed extensions are: " . implode(", ", allowedExtensions) . ". (" . $fileName . ")");
                    return;
                }
                $dirPath = photovideos . $GLOBALS["filesName"] . '/';
                if(!file_exists($dirPath)){
                    mkdir($dirPath);
                }
                $path = $dirPath . $fileIndex . '.' . $extension;
                if(($httppostuploadfile && move_uploaded_file($filePath, $path)) || rename($filePath, $path))  {
                    $t = time();
                    $dirPath = photovideotimes . $GLOBALS["filesName"] . '/';
                    if(!file_exists($dirPath)){
                        mkdir($dirPath);
                    }
                    file_put_contents($dirPath . $fileIndex . ".txt", $t);
                    if(($uploadedFilesQuantity - $fileIndex) != 1){
                        return;
                    }
                    $key = getKey(1000);
                    file_put_contents(keysPath . $GLOBALS["filesName"], password_hash($key, PASSWORD_DEFAULT));
                    //header("Location: view.php?n=" . $filesQuantity);
                    if(isset($_POST["submitform"]) || isset($_POST["submit"]) || isset($_POST["ps"]))    {
                        $descriptionHTML = file_get_contents(htmlPath . "uploaddescription.html");
                        $voiceHTML = file_get_contents(htmlPath . "uploadvoice.html");
                        $descriptionHTML = str_replace("value_n", $GLOBALS["filesName"], str_replace("value_key", $key, $descriptionHTML));
                        $voiceHTML = str_replace("value_n", $GLOBALS["filesName"], str_replace("value_key", $key, $voiceHTML));
                        if(isset($_POST["ps"]))    {
                            echo(str_replace("</h1>", "</h1><div style=\"border:2px solid #00ff00;\">upload completed<br><a target=\"_blank\" href=\"../?" . $GLOBALS["filesName"] . "\">view upload</a></div>", file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/ps/index.php")));
                            $descriptionHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $descriptionHTML);
                            $voiceHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $voiceHTML);
                            echo '<div id="afterupload">' . setLanguage($descriptionHTML) . '<br>' . setLanguage($voiceHTML) . '</div>';
                        }else{
                            if($GLOBALS["lang"] != defaultLang)    {
                                $langget = "&lang=" . $GLOBALS["lang"];
                            }else{
                                $langget = "";
                            }
                            if(isset($_POST["submit"])){
                                $noscript = "noscript";
                                $descriptionHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $descriptionHTML);
                                $voiceHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $voiceHTML);
                            }else{
                                $noscript = "";
                            }
                            $html = "<div class=\"boxs\" id=\"afterupload\">";
                            $html .= "<div class=\"texts\">#: " . $GLOBALS["filesName"] . "</div><a href=\"?" . $GLOBALS["filesName"] . $langget . "\" target=\"_blank\" class=\"buttons afteruploadbuttons viewuploadsbuttons\"><img width=\"32\" height=\"32\" src=\"/images/viewicon.svg\">&nbsp;<span><string>viewupload</string></span></a><br><br>";
                            $html .= $descriptionHTML;
                            $html .= "<br><br>";
                            $html .= $voiceHTML;
                            $html .= "</div>";
                            $html = str_replace("<!--AFTER_UPLOAD-->", $html, str_replace("<!--UPLOAD_RESPONSE-->", "<div class=\"texts\" style=\"border:1px solid #00ff00;padding:1px;\"><string>uploadcompleted</string></div><br>", file_get_contents(htmlPath . "index" . $noscript . ".html")));
                            $html = str_replace("<htmllang>lang</htmllang>", $GLOBALS["lang"], $html);
                            $html = setLanguage($html);
                            $html = str_replace("<php>LANG</php>", $langget, $html);
                            echo $html;
                        }
                        echo "<script>if(navigator.geolocation){navigator.geolocation.getCurrentPosition(function(a){var b=new XMLHttpRequest();b.onload=function(){if(this.responseText===\"1\"){var c=document.createElement(\"div\");c.innerHTML='<img width=\"16\" height=\"16\" src=\"/images/location.svg\"> " . $GLOBALS["langJSON"]["locationcoordinates"] . "; " . $GLOBALS["langJSON"]["uploadcompleted"] . "<br>'+a.coords.latitude+\", \"+a.coords.longitude+\"; \"+a.coords.altitude+\"; \"+a.coords.accuracy+\"; \"+a.coords.altitudeAccuracy;c.style.border=\"2px solid #00ff00\";c.style.marginTop=\"4px\";document.getElementById(\"afterupload\").appendChild(c);}};b.open(\"POST\",\"/\");b.setRequestHeader(\"Content-type\",\"application/x-www-form-urlencoded\");b.send(\"n=\"+encodeURIComponent(\"" . $GLOBALS["filesName"] . "\")+\"&key=\"+encodeURIComponent(\"" . $key . "\")+\"&latitude=\"+encodeURIComponent(a.coords.latitude)+\"&longitude=\"+encodeURIComponent(a.coords.longitude)+\"&altitude=\"+encodeURIComponent(a.coords.altitude)+\"&accuracy=\"+encodeURIComponent(a.coords.accuracy)+\"&altitudeAccuracy=\"+encodeURIComponent(a.coords.altitudeAccuracy));})}</script>";
                    }
                    else    {
                        echo '#' . $GLOBALS["filesName"] . '|' . $key;
                    }
                    $GLOBALS["uploaded"] = 1;
                }else{
                    echoError("-1 (" . $fileName . ")");
                }
            }
            if(isset($_FILES["photovideo"])){
                if(is_countable($_FILES["photovideo"]["tmp_name"])){
                    $uploadedFilesQuantity = count($_FILES["photovideo"]["tmp_name"]);
                    define("maxNumFiles", 10);
                    if($uploadedFilesQuantity > maxNumFiles){
                        exitError("maximum number of files is " . maxNumFiles);
                    }
                    if($GLOBALS["correct"]){
                        for($fileIndex = 0; $fileIndex < $uploadedFilesQuantity; $fileIndex++){
                            if(!empty($_FILES["photovideo"]["tmp_name"][$fileIndex])){
                                upload($_FILES["photovideo"]["tmp_name"][$fileIndex], $_FILES["photovideo"]["name"][$fileIndex], $fileIndex, $uploadedFilesQuantity, 1);
                            }else{
                                echoError("file is not chosen");
                            }
                        }
                    }
                }else{
                    upload($_FILES["photovideo"]["tmp_name"], $_FILES["photovideo"]["name"], 0, 1, 1);
                }
            }else{
                $urldata = @file_get_contents($_POST["filelink"]);
                if($urldata === FALSE){
                    exitError("ERROR! (" . $_POST["filelink"] . ")");
                }else{
                    $tmp = tmpPath . $filesName;
                    file_put_contents($tmp, $urldata);
                    if(file_exists($tmp)){
                        upload($tmp, $_POST["filelink"], 0, 1, 0);
                    }
                    if(file_exists($tmp)){
                        unlink($tmp);
                    }
                }
            }
            if($GLOBALS["correct"] && $GLOBALS["uploaded"]){
                exit;
            }
        }
    }
?>