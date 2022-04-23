<?php
    define("notmain", "");
    include($_SERVER["DOCUMENT_ROOT"] . "/index.php");
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Camera | PedestrianSOS!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../styles/camera.css">
    </head>
    <body>
        <div id="camera">
            <video id="video" autoplay muted></video>
            <div id="bottombuttons">
                <button id="recordvideo" class="buttons"><div><div></div></div></button>
                <button id="takephoto" class="buttons"><div><div></div></div></button>
                <button id="live" class="buttons"><img width="54" height="54" src="../images/live.svg"></button>
            </div>
            <button id="takephotodraggable" class="buttons"><div><div></div></div></button>
            <button id="rotate" class="buttons singlebuttons"><img width="32" height="32" src="../images/rotate.svg"></button>
            <button id="flash" class="buttons singlebuttons"><img width="32" height="32" src="../images/flash0.svg"></button>
            <a href="../" style="text-decoration: none;top: 0;left: 0;" class="buttons singlebuttons">
                <img width="32" height="32" src="../images/pedestriansos.svg">
            </a>
            <div id="statusBox">
                <div id="status2"></div>
                <div id="statuslocation">
                    <img width="32" height="32" src="../images/location.svg">
                </div>
            </div>
            <div id="statusBigBox"></div>
        </div>
        <canvas id="canvas"></canvas>
        <script src="../scripts/camera.js"></script>
    </body>
</html>