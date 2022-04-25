<?php
    define("notmain", "");
    include($_SERVER["DOCUMENT_ROOT"] . "/index.php");
?>
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $langJSON["viewuploads"]; ?> | <?php echo $langJSON["pedestrian"]; ?> SOS!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../styles/view2.css">
    </head>
    <body>
        <div id="main">
            <div id="top">
                <a href="../" id="icon"><img width="64" height="64" src="../images/pedestriansos.svg"></a>
            </div>
            <div class="loader" id="loadertop"></div>
            <div id="loaderrortop"></div>
            <div id="content"></div>
            <div class="loader" id="loader"></div>
            <div id="loaderror"></div>
            <div class="overlay" id="windowoverlay">
                <div id="windowtop">
                    <a href="../" id="icon">
                        <img width="32" height="32" src="../images/pedestriansos.svg">
                    </a>
                    <button id="open">
                        <img width="32" height="32" src="../images/open.svg">
                    </button>
                    <button id="opennewtab">
                        <img width="32" height="32" src="../images/newtab.svg">
                    </button>
                    <button id="openall">
                        <img width="32" height="32" src="../images/multiple.svg">
                    </button>
                    <button id="openallnewtab">
                        <img width="32" height="32" src="../images/newtab.svg">
                    </button>
                    <button id="download">
                        <img width="32" height="32" src="../images/download.svg">
                    </button>
                    <button id="share">
                        <img width="32" height="32" src="../images/share.svg">
                    </button>
                    <button id="closewindow" class="closeButtons">
                        &times;
                    </button>
                </div>
                <div id="windowcontent"></div>
            </div>
        </div>
        <script src="../scripts/view2.js"></script>
    </body>
</html>