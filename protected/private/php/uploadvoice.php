<?php
    if(!empty($_FILES["voice"]["tmp_name"]) && isset($_POST["n"]) && isset($_POST["key"]) && ctype_digit($_POST["n"]) && ctype_digit($_POST["key"]))    {
        define("upload", protectedPublicPath . "uploads/");
        define("uploadfiles", upload . "files/");
        define("uploadstrings", upload . "strings/");
        define("voices", uploadfiles . "voices/");
        define("voicetimes", uploadstrings . "voicetimes/");
        define("secretPath", protectedPrivatePath . "secret/");
        define("keysPath", secretPath . "keys/");
        $keyPath = keysPath . $_POST["n"];
        if(!file_exists($keyPath))    {
            exit("-1");
        }
        if(!password_verify($_POST["key"], file_get_contents($keyPath)))    {
            exit("-2");
        }
        $allowedExtensions = array("avi", "mpeg", "ogv", "ts", "webm", "3gp", "3g2", "aac", "mp3", "oga", "opus", "wav", "weba", "mp4");
        //$extension = pathinfo($_FILES["voice"]["name"], PATHINFO_EXTENSION);
        $mimeContentType = mime_content_type($_FILES["voice"]["tmp_name"]);
        if(!$mimeContentType || (strpos($mimeContentType, '/') === FALSE))exit("-4");
        $file_info_array = explode("/", $mimeContentType);
        $type = $file_info_array[0];
        $extension = $file_info_array[1];
        if($extension === "x-msvideo")	{
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
        else if($extension === "mpeg")	{
            $extension = "mp3";
        }
        else if($extension === "ogg")	{
            $extension = "oga";
        }
        else if($extension === "webm")	{
            $extension = "weba";
        }
        if(($type !== "audio") && ($type !== "video"))    {
            exit("only audio files are allowed.");
        }
        if(!in_array($extension, $allowedExtensions))    {
            exit("allowed extensions are: " . implode(", ", $allowedExtensions) . '.');
        }
        $voicepath = voices . $_POST["n"] . '.' . $extension;
        if(file_exists($voicepath))    {
            exit("-3");
        }
        if(move_uploaded_file($_FILES["voice"]["tmp_name"], $voicepath))  {
            $t = time();
            if(!file_put_contents(voicetimes . $_POST["n"] . ".txt", $t)){
                echo("-6");
            }
            if(isset($_POST["submit"]) || isset($_POST["ps"]))    {
                if(!file_exists(uploadstrings . "descriptions/" . $_POST["n"] . ".txt"))    {
                    $descriptionHTML = file_get_contents(htmlPath . "uploaddescription.html");
                    $descriptionHTML = str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], $descriptionHTML));
                }
                else    {
                    $descriptionHTML = "<div style=\"border:1px solid #00ff00;padding:1px;\"><img width=\"16\" height=\"16\" src=\"/images/description.svg\"> <string>description</string>; <string>uploadcompleted</string></div>";
                }
                if(!file_exists(glob(voices . $_POST["n"] . ".*")[0]))    {
                    $voiceHTML = file_get_contents(htmlPath . "uploadvoice.html");
                    $voiceHTML = str_replace("value_n", $_POST["n"], str_replace("value_key", $_POST["key"], $voiceHTML));
                }
                else    {
                    $voiceHTML = "<div style=\"border:1px solid #00ff00;padding:1px;\"><img width=\"16\" height=\"16\" src=\"/images/microphone.svg\"> <string>voice</string>; <string>uploadcompleted</string></div>";
                }
                if(isset($_POST["ps"])){
                    echo(str_replace("</h1>", "</h1><div style=\"border:2px solid #00ff00;\">upload completed<br><a href=\"../?" . $_POST["n"] . "\">view upload</a></div>", file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/ps/index.php")));
                    $descriptionHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $descriptionHTML);
                    $voiceHTML = str_replace("</form>", "<input type=\"hidden\" name=\"ps\"></form>", $voiceHTML);
                    echo '<div id="afterupload">' . setLanguage($descriptionHTML) . '<br>' . setLanguage($voiceHTML) . '</div>';
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
                        $descriptionHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $descriptionHTML);
                        $voiceHTML = str_replace("<form", "<form action=\"?noscript" . $langget . "\"", $voiceHTML);
                    }else{
                        $noscript = "";
                    }
                    $html = "<div class=\"boxs texts\">";
                    $html .= "<div class=\"texts\">#: " . $_POST["n"] . "</div><a href=\"?" . $_POST["n"] . $langget . "\" class=\"buttons afteruploadbuttons viewuploadsbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;<span><string>viewupload</string></span></a><a href=\"?" . $_POST["n"] . $langget . "\" target=\"_blank\" class=\"buttons afteruploadbuttons viewuploadsbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;<span><string>viewupload</string></span>&nbsp;<img width=\"32\" height=\"32\" src=\"images/open.svg\"></a><br><br>";
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
            exit("-5");
        }
        exit;
    }
?>