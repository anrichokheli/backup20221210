<?php
    if(ctype_digit($_GET["download"])){
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
        if(file_exists(photovideos . $_GET["download"])){
            ignore_user_abort(TRUE);
            define("tmpPath", protectedPrivatePath . "tmp/");
            $zipFileName = tmpPath . hrtime(1) . ".zip";
            $zip = new ZipArchive();
            if($zip->open($zipFileName, ZipArchive::CREATE)===TRUE){
                $zip->addFromString("id.txt", $_GET["download"]);
                function getT($path){
                    $t = file_get_contents($path);
                    $datetime = date("Y-m-d H:i:s", $t);
                    $timezone = date('O');
                    return $datetime . ";\n" . $timezone . ";\n" . $t;
                }
                $zipphotovideos = "photovideos";
                $zip->addEmptyDir($zipphotovideos);
                $pvdirpath = photovideos . $_GET["download"];
                $pvfiles = array_slice(scandir($pvdirpath), 2);
                foreach($pvfiles as $file){
                    $zip->addFile($pvdirpath . "/" . $file, $zipphotovideos . "/" . $file);
                }
                $zipphotovideotimes = "photovideotimes";
                $zip->addEmptyDir($zipphotovideotimes);
                $pvtdirpath = photovideotimes . $_GET["download"];
                $pvtfiles = array_slice(scandir($pvtdirpath), 2);
                foreach($pvtfiles as $file){
                    $zip->addFromString($zipphotovideotimes . "/" . $file, getT($pvtdirpath . "/" . $file));
                }
                $locationpath = locations . $_GET["download"] . ".txt";
                if(file_exists($locationpath)){
                    $zip->addFile($locationpath, "location.txt");
                    $zip->addFromString("locationtime.txt", getT(locationtimes . $_GET["download"] . ".txt"));
                }
                $descriptionpath = descriptions . $_GET["download"] . ".txt";
                if(file_exists($descriptionpath)){
                    $zip->addFile($descriptionpath, "description.txt");
                    $zip->addFromString("descriptiontime.txt", getT(descriptiontimes . $_GET["download"] . ".txt"));
                }
                $vtimePath = voicetimes . $_GET["download"] . ".txt";
                if(file_exists($vtimePath))    {
                    $voicePath = glob(voices . $_GET["download"] . ".*")[0];
                    $zip->addFile($voicePath, "voice." . pathinfo($voicePath, PATHINFO_EXTENSION));
                    $zip->addFromString("voicetime.txt", getT($vtimePath));
                }
                $zip->close();
                header("Content-Type: " . mime_content_type($zipFileName));
                header('Content-Disposition: attachment; filename="' . $_GET["download"] . '.zip"');
                header("Content-Length: " . filesize($zipFileName));
                echo(file_get_contents($zipFileName));
                unlink($zipFileName);
                exit;
            }
        }
    }
?>