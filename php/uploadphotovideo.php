<?php
    if(isset($_FILES["photovideo"]))    {
        define("upload", "uploads/");
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
        define("maxFilesQuantity", 100);
        define("protectedPrivateKeysPath", dirname($_SERVER["DOCUMENT_ROOT"]) . "/protected/private/keys/");
        function createDirectoryIfNotExists($path)    {
            if(!file_exists($path))
                mkdir($path, 0777, true);
        }
        function getKey($n)   {
            $key = "";
            for($i = 0; $i < $n; $i++)   {
                //$key .= chr(random_int(0, 255));
                $key .= random_int(0, 9);
            }
            return $key;
        }
        createDirectoryIfNotExists(photovideos);
        createDirectoryIfNotExists(photovideotimes);
        createDirectoryIfNotExists(descriptiontimes);
        createDirectoryIfNotExists(locationtimes);
        createDirectoryIfNotExists(voicetimes);
        createDirectoryIfNotExists(descriptions);
        createDirectoryIfNotExists(locations);
        createDirectoryIfNotExists(voices);
        createDirectoryIfNotExists(protectedPrivateKeysPath);
        $filesQuantity = count(scandir(photovideos)) - 2;
        if($filesQuantity >= maxFilesQuantity)    {
            exit("server total files quantity limit: " . maxFilesQuantity);
        }
        if(empty($_FILES["photovideo"]["tmp_name"]))    {
            exit("file is not chosen");
        }
        define("maxFileSize", 25000000);
        if(filesize($_FILES["photovideo"]["tmp_name"]) > maxFileSize)    {
            exit("maximum file size is: " . (maxFileSize / 1000000) . "MB.");
        }
        $allowedExtensions = array(/*image*/"bmp", "gif", "ico", "jpg", "png",/* "svg",*/ "tif", "webp", /*video*/"avi", "mpeg", "ogv", "ts", "webm", "3gp", "3g2", "mp4");
        //$extension = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);
        $mimeContentType = mime_content_type($_FILES["photovideo"]["tmp_name"]);
        if(!$mimeContentType || (strpos($mimeContentType, '/') === FALSE))exit("0");
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
            exit("only images and videos are allowed.");
        }
        if(!in_array($extension, $allowedExtensions))    {
            exit("allowed extensions are: " . implode(", ", $allowedExtensions) . '.');
        }
        //$folderPath = uploads . $filesQuantity . '/';
        //mkdir($folderPath);
        //file_put_contents($folderPath . "index.php", "<?php include dirname(dirname(getcwd())).\"/v.php\";");
        $path = photovideos . $filesQuantity . '.' . $extension;
        if(move_uploaded_file($_FILES["photovideo"]["tmp_name"], $path))  {
            $t = time();
            file_put_contents(photovideotimes . $filesQuantity . ".txt", $t);
            if(isset($_POST["ps"]))    {
                exit(str_replace("</h1>", "</h1><div style=\"border:2px solid #00ff00;\">upload completed<br><a target=\"_blank\" href=\"?" . $filesQuantity . "\">view upload</a></div>", file_get_contents("ps/index.html")));
            }
            $key = getKey(1000);
            file_put_contents(protectedPrivateKeysPath . $filesQuantity, password_hash($key, PASSWORD_DEFAULT));
            //header("Location: view.php?n=" . $filesQuantity);
            if(isset($_POST["submit"]))    {
                $html = "<div class=\"boxs\">";
                $html .= "<div class=\"texts\">#: " . $filesQuantity . "</div><a href=\"?" . $filesQuantity . "&noscript\" target=\"_blank\" class=\"buttons afteruploadbuttons viewuploadsbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;<string>viewupload</string></a><br><br>";
                $html .= str_replace("value_n", $filesQuantity, str_replace("value_key", $key, file_get_contents("html/uploaddescription.html")));
                $html .= "<br><br>";
                $html .= str_replace("value_n", $filesQuantity, str_replace("value_key", $key, file_get_contents("html/uploadvoice.html")));
                $html .= "</div>";
                $html = str_replace("<!--AFTER_UPLOAD-->", $html, str_replace("<!--UPLOAD_RESPONSE-->", "<div class=\"texts\" style=\"border:1px solid #00ff00;padding:1px;\"><string>uploadcompleted</string></div><br>", file_get_contents("html/indexnoscript.html")));
                $html = str_replace("<htmllang>lang</htmllang>", $lang, $html);
                $html = setLanguage($html);
                if($lang != defaultLang)    {
                    $html = str_replace("action=\"?noscript\"", "action=\"?noscript&lang=" . $lang . "\"", $html);
                    $html = str_replace("&noscript", "&noscript&lang=" . $lang, $html);
                    $langget = "&lang=" . $lang;
                }else{
                    $langget = "";
                }
                $html = str_replace("<php>LANG</php>", $langget, $html);
                echo $html;
            }
            else    {
                echo '#' . $filesQuantity . '|' . $key;
            }
        }
        exit;
    }
?>