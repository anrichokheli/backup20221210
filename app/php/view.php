<?php
    /*echo "#: " . basename(getcwd());
    echo "<br><br>";
    echo "<a href=\"" . glob("f.*")[0] . "\" target=\"_blank\">view uploaded file</a>";
    echo "<br><br>";
    echo "<a href=\"../../\" target=\"_blank\">open main page</a>";*/
    define("uploadfiles", "../uploads/files/");
    echo "<!DOCTYPE html><html><head><style>#main{display:flex;flex-direction:column;align-items:center;}</style><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></head><body><div id=\"main\">";
    if(isset($_GET["n"]) && ctype_digit($_GET["n"]))    {
        $n = $_GET["n"];
        /*if(!ctype_digit($n))    {
            exit("parameter is not id");
        }*/
        echo "#: " . $n;
        $path = glob(uploadfiles . $n . ".*")[0];
        if(file_exists($path))    {
            echo "<br><br>";
            echo "<a href=\"" . $path . "\" target=\"_blank\">view uploaded file</a>";
        }
        else    {
            exit("not exists");
        }
        echo "<br><br>";
        echo "<a href=\"../\" target=\"_blank\">open main page</a>";
    }
    else    {
        $filesQuantity = count(scandir(uploadfiles)) - 2;
        for ($i=0; $i < $filesQuantity; $i++) {
            echo "<a href=\"view.php?n=" . $i . "\">" . $i . "</a><br>";
        }
    }
    echo "</div></body></html>";
?>