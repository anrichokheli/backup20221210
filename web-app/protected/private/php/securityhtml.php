<!DOCTYPE html>
<html lang="<?php echo $GLOBALS["lang"]; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $langJSON["pedestrian"]; ?> SOS! | <?php echo $langJSON["security"]; ?></title>
    <style>
        body{
            margin: 0;
            padding: 0;
        }
        #main{
            text-align: center;
            font-family: sans-serif;
        }
        .pedestrian {
            color: #256aff;
        }
        .sos    {
            color: #ec0400;
        }
        .header *{
            display: inline-block;
            vertical-align: middle;
        }
        input[type="checkbox"]{
            width: 32px;
            height: 32px;
        }
        button{
            background: none;
            font-size: 20px;
        }
        button *{
            vertical-align: middle;
        }
        form div, form div label{
            display: inline-block;
            border: 2px solid #0000ff;
            margin: 1px;
            padding: 1px;
        }
        form div{
            border-width: 1px;
        }
        input[type="checkbox"]:checked + label{
            border: 2px solid #0080ff;
        }
        .infotext{
            font-weight: bold;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div id="main">
        <div class="header">
            <img width="64" height="64" src="/images/pedestriansos.svg">
            <h1>
                <span class="pedestrian"><?php echo $langJSON["pedestrian"]; ?></span> <span class="sos">SOS!</span>
            </h1>
        </div>
        <div class="header">
            <img width="60" height="60" src="/images/securityps.svg">
            <h2>
                <?php echo $langJSON["security"]; ?>
            </h2>
        </div>
        <br>
        <?php if(isset($GLOBALS["correct"]) && !$GLOBALS["correct"]){echo '<div style="color:#ff0000;" class="infotext">' . $langJSON["incorrectdata"] . '</div>';} ?>
        <?php echo '<div class="infotext">' . $langJSON["choosecorrectimages"] . '</div>'; ?>
        <form method="post">
            <input type="hidden" name="submit">
            <div>
                <input type="checkbox" name="captcha0" id="0">
                <label for="0">
                    <img width="128" height="128" src="<?php getCaptchaImage(0); ?>">
                </label>
            </div>
            <div>
                <input type="checkbox" name="captcha1" id="1">
                <label for="1">
                    <img width="128" height="128" src="<?php getCaptchaImage(1); ?>">
                </label>
            </div>
            <div>
                <input type="checkbox" name="captcha2" id="2">
                <label for="2">
                    <img width="128" height="128" src="<?php getCaptchaImage(2); ?>">
                </label>
            </div>
            <div>
                <input type="checkbox" name="captcha3" id="3">
                <label for="3">
                    <img width="128" height="128" src="<?php getCaptchaImage(3); ?>">
                </label>
            </div>
            <div>
                <input type="checkbox" name="captcha4" id="4">
                <label for="4">
                    <img width="128" height="128" src="<?php getCaptchaImage(4); ?>">
                </label>
            </div>
            <div>
                <input type="checkbox" name="captcha5" id="5">
                <label for="5">
                    <img width="128" height="128" src="<?php getCaptchaImage(5); ?>">
                </label>
            </div>
            <div>
                <input type="checkbox" name="captcha6" id="6">
                <label for="6">
                    <img width="128" height="128" src="<?php getCaptchaImage(6); ?>">
                </label>
            </div>
            <div>
                <input type="checkbox" name="captcha7" id="7">
                <label for="7">
                    <img width="128" height="128" src="<?php getCaptchaImage(7); ?>">
                </label>
            </div>
            <div>
                <input type="checkbox" name="captcha8" id="8">
                <label for="8">
                    <img width="128" height="128" src="<?php getCaptchaImage(8); ?>">
                </label>
            </div>
            <br>
            <input type="submit" id="submit">
            <label for="submit">
                <button><img width="32" height="32" src="/images/submit.svg"> <span><?php echo $langJSON["done"]; ?></span></button>
            </label>
        </form>
        <br>
        <form style="border: 2px dotted #256aff;padding: 4px;display: inline-block;" method="get">
        <label for="lang">
            <img width="26" height="26" src="../images/language.svg">
            <?php echo $langJSON["language"]; ?>
        </label>
        <select name="lang" id="lang" required>
            <option value="" disabled selected hidden>...</option>
            <?php echo getLangOptions(); ?>
        </select>
        <button type="submit"><?php echo $langJSON["open"]; ?></button>
    </form>
    </div>
    <div>
        <a href="/rules?lang=<?php echo $GLOBALS["lang"]; ?>"><?php echo $langJSON["rules"]; ?></a>
        &nbsp;|&nbsp;
        <a href="/?view&lang=<?php echo $GLOBALS["lang"]; ?>"><?php echo $langJSON["viewuploads"]; ?></a>
        &nbsp;|&nbsp;
        <a href="/api">API</a>
    </div>
    <?php echoConsoleWarningScript(); ?>
</body>
</html>