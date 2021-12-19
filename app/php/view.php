<?php
    /*echo "#: " . basename(getcwd());
    echo "<br><br>";
    echo "<a href=\"" . glob("f.*")[0] . "\" target=\"_blank\">view uploaded file</a>";
    echo "<br><br>";
    echo "<a href=\"../../\" target=\"_blank\">open main page</a>";*/
    define("upload", "../uploads/");
    define("uploadfiles", upload . "files/");
    define("uploadstrings", upload . "strings/");
    define("photovideos", uploadfiles . "photovideos/");
    define("photovideotimes", uploadstrings . "photovideotimes/");
    define("descriptiontimes", uploadstrings . "descriptiontimes/");
    define("descriptions", uploadstrings . "descriptions/");
    define("locations", uploadstrings . "locations/");
    define("locationtimes", uploadstrings . "locationtimes/");
    define("voices", uploadfiles . "voices/");
    define("voicetimes", uploadstrings . "voicetimes/");
    function echoString($dataPath, $timePath, $n)  {
        $localTimePath = $timePath . $n . ".txt";
        if(file_exists($localTimePath))    {
            $path = $dataPath . $n . ".txt";
            echo "<br><br>";
            echo "<a href=\"" . $path . "\" target=\"_blank\">" . basename($path) . "</a>";
            echo "<br><br>";
            echo date("Y-m-d H:i:s", file_get_contents($timePath . $n . ".txt"));
        }
    }
    function echoFile($filePath, $timePath, $n) {
        $path = glob($filePath . $n . ".*")[0];
        echo "<br><br>";
        if(file_exists($path))    {
            echo "<a href=\"" . $path . "\" target=\"_blank\">" . basename($path) . "</a>";
            echo "<br><br>";
            echo date("Y-m-d H:i:s", file_get_contents($timePath . $n . ".txt"));
        }
        else    {
            echo("not exists");
        }
    }
    function getData($n, $a)  {
        echo "<div class=\"a\">";
        if($a)
            echo "<a href=\"view.php?n=" . $n . "\" target=\"_blank\">";
        echo "#: " . $n;
        if($a)
            echo "</a>";
        echoFile(photovideos, photovideotimes, $n);
        echoString(descriptions, descriptiontimes, $n);
        echoString(locations, locationtimes, $n);
        echoFile(voices, voicetimes, $n);
        //echo "<a href=\"../\" target=\"_blank\">open main page</a>";
        echo "</div>";
    }
    echo "<!DOCTYPE html><html><head><style>#main{display:flex;flex-direction:column;align-items:center;}</style><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></head><body><div id=\"main\">";
    echo "<style>.a{font-size:25px;border:solid 2px #0000ff;border-radius:4px;padding:1%;margin:1%;width:90%;text-align:center;}</style>";
    if(isset($_GET["n"]) && ctype_digit($_GET["n"]))    {
        /*if(!ctype_digit($n))    {
            exit("parameter is not id");
        }*/
        echo getData($_GET["n"], 0);
    }
    else    {
        $filesQuantity = count(scandir(photovideos)) - 2;
        /*for ($i = 0; $i < $filesQuantity; $i++) {
            echo getData($i, 1);
        }*/
        for ($i = $filesQuantity - 1; $i >= 0; $i--) {
            echo getData($i, 1);
        }
    }
    echo "</div></body></html>";
?>