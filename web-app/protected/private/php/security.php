<?php
    define("userKeys", protectedPrivatePath . "secret/userkeys/");
    define("securityData", protectedPrivatePath . "securitydata/");
    define("uploadminmicrointerval", 50000);
    define("uploadblockinterval", 10000);
    if(!empty($_COOKIE["id"]) && ctype_digit($_COOKIE["id"]) && !empty($_COOKIE["key"]) && file_exists(userKeys . $_COOKIE["id"]) && password_verify($_COOKIE["key"], file_get_contents(userKeys . $_COOKIE["id"]))){
        if(isset($_FILES["photovideo"]) || isset($_POST["filelink"])){
            $securitydataArray = unserialize(file_get_contents(securityData . $_COOKIE["id"]));
            if((isset($securitydataArray[0]) && !$securitydataArray[0]) || !isset($securitydataArray[0])){
                $exitString = "BLOCKED";
            }else if(microtime(1) * 1000000 - $securitydataArray[1] < uploadblockinterval){
                $exitString = "TOO MANY UPLOADS IN PERIOD; BLOCKED";
                $securitydataArray[0] = 0;
            }else if(microtime(1) * 1000000 - $securitydataArray[1] < uploadminmicrointerval){
                $exitString = "TOO MANY UPLOADS IN PERIOD";
            }
            $securitydataArray[1] = microtime(1) * 1000000;
            file_put_contents(securityData . $_COOKIE["id"], serialize($securitydataArray));
            if(!empty($exitString)){
                http_response_code(403);
                exit($exitString);
            }
        }
    }else{
        function securitydataSetup(){
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
            $id = hrtime(1) . random_int(0, 9);
            $key = getKey(1000);
            file_put_contents(userKeys . $id, password_hash($key, PASSWORD_DEFAULT));
            file_put_contents(securityData . $id, serialize([1, 0]));
            setcookie("id", $id, time() + (86400 * 1000), "/");
            setcookie("key", $key, time() + (86400 * 1000), "/");
        }
        define("captchaimages", protectedPrivatePath . "captchaimages/");
        session_start();
        function createCaptcha(){
            $langJSON = $GLOBALS["langJSON"];
            for($i = 0; $i < 9; $i++){
                $_SESSION["captcha" . $i] = "";
            }
            $_SESSION["captcha" . random_int(0, 8)] = 0;
            for($i = 0; $i < 9; $i++){
                if($_SESSION["captcha" . $i] != 0){
                    $_SESSION["captcha" . $i] = random_int(0, count(scandir(captchaimages)) - 3);
                }
            }
            function getCaptchaImage($n){
                $path = captchaimages . $_SESSION["captcha" . $n];
                $img0 = imagecreatetruecolor(128, 128);
                for($i = 0; $i < 128; $i+=4){
                    for($j = 0; $j < 128; $j+=4){
                        imagesetpixel($img0, $i, $j, imagecolorallocate($img0, random_int(0, 255), random_int(0, 255), random_int(0, 255)));
                        imagesetpixel($img0, random_int(0, 127), random_int(0, 127), imagecolorallocate($img0, random_int(0, 255), random_int(0, 255), random_int(0, 255)));
                    }
                }
                $img1 = imagecreatefrompng($path);
                imagecopymerge($img1, $img0, 0, 0, 0, 0, 128, 128, 50);
                ob_start();
                imagepng($img1);
                echo "data:image/png;base64," . base64_encode(ob_get_clean());
            }
            include(phpPath . "securityhtml.php");
            exit;
        }
        if(!defined("nocaptcha")){
            if(isset($_POST["submit"])){
                $correct = 1;
                for($i = 0; $i < 9; $i++){
                    if(!((($_SESSION["captcha" . $i] == 0) && isset($_POST["captcha" . $i])) || (($_SESSION["captcha" . $i] != 0) && !isset($_POST["captcha" . $i])))){
                        $correct = 0;
                        break;
                    }
                }
                if($correct){
                    securitydataSetup();
                    session_destroy();
                }else{
                    createCaptcha();
                }
                header("Location: " . $_SERVER["REQUEST_URI"]);
            }else{
                createCaptcha();
            }
        }
    }
?>