<?php
    /*echo "#: " . basename(getcwd());
    echo "<br><br>";
    echo "<a href=\"" . glob("f.*")[0] . "\" target=\"_blank\">view uploaded file</a>";
    echo "<br><br>";
    echo "<a href=\"../../\" target=\"_blank\">open main page</a>";*/
    if(isset($_GET["n"]))    {
        $n = $_GET["n"];
        if(!ctype_digit($n))    {
            exit("parameter is not id");
        }
        echo "#: " . $n;
        $path = glob("uploads/files/" . $n . ".*")[0];
        if(file_exists($path))    {
            echo "<br><br>";
            echo "<a href=\"" . $path . "\" target=\"_blank\">view uploaded file</a>";
        }
        else    {
            exit("not exists");
        }
        echo "<br><br>";
        echo "<a href=\".\" target=\"_blank\">open main page</a>";
    }
?>