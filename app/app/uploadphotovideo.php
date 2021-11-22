<?php
    define("uploads", "uploads/");
    define("maxFilesQuantity", 100);
    if(!file_exists(uploads))
            mkdir(uploads);
    $filesQuantity = count(scandir(uploads)) - 2;
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
        $path = uploads . $filesQuantity . '.' . $extension;
        if(move_uploaded_file($_FILES["file"]["tmp_name"], $path))  {
            header("Location: " . $path);
        }
    }
?>