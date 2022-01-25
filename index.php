<?php
    if(strpos($_SERVER["REQUEST_URI"], /*"/" . basename(getcwd()) . */"/?") === 0)    {
        $_GET["n"] = substr($_SERVER["REQUEST_URI"], 6);
        include("php/view.php");
        exit;
    }
    include("php/uploadphotovideo.php");
    include("php/uploadstring.php");
    include("php/uploadvoice.php");
    include("html/indexjs.html");
?>