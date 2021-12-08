<?php
    define("upload", "../uploads/");
    define("uploadfiles", upload . "files/");
    define("uploadstrings", upload . "strings/");
    define("filetimes", uploadstrings . "filetimes/");
    define("descriptiontimes", uploadstrings . "descriptiontimes/");
    define("locationtimes", uploadstrings . "locationtimes/");
    define("descriptions", uploadstrings . "descriptions/");
    define("locations", uploadstrings . "locations/");
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
    createDirectoryIfNotExists(uploadfiles);
    createDirectoryIfNotExists(filetimes);
    createDirectoryIfNotExists(descriptiontimes);
    createDirectoryIfNotExists(locationtimes);
    createDirectoryIfNotExists(descriptions);
    createDirectoryIfNotExists(locations);
    createDirectoryIfNotExists(protectedPrivateKeysPath);
    $filesQuantity = count(scandir(uploadfiles)) - 2;
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
        $extension = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);
        if(!in_array($extension, $allowedExtensions))    {
            exit("allowed extensions are: " . implode(", ", $allowedExtensions) . '.');
        }
        //$folderPath = uploads . $filesQuantity . '/';
        //mkdir($folderPath);
        //file_put_contents($folderPath . "index.php", "<?php include dirname(dirname(getcwd())).\"/v.php\";");
        $path = uploadfiles . $filesQuantity . '.' . $extension;
        if(move_uploaded_file($_FILES["file"]["tmp_name"], $path))  {
            $t = time();
            file_put_contents(filetimes . $filesQuantity . ".txt", $t);
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