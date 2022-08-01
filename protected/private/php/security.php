<?php
    define("userKeys", protectedPrivatePath . "secret/userkeys/");
    define("securityData", protectedPrivatePath . "securitydata/");
    //define("uploadminmicrointerval", 50000);
    //define("uploadblockinterval", 10000);
    define("maxuploadsperinterval", 1000);
    define("uploadcountresetinterval", 60);
    define("maxuploadsperintervalblock", 2000);
    if(!empty($_COOKIE["id"]) && ctype_alnum($_COOKIE["id"]) && ctype_alnum($_COOKIE["key"]) && !empty($_COOKIE["key"]) && file_exists(userKeys . $_COOKIE["id"]) && password_verify($_COOKIE["key"], file_get_contents(userKeys . $_COOKIE["id"]))){
        if(isset($_FILES["photovideo"]) || isset($_POST["filelink"]) || (isset($_POST["id"]) && isset($_POST["key"]))){
            $securitydataArray = unserialize(file_get_contents(securityData . $_COOKIE["id"]));
            if((isset($securitydataArray[0]) && !$securitydataArray[0]) || !isset($securitydataArray[0])){
                http_response_code(403);
                exit("BLOCKED");
            }/*else if(microtime(1) * 1000000 - $securitydataArray[1] < uploadblockinterval){
                $exitString = "TOO MANY UPLOADS IN PERIOD; BLOCKED";
                $securitydataArray[0] = 0;
            }else if(microtime(1) * 1000000 - $securitydataArray[1] < uploadminmicrointerval){
                $exitString = "TOO MANY UPLOADS IN PERIOD";
            }*/
            //$securitydataArray[1] = microtime(1) * 1000000;
            if(++$securitydataArray[2] > maxuploadsperinterval){
                $exitString = "TOO MANY UPLOADS IN PERIOD";
                if($securitydataArray[2] > maxuploadsperintervalblock){
                    $exitString = "TOO MANY UPLOADS IN PERIOD; BLOCKED";
                    $securitydataArray[0] = 0;
                }
            }
            if(time() - $securitydataArray[1] >= uploadcountresetinterval){
                $securitydataArray[2] = 0;
                $securitydataArray[1] = time();
            }
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
            //$id = hrtime(1) . random_int(0, 9);
            $id = getKey(32);
            $key = getKey(1000);
            file_put_contents(userKeys . $id, password_hash($key, PASSWORD_DEFAULT));
            file_put_contents(securityData . $id, serialize([1, 0, 0]));
            setcookie("id", $id, time() + (86400 * 1000), "/", "", "", TRUE);
            setcookie("key", $key, time() + (86400 * 1000), "/", "", "", TRUE);
        }
        define("captchaimages", protectedPrivatePath . "captchaimages/");
        session_set_cookie_params(array("httponly"=>TRUE));
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
                $img1 = imagecreatefrompng($path);
                $randomQuantity = random_int(2, 10);
                for($i = 0; $i < $randomQuantity; $i++){
                    $x0 = random_int(0, 127);
                    $y0 = random_int(0, 127);
                    $x1 = $x0 + random_int(10, 20);
                    $y1 = $y0 + random_int(10, 20);
                    imagefilledrectangle($img1, $x0, $y0, $x1, $y1, imagecolorallocate($img1, random_int(0, 255), random_int(0, 255), random_int(0, 255)));
                }
                $img0 = imagecreatetruecolor(128, 128);
                for($i = 0; $i < 128; $i+=4){
                    for($j = 0; $j < 128; $j+=4){
                        imagesetpixel($img0, $i, $j, imagecolorallocate($img0, random_int(0, 255), random_int(0, 255), random_int(0, 255)));
                        imagesetpixel($img0, random_int(0, 127), random_int(0, 127), imagecolorallocate($img0, random_int(0, 255), random_int(0, 255), random_int(0, 255)));
                    }
                }
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
                    if(isset($_SESSION["captcha" . $i])){
                        if(!((($_SESSION["captcha" . $i] == 0) && isset($_POST["captcha" . $i])) || (($_SESSION["captcha" . $i] != 0) && !isset($_POST["captcha" . $i])))){
                            $correct = 0;
                            break;
                        }
                    }else{
                        exit("SESSION COOKIE ERROR!");
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