<?php
    if(isset($_GET["live"]) && $_GET["live"] == "1"){
        define("upload", protectedPublicPath . "uploads/");
        define("uploadfiles", upload . "files/");
        define("livevideos", upload . "livevideos/");
        define("secretPath", protectedPrivatePath . "secret/");
        define("liveSecretsPath", secretPath . "live/");
        define("liveIdsPath", liveSecretsPath . "ids/");
        define("liveKeysPath", liveSecretsPath . "keys/");
        define("uploadstrings", upload . "strings/");
        define("photovideos", uploadfiles . "photovideos/");
        define("photovideotimes", uploadstrings . "photovideotimes/");
        define("uploadSecretsPath", secretPath . "uploads/");
        define("idsPath", uploadSecretsPath . "ids/");
        define("keysPath", uploadSecretsPath . "keys/");
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
            $live_n = getID();
            $live_id = getKey(32);
            $live_key = getKey(1000);
            file_put_contents(livevideos . $live_n . ".webm", "");
            file_put_contents(liveIdsPath . $live_id, $live_n);
            file_put_contents(liveKeysPath . $live_id, password_hash($live_key, PASSWORD_DEFAULT));
            $n = getID();
            $id = getKey(32);
            $key = getKey(1000);
            $dirPath = photovideos . $n . "/";
            $t = time();
            if(mkdir($dirPath)){
                $mysqliConn = parse_ini_file(protectedPrivatePath . "mysqliconn.ini");
                $serverName = $mysqliConn["serverName"];
                $userName = $mysqliConn["userName"];
                $password = $mysqliConn["password"];
                $dbname = $mysqliConn["dbname"];
                $conn = mysqli_connect($serverName, $userName, $password, $dbname);
                if($conn){
                    $stmt = $conn->prepare("INSERT INTO uploads (filepath, filetime) VALUES (?, ?)");
                    $stmt->bind_param("si", $n, $t);
                    $stmt->execute();
                    $stmt->close();
                    mysqli_close($conn);
                } 
            }
            file_put_contents($dirPath . $live_n, "");
            // $t = time();
            $dirPath = photovideotimes . $n . '/';
            if(!file_exists($dirPath)){
                mkdir($dirPath);
            }
            file_put_contents($dirPath . getID() . ".txt", $t);
            file_put_contents(idsPath . $id, $n);
            file_put_contents(keysPath . $id, password_hash($key, PASSWORD_DEFAULT));
            if(file_exists(livevideos . $live_n . ".webm") && file_exists(liveIdsPath . $live_id) && file_exists(liveKeysPath . $live_id)){
                echo "#" . $live_n . "|" . $live_id . "|" . $live_key . "|" . $n . "|" . $id . "|" . $key;
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
                move_uploaded_file($_FILES["chunk"]["tmp_name"], livevideos . file_get_contents(liveIdsPath . $_POST["id"]) . "lastlivechunk");
            }else{
                echo "-1";
            }
        }
        exit;
    }
?>