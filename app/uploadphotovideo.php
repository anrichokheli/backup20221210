<?php
    define("uploadfiles", "uploads/files/");
    define("maxFilesQuantity", 100);
    if(!file_exists(uploadfiles))
            mkdir(uploadfiles);
    $filesQuantity = count(scandir(uploadfiles)) - 2;
    if($filesQuantity >= maxFilesQuantity)    {
        exit("server total files quantity limit: " . maxFilesQuantity);
    }
    if(isset($_POST["submit"]))    {
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
            header("Location: view.php?n=" . $filesQuantity);
        }
    }
?>