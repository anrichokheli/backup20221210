<?php
    if(strpos($_SERVER["REQUEST_URI"], /*"/" . basename(getcwd()) . */"/?") === 0)    {
        if(strpos($_SERVER["REQUEST_URI"], "&") !== FALSE)    {
            $_GET["n"] = substr($_SERVER["REQUEST_URI"], /*6*/2, strpos($_SERVER["REQUEST_URI"], "&") - 2);
        }
        else    {
            $_GET["n"] = substr($_SERVER["REQUEST_URI"], /*6*/2);
        }
        include("php/view.php");
        exit;
    }
    include("php/uploadphotovideo.php");
    include("php/uploadstring.php");
    include("php/uploadvoice.php");
    include("html/indexjs.html");
?>