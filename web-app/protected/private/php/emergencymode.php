<?php
    if(isset($_POST["emergencymode"]) && $_POST["emergencymode"] == "1"){
        if(isset($_POST["id"]) && isset($_POST["key"]) && ctype_alnum($_POST["id"]) && ctype_alnum($_POST["key"])){
            define("secretPath", protectedPrivatePath . "secret/");
            define("uploadSecretsPath", secretPath . "uploads/");
            define("idsPath", uploadSecretsPath . "ids/");
            define("keysPath", uploadSecretsPath . "keys/");
            $id = $_POST["id"];
            $key = $_POST["key"];
            $idPath = idsPath . $id;
            $keyPath = keysPath . $id;
            if(!(file_exists($idPath) && file_exists($keyPath) && password_verify($key, file_get_contents($keyPath))))    {
                exit;
            }
            define("upload", protectedPublicPath . "uploads/");
            define("uploadstrings", upload . "strings/");
            define("emergencymodes", uploadstrings . "emergencymodes/");
            // file_put_contents(emergencymodes . file_get_contents($idPath) . ".txt", time());
            $path = emergencymodes . file_get_contents($idPath) . ".txt";
            if(file_exists($path)){
                exit("-2");
            }
            if(file_put_contents($path, time())){
                echo "1";
            }else{
                echo "0";
            }
        }else{
            echo "-1";
        }
        exit;
    }
?>