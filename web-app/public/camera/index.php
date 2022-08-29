<?php
    define("notmain", "");
    include($_SERVER["DOCUMENT_ROOT"] . "/index.php");
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
    <head>
        <meta charset="UTF-8">
        <title><?php echo $langJSON["camera"]; ?> | <?php echo $langJSON["pedestrian"]; ?> SOS!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../styles/camera.css">
        <meta name="title" content="<?php echo $langJSON["pedestrian"]; ?> SOS!">
        <meta name="description" content="<?php echo $langJSON["camera"]; ?>">
    </head>
    <body>
        <div id="camera">
            <video id="video" autoplay muted></video>
            <div id="bottombuttons">
                <button id="recordvideo" class="buttons" disabled title="<?php echo $langJSON["recordvideo"]; ?>"><div><div></div></div></button>
                <button id="takephoto" class="buttons" disabled title="<?php echo $langJSON["takephoto"]; ?>"><div><div></div></div></button>
                <button id="live" class="buttons" disabled title="<?php echo $langJSON["livestream"]; ?>"><img alt width="54" height="54" src="../images/live.svg"></button>
            </div>
            <button id="takephotodraggable" class="buttons" disabled title="<?php echo $langJSON["cameramoveabletakephotobutton"]; ?>"><div><div></div></div></button>
            <button id="rotate" class="buttons singlebuttons" disabled title="<?php echo $langJSON["rotate"]; ?>"><img alt width="32" height="32" src="../images/rotate.svg"></button>
            <button id="flashlight" class="buttons singlebuttons" disabled title="<?php echo $langJSON["flashlight"]; ?>"><img alt width="32" height="32" src="../images/flashlight0.svg"></button>
            <a href="../" style="text-decoration: none;top: 0;left: 0;" class="buttons singlebuttons" id="psbutton" title="<?php echo $langJSON["gomainpage"]; ?>">
                <img width="32" height="32" src="../images/pedestriansos.svg" alt>
            </a>
            <div id="statusBox">
                <div id="status2" class="progressbardiv">
                    <img class="whiteicon" width="32" height="32" id="statusphotovideo">
                    <div id="progressbartop" class="progressbar"></div>
                </div>
                <div id="statuslocation">
                    <img width="32" height="32">
                </div>
            </div>
            <div id="statusBigBox"></div>
            <div id="locationDetails"></div>
            <div id="phototakenicon" title="<?php echo $langJSON["phototaken"]; ?>">
                <img width="32" height="32" src="/images/take_photo.svg" class="whiteicon" alt>
            </div>
            <div id="recordstatus">
                <img width="32" height="32" id="recordicon">
                <span id="recordduration">-</span>
            </div>
        </div>
        <canvas id="canvas"></canvas>
        <script src="../scripts/camera.js"></script>
        <?php echoConsoleWarningScript(); ?>
    </body>
</html>