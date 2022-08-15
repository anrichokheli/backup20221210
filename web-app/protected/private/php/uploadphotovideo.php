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
        define("uploadSecretsPath", secretPath . "uploads/");
        define("idsPath", uploadSecretsPath . "ids/");
        define("keysPath", uploadSecretsPath . "keys/");
        define("tmpPath", protectedPrivatePath . "tmp/");
        $htmlMode = (isset($_POST["submitform"]) || isset($_POST["submit"]) || isset($_POST["ps"]) || isset($_POST["0"]));
        /*function returnError($error){
            if($GLOBALS["htmlMode"]){
                return "<div style=\"border:2px solid #ff0000;overflow-wrap:break-word;\">" . $error . "</div>";
            }else{
                return $error;
            }
        }*/
        if($htmlMode){
            $errorHTML = "";
        }
        function echoError($error){
            if($GLOBALS["htmlMode"]){
                $GLOBALS["errorHTML"] .= "<div style=\"border:2px solid #ff0000;overflow-wrap:break-word;\">" . $error . "</div>";
            }else{
                echo $error;
            }
        }
        $correct = 1;
        $uploaded = 0;
        function exitError($error){
            echoError($error);
            $GLOBALS["correct"] = 0;
        }
        function getKey($n/*, $digitsOnly = 0*/)   {
            $key = "";
            for($i = 0; $i < $n; $i++)   {
                /*if($digitsOnly){
                    $mode = 0;
                }else{
                    $mode = random_int(0, 2);
                }*/
                $mode = random_int(0, 2);
                if($mode == 0){
                    $key .= random_int(0, 9);
                }else if($mode == 1){
                    $key .= chr(random_int(65, 90));
                }else{
                    $key .= chr(random_int(97, 122));
                }
            }
            return $key;
        }
        //$filesQuantity = count(scandir(photovideos)) - 2;
        //$filesName = hrtime(1);
        function getID(){
            $t = microtime(/*1*/);
            //return $t * 10**strlen(substr($t, strpos($t, ".") + 1));
            $t = explode(" ", $t);
            return $t[1] . substr($t[0], 2, -2);
        }
        if(isset($_POST["id"]) && isset($_POST["key"]) && ctype_alnum($_POST["id"]) && ctype_alnum($_POST["key"])/*ctype_digit($_POST["id"])*/){
            $uploadID = $_POST["id"];
            $uploadKey = $_POST["key"];
            $idPath = idsPath . $uploadID;
            $keyPath = keysPath . $uploadID;
            if(!(file_exists($idPath) && file_exists($keyPath) && password_verify($uploadKey, file_get_contents($keyPath))))    {
                exit("-7");
            }
            $filesName = file_get_contents($idPath);
        }else{
            $filesName = getID();
        }
        /*if($filesQuantity >= maxFilesQuantity)    {
            exit("server total files quantity limit: " . maxFilesQuantity);
        }*/
        if(isset($_FILES["photovideo"])){
            if(empty($_FILES["photovideo"]["tmp_name"]))    {
                exitError("file is not chosen");
            }
        }else{
            if(isset($_POST["filelink"]) && strpos($_POST["filelink"], "http://") !== 0 && strpos($_POST["filelink"], "https://") !== 0){
                $_POST["filelink"] = "http://" . $_POST["filelink"];
            }
            if(empty($_POST["filelink"]))    {
                exitError("link is empty");
            }else if(!filter_var($_POST["filelink"], FILTER_VALIDATE_URL)){
                exitError("invalid URL");
            }else if(parse_url($_POST["filelink"], PHP_URL_SCHEME) != "http" && parse_url($_POST["filelink"], PHP_URL_SCHEME) != "https"){
                exitError("only http protocol is allowed");
            }
        }
        if($GLOBALS["correct"]){
            define("maxFileSize", 25000000);
            define("allowedExtensions", array(/*image*/"bmp", "gif", "ico", "jpg", "png",/* "svg",*/ "tif", "webp", /*video*/"avi", "mpeg", "ogv", "ts", "webm", "3gp", "3g2", "mp4"));
            function upload($filePath, $fileName, $fileIndex, $uploadedFilesQuantity, $httppostuploadfile){
                $fileIndex += $GLOBALS["dirFilesQuantity"];
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
                    if(!mkdir($dirPath)){
                        exitError("-6");
                    }
                }
                $path = $dirPath . /*$fileIndex*/getID() . '.' . $extension;
                if(($httppostuploadfile && move_uploaded_file($filePath, $path)) || rename($filePath, $path))  {
                    $t = time();
                    $dirPath = photovideotimes . $GLOBALS["filesName"] . '/';
                    if(!file_exists($dirPath)){
                        mkdir($dirPath);
                    }
                    if(file_exists($dirPath)){
                        $dirFilePath = $dirPath . /*$fileIndex*/getID() . ".txt";
                        file_put_contents($dirFilePath, $t);
                        if(!file_exists($dirFilePath)){
                            echoError("-4 (" . $fileName . ")");
                        }
                    }else{
                        echoError("-3");
                    }
                    /*if(($uploadedFilesQuantity - $fileIndex) != 1){
                        return;
                    }*/
                    $GLOBALS["uploaded"] = 1;
                }else{
                    echoError("-1 (" . $fileName . ")");
                }
            }
            $directoryPath = photovideos . $GLOBALS["filesName"];
            if(file_exists($directoryPath)){
                $dirFilesQuantity = count(scandir($directoryPath)) - 2;
            }else{
                $dirFilesQuantity = 0;
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
                    }else{
                        exitError("-2 (" . $_POST["filelink"] . ")");
                    }
                    if(file_exists($tmp)){
                        unlink($tmp);
                    }
                }
            }
            if($GLOBALS["uploaded"]){
                if(isset($GLOBALS["uploadID"]) && ctype_digit($GLOBALS["uploadID"]) && isset($GLOBALS["uploadKey"])){
                    $id = $GLOBALS["uploadID"];
                    $key = $GLOBALS["uploadKey"];
                }else{
                $id = getKey(32/*, 1*/);
                    $secretIDpath = idsPath . $id;
                    file_put_contents($secretIDpath, $GLOBALS["filesName"]);
                    if(!file_exists($secretIDpath)){
                        echoError("-8");
                    }
                    $key = getKey(1000);
                    $keyPath = keysPath . $id;
                    file_put_contents($keyPath, password_hash($key, PASSWORD_DEFAULT));
                    if(!file_exists($keyPath)){
                        echoError("-5");
                    }
                }
                if($GLOBALS["htmlMode"])    {
                    if(isset($_POST["0"])){
                        include $_SERVER["DOCUMENT_ROOT"] . "/0/index.php";
                    }else{
                        define("maxDescriptionLength", 100000);
                        define("maxVoiceFileSize", 25000000);
                        $filesHTML = file_get_contents(htmlPath . "uploadfiles.html");
                        if(isset($GLOBALS["uploadID"])){
                            $filesHTML .= "<div style=\"border:1px solid #00ff00;padding:1px;\"><img width=\"16\" height=\"16\" src=\"/images/photovideo.svg\"> <string>files</string>; <string>uploadcompleted</string></div>";
                        }
                        $descriptionHTML = file_get_contents(htmlPath . "uploaddescription.html");
                        $descriptionHTML = str_replace("<php>MAX_DESCRIPTION_LENGTH</php>", maxDescriptionLength, $descriptionHTML);
                        $voiceHTML = file_get_contents(htmlPath . "uploadvoice.html");
                        $voiceHTML = str_replace("<php>MAX_VOICE_SIZE</php>", maxVoiceFileSize / 1000000, $voiceHTML);
                        $filesHTML = str_replace("value_id", $id, str_replace("value_key", $key, $filesHTML));
                        $descriptionHTML = str_replace("value_id", $id, str_replace("value_key", $key, $descriptionHTML));
                        $voiceHTML = str_replace("value_id", $id, str_replace("value_key", $key, $voiceHTML));
                        $uploadLocationAfterGot = !file_exists(locations . $GLOBALS["filesName"]);
                        ob_start();
                        include(phpPath . "locationjs.php");
                        $locationHTML = ob_get_clean();
                        if(isset($_POST["ps"]))    {
                            $psContent = file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/ps/index.php");
                            echo(str_replace("}label", "}label,.buttons", str_replace("</h1>", "</h1>" . $errorHTML . "<div style=\"border:2px solid #00ff00;\">upload completed<br><a href=\"../?view&n=" . $GLOBALS["filesName"] . "\">view upload</a></div>", substr($psContent, strpos($psContent, "<!DOCTYPE html>")))));
                            $filesHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $filesHTML);
                            $descriptionHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $descriptionHTML);
                            $voiceHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $voiceHTML);
                            echo '<div>' . setLanguage($filesHTML) . '<br>' . setLanguage($descriptionHTML) . '<br>' . setLanguage($voiceHTML) . '<br>' . $locationHTML . '</div>';
                        }else{
                            if($GLOBALS["lang"] != defaultLang)    {
                                $langget = "&lang=" . $GLOBALS["lang"];
                            }else{
                                $langget = "";
                            }
                            if(isset($_POST["submit"])){
                                $noscript = "noscript";
                                $filesHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $filesHTML);
                                $descriptionHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $descriptionHTML);
                                $voiceHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $voiceHTML);
                            }else{
                                $noscript = "";
                            }
                            $html = "<div class=\"boxs\">";
                            $html .= "<div class=\"texts\">#: " . $GLOBALS["filesName"] . "</div><div><label for=\"link" . $GLOBALS["filesName"] . "\"><img width=\"16\" height=\"16\" src=\"images/link.svg\"><span class=\"link title\"><string>link</string></span></label><input type=\"text\" readonly value=\"" . getMainWebAddress() . "/?view&n=" . $GLOBALS["filesName"] . "\" id=\"link" . $GLOBALS["filesName"] . "\"></div><a href=\"?view&n=" . $GLOBALS["filesName"] . $langget . "\" class=\"buttons afteruploadbuttons viewuploadsbuttons\"><img width=\"32\" height=\"32\" src=\"/images/viewicon.svg\">&nbsp;<span><string>viewupload</string></span></a><a href=\"?view&n=" . $GLOBALS["filesName"] . $langget . "\" target=\"_blank\" class=\"buttons afteruploadbuttons viewuploadsbuttons\"><img width=\"32\" height=\"32\" src=\"/images/viewicon.svg\">&nbsp;<span><string>viewupload</string></span>&nbsp;<img width=\"32\" height=\"32\" src=\"/images/newtab.svg\"></a><br><br>";
                            $html .= $filesHTML;
                            $html .= "<br><br>";
                            $html .= $descriptionHTML;
                            $html .= "<br><br>";
                            $html .= $voiceHTML;
                            $html .= "<br><br>";
                            $html .= $locationHTML;
                            $html .= "</div>";
                            $html = str_replace("<!--AFTER_UPLOAD-->", $html, str_replace("<!--UPLOAD_RESPONSE-->", $errorHTML . "<div class=\"texts\" style=\"border:1px solid #00ff00;padding:1px;\"><string>uploadcompleted</string></div><br>", file_get_contents(htmlPath . "index" . $noscript . ".html")));
                            $html = str_replace("<htmllang>lang</htmllang>", $GLOBALS["lang"], $html);
                            $html = setLanguage($html);
                            $html = str_replace("<php>LANG</php>", $langget, $html);
                            $html = str_replace("<php>langoptions</php>", getLangOptions(), $html);
                            echo $html;
                        }
                    }
                }
                else    {
                    if(isset($GLOBALS["uploadID"])){
                        echo "1";
                    }else{
                        echo '#' . $GLOBALS["filesName"] . '|' . $id . '|' . $key;
                    }
                }
            }
        }
        if(($GLOBALS["correct"] && $GLOBALS["uploaded"]) || !$GLOBALS["htmlMode"]){
            exit;
        }
    }
?>