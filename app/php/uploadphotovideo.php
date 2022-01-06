<?php
    define("upload", "../uploads/");
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
    if(isset($_FILES["file"]))    {
        if(empty($_FILES["file"]["tmp_name"]))    {
            exit("file is not chosen");
        }
        define("maxFileSize", 25000000);
        if(filesize($_FILES["file"]["tmp_name"]) > maxFileSize)    {
            exit("maximum file size is: " . (maxFileSize / 1000000) . "MB.");
        }
        $allowedExtensions = array(/*image*/"bmp", "gif", "ico", "jpg", "png",/* "svg",*/ "tif", "webp", /*video*/"avi", "mpeg", "ogv", "ts", "webm", "3gp", "3g2", "mp4");
        //$extension = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);
        $mimeContentType = mime_content_type($_FILES["file"]["tmp_name"]);
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
        if(move_uploaded_file($_FILES["file"]["tmp_name"], $path))  {
            $t = time();
            file_put_contents(photovideotimes . $filesQuantity . ".txt", $t);
            $key = getKey(1000);
            file_put_contents(protectedPrivateKeysPath . $filesQuantity, password_hash($key, PASSWORD_DEFAULT));
            //header("Location: view.php?n=" . $filesQuantity);
            if(isset($_POST["submit"]))    {
                echo str_replace("value_n", $filesQuantity, str_replace("value_key", $key, file_get_contents("../html/uploaddescription.html")));
            }
            else    {
                echo $filesQuantity . '|' . $key;
            }
        }
    }
?>