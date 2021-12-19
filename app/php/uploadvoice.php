<?php
    define("upload", "../uploads/");
    define("uploadfiles", upload . "files/");
    define("uploadstrings", upload . "strings/");
    define("voices", uploadfiles . "voices/");
    define("voicetimes", uploadstrings . "voicetimes/");
    define("protectedPrivateKeysPath", dirname($_SERVER["DOCUMENT_ROOT"]) . "/protected/private/keys/");
    if(!empty($_FILES["voice"]["tmp_name"]) && isset($_POST["n"]) && isset($_POST["key"]) && ctype_digit($_POST["n"]) && ctype_digit($_POST["key"]))    {
        $keyPath = protectedPrivateKeysPath . $_POST["n"];
        if(!file_exists($keyPath))    {
            exit("-1");
        }
        if(!password_verify($_POST["key"], file_get_contents($keyPath)))    {
            exit("-2");
        }
        $allowedExtensions = array("mp3", "wav", "ogg", "m4a");
        $extension = pathinfo($_FILES["voice"]["name"], PATHINFO_EXTENSION);
        if(!in_array($extension, $allowedExtensions))    {
            exit("allowed extensions are: " . implode(", ", $allowedExtensions) . '.');
        }
        $voicepath = voices . $_POST["n"] . '.' . $extension;
        if(file_exists($voicepath))    {
            exit("-3");
        }
        if(move_uploaded_file($_FILES["voice"]["tmp_name"], $voicepath))  {
            $t = time();
            file_put_contents(voicetimes . $_POST["n"] . ".txt", $t);
            echo("1");
        }
    }
    else    {
        echo("0");
    }
?>