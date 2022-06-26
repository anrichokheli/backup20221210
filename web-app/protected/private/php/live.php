<?php
    if(isset($_GET["live"]) && $_GET["live"] == "1"){
        define("upload", protectedPublicPath . "uploads/");
        define("uploadfiles", upload . "files/");
        define("livevideos", upload . "livevideos/");
        define("secretPath", protectedPrivatePath . "secret/");
        define("liveSecretsPath", secretPath . "live/");
        define("liveIdsPath", liveSecretsPath . "ids/");
        define("liveKeysPath", liveSecretsPath . "keys/");
        if(isset($_GET["setup"]) && $_GET["setup"] == "1"){
            function getID(){
                $t = microtime();
                $t = explode(" ", $t);
                return $t[1] . substr($t[0], 2, -2);
            }
            function getKey($n)   {
                $key = "";
                for($i = 0; $i < $n; $i++)   {
                    $mode = random_int(0, 2);
                    if($mode == 0){
                        $key .= random_int(0, 9);
                    }else if($mode == 1){
                        $key .= chr(random_int(65, 90));
                    }else{
                        $key .= chr(random_int(97, 122));
                    }
                }
                return $key;
            }
            $n = getID();
            $id = getKey(32);
            $key = getKey(1000);
            file_put_contents(livevideos . $n . ".webm", "");
            file_put_contents(liveIdsPath . $id, $n);
            file_put_contents(liveKeysPath . $id, password_hash($key, PASSWORD_DEFAULT));
            if(file_exists(livevideos . $n . ".webm") && file_exists(liveIdsPath . $id) && file_exists(liveKeysPath . $id)){
                echo "#" . $n . "|" . $id . "|" . $key;
            }else{
                echo "0";
            }
        }else{
            if(isset($_POST["id"]) && isset($_POST["key"]) && ctype_alnum($_POST["id"]) && ctype_alnum($_POST["key"]) && file_exists(liveIdsPath . $_POST["id"]) && file_exists(liveKeysPath . $_POST["id"]) && password_verify($_POST["key"], file_get_contents(liveKeysPath . $_POST["id"]))){
                $fileResource = fopen(livevideos . file_get_contents(liveIdsPath . $_POST["id"]) . ".webm", "a");
                if(fwrite($fileResource, file_get_contents($_FILES["chunk"]["tmp_name"]))){
                    echo "1";
                }else{
                    echo "-2";
                }
                fclose($fileResource);
            }else{
                echo "-1";
            }
        }
        exit;
    }
?>