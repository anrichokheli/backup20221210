<?php
$mysqliConn = parse_ini_file(protectedPrivatePath . "mysqliconn.ini");
$serverName = $mysqliConn["serverName"];
$userName = $mysqliConn["userName"];
$password = $mysqliConn["password"];
$dbname = $mysqliConn["dbname"];
$conn = mysqli_connect($serverName, $userName, $password);
if($conn){
    $sql = "CREATE DATABASE pedestriansos";
    if(mysqli_query($conn, $sql)){
        if(mysqli_select_db($conn, $dbname)){
            $sql = "CREATE TABLE uploads (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                filepath VARCHAR(16) COLLATE latin1_general_ci,
                filetime INT UNSIGNED
            )";
            mysqli_query($conn, $sql);   
        }
    }else{
        echo mysqli_error($conn);
    }
    mysqli_close($conn);
}
?>