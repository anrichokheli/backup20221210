<?php
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
define("secretPath", protectedPrivatePath . "secret/");
define("keysPath", secretPath . "keys/");
define("tmpPath", protectedPrivatePath . "tmp/");
function createDirectoryIfNotExists($path)    {
    if(!file_exists($path))
        mkdir($path, 0777, true);
}
createDirectoryIfNotExists(photovideos);
createDirectoryIfNotExists(photovideotimes);
createDirectoryIfNotExists(descriptiontimes);
createDirectoryIfNotExists(locationtimes);
createDirectoryIfNotExists(voicetimes);
createDirectoryIfNotExists(descriptions);
createDirectoryIfNotExists(locations);
createDirectoryIfNotExists(voices);
createDirectoryIfNotExists(keysPath);
createDirectoryIfNotExists(tmpPath);
rename(phpPath . "setup.php", phpPath . "setup.php.txt");
?>