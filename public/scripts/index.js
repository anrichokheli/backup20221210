var styleTag = document.createElement("link");
styleTag.rel = "stylesheet";
styleTag.href = "styles/index1.css";
document.head.appendChild(styleTag);
var mainDiv = document.getElementById("main");
var strings = null;
function getString(key)  {
    if(strings!=null)return strings[key];
    return "";
}
var latitude;
var longitude;
var altitude;
var accuracy;
var altitudeAccuracy;
try{
    var locationDiv = document.getElementById("location");
    var locationTop = document.createElement("div");
    locationTop.id = "locationtop";
    locationDiv.appendChild(locationTop);
    var locationImage = document.createElement("img");
    locationImage.src = "images/location.svg";
    locationImage.width = "32";
    locationImage.height = "32";
    locationTop.appendChild(locationImage);
    var locationTitle = document.createElement("span");
    locationTitle.id = "currentlocation";
    locationTitle.style.fontSize = "20px";
    locationTop.appendChild(locationTitle);
    var locationData = document.createElement("div");
    locationDiv.appendChild(locationData);
}catch{}
function addLocationElements(text)  {
    var div = document.createElement("div");
    div.className = "locationDivs";
    locationData.appendChild(div);
    var title = document.createElement("span");
    title.className = "locationTitles";
    title.innerText = ": ";
    var titleText = document.createElement("span");
    titleText.id = text;
    title.insertBefore(titleText, title.childNodes[0]);
    div.appendChild(title);
    var data = document.createElement("span");
    div.appendChild(data);
    return data;
}
function showLocation(element, data)    {
    if(data == null)    {
        data = getString("nodata");
        if(data=="")data="-";
        element.style.backgroundColor = "#ff000080";
    }
    else    {
        element.style.backgroundColor = "";
    }
    element.innerText = data;
}
try{
    var latitudeLongitudeData = addLocationElements("latitudelongitude");
    var altitudeData = addLocationElements("altitude");
    var accuracyData = addLocationElements("accuracy");
    var altitudeAccuracyData = addLocationElements("altitudeaccuracy");
    locationDiv.style.display = "inline-block";
}catch{}
var locationUploadArray = [];
function getLocation()  {
    if(navigator.geolocation)    {
        navigator.geolocation.watchPosition(afterLocation, locationError);
    }
    else    {
        locationData.innerText = "Geolocation not supported by this browser.";
        locationDiv.style.backgroundColor = "#ff000080";
    }
}
function afterLocation(position)  {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    altitude = position.coords.altitude;
    accuracy = position.coords.accuracy;
    altitudeAccuracy = position.coords.altitudeAccuracy;
    if(locationUploadArray.length > 0){
        for(var key in locationUploadArray){
            uploadLocation(locationUploadArray[key][0], locationUploadArray[key][1]);
            locationUploadArray.shift();
        }
    }
    try{
        if(locationDiv.contains(locationErrorDiv))    {
            locationDiv.removeChild(locationErrorDiv);
        }
        showLocation(latitudeLongitudeData, latitude + ", " + longitude);
        showLocation(altitudeData, altitude);
        showLocation(accuracyData, accuracy);
        showLocation(altitudeAccuracyData, altitudeAccuracy);
    }catch{}
}
var locationErrorDiv = document.createElement("div");
locationErrorDiv.style.border = "2px solid #ff0000";
function locationError(error)    {
    locationDiv.appendChild(locationErrorDiv);
    switch(error.code)   {
        case error.PERMISSION_DENIED:
            locationErrorDiv.innerText = "permission denied. to detect location,";
            locationErrorDiv.appendChild(document.createElement("br"));
            var button = document.createElement("button");
            button.innerText = "allow permission";
            button.addEventListener("click", function(){
                getLocation();
            });
            locationErrorDiv.appendChild(button);
            break;
        case error.POSITION_UNAVAILABLE:
            locationErrorDiv.innerText = "location unavailable";
            break;
        case error.TIMEOUT:
            locationErrorDiv.innerText = "request timed out";
            break;
        case error.UNKNOWN_ERROR:
            locationErrorDiv.innerText = "unknown error";
            break;
    }
    setTimeout(getLocation, 250);
}
getLocation();
try{
    function preImg(image){
        var img = document.createElement("img");
        img.src = image;
        img.style.display = "none";
        mainDiv.appendChild(img);
        img.remove();
    }
    preImg("images/offline.svg");
    preImg("images/retry.svg");
}catch{}
function addRetryButton(func, element){
    var retryButton = document.createElement("button");
    retryButton.innerHTML = "<img width=\"32\" height=\"32\" src=\"images/retry.svg\"> " + getString("retry");
    retryButton.classList.add("buttons");
    retryButton.addEventListener("click", func);
    element.insertBefore(retryButton, element.childNodes[0]);
    var onlineFunc = function(){window.removeEventListener("online", onlineFunc);func();};
    window.addEventListener("online", onlineFunc);
}
var uploadStatuses = document.getElementById("uploadstatuses");
function uploadString(n, key, post, location, value) {
    try{
        var text;
        var img = "<img width=\"16\" height=\"16\" src=\"images/";
        if(location == true)    {
            text = strings["locationcoordinates"];
            img += "location";
        }
        else    {
            text = strings["description"];
            img += "description";
        }
        text += "; ";
        img += ".svg\"> ";
        var element = document.getElementById('q'+n);
        var div = document.createElement("div");
        div.className = "statusText";
        div.innerHTML = img+text+getString("uploading");
        var color = "#ffff00";
        div.style.borderColor = color;
        var div2 = document.createElement("div");
        div2.innerText = value;
        var borderStyle = "1px dotted";
        div2.style.border = borderStyle;
        div2.borderColor = color;
        div.appendChild(div2);
        element.insertBefore(div, element.childNodes[0]);
    }catch{}
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        div = document.createElement("div");
        div.className = "statusText";
        if(this.responseText === "1")    {
            div.innerHTML = img + text + getString("uploadcompleted");
            color = "#00ff00";
        }
        else    {
            div.innerHTML = img + text + getString("uploadfailed");
            color = "#ff0000";
            if(!location)    {
                document.getElementById(n).disabled = 0;
                document.getElementById("b"+n).disabled = 0;
            }
            var div2 = document.createElement("div");
            div2.innerText = this.responseText;
            div2.style.border = borderStyle;
            div2.style.borderColor = color;
            div.appendChild(div2);
            addRetryButton(function(){uploadString(n, key, post, location, value);}, element);
        }
        div.style.borderColor = color;
        element.insertBefore(div, element.childNodes[0]);
    };
    ajax.onerror = function(){
        div = document.createElement("div");
        div.className = "statusText";
        div.innerHTML = img + text + getString("uploaderror");
        color = "#ff0000";
        div.style.borderColor = color;
        if(!location)    {
            document.getElementById(n).disabled = 0;
            document.getElementById("b"+n).disabled = 0;
        }
        div2 = document.createElement("div");
        div2.innerText = this.Error;
        div2.style.border = borderStyle;
        div2.style.borderColor = color;
        div.appendChild(div2);
        element.insertBefore(div, element.childNodes[0]);
        addRetryButton(function(){uploadString(n, key, post, location, value);}, element);
    };
    ajax.open("POST", "/");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("n="+encodeURIComponent(n)+"&key="+encodeURIComponent(key)+post);
}
function uploadLocation(n, key)   {
    uploadString(n, key, "&latitude="+encodeURIComponent(latitude)+"&longitude="+encodeURIComponent(longitude)+"&altitude="+encodeURIComponent(altitude)+"&accuracy="+encodeURIComponent(accuracy)+"&altitudeaccuracy="+encodeURIComponent(altitudeAccuracy), true, latitude + ", " + longitude + "; " + altitude + "; " + accuracy + "; " + altitudeAccuracy);
}
function uploadDescription(n, key)    {
    var descriptionValue = document.getElementById(n).value;
    uploadString(n, key, "&description="+encodeURIComponent(descriptionValue), false, descriptionValue);
}
function uploadVoice(n, key)  {
    var statusElement = document.getElementById('q'+n);
    var voiceinput = document.getElementById('v'+n);
    var button = document.getElementById("vb"+n);
    button.disabled = 1;
    var div = document.createElement("div");
    div.className = "statusText";
    var text = strings["voice"] + "; ";
    var img = "<img width=\"16\" height=\"16\" src=\"images/microphone.svg\"> ";
    div.innerHTML = img+text+getString("uploading");
    div.style.borderColor = "#ffff00";
    statusElement.insertBefore(div, statusElement.childNodes[0]);
    var formData = new FormData();
    formData.append("voice", voiceinput.files[0]);
    formData.append("n", n);
    formData.append("key", key);
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        div = document.createElement("div");
        div.className = "statusText";
        if(this.responseText === "1")    {
            div.innerHTML = img+text+getString("uploadcompleted");
            div.style.borderColor = "#00ff00";
        }
        else    {
            div.innerHTML = img+text+getString("uploadfailed")+"\n(" + this.responseText + ")";
            div.style.borderColor = "#ff0000";
            button.disabled = 0;
            addRetryButton(function(){uploadVoice(n, key);}, statusElement);
        }
        statusElement.insertBefore(div, statusElement.childNodes[0]);
    };
    ajax.onerror = function(){
        div = document.createElement("div");
        div.className = "statusText";
        div.innerHTML = img+text+getString("uploaderror")+"\n(" + this.Error + ")";
        div.style.borderColor = "#ff0000";
        statusElement.insertBefore(div, statusElement.childNodes[0]);
        button.disabled = 0;
        addRetryButton(function(){uploadVoice(n, key);}, statusElement);
    };
    ajax.open("POST", "/");
    ajax.send(formData);
}
var timeout1;
var timeout2;
function bottomProgressVisible(visible)    {
    try{
        if(visible)    {
            if(timeout1 != undefined)    {
                clearTimeout(timeout1);
            }
            if(timeout2 != undefined)    {
                clearTimeout(timeout2);
            }
            uploadStatusBottom.style.display = "block";
            uploadStatusBottom.style.display = "flex";
            uploadStatusBottom.style.animation = "showbottom 0.5s forwards";
        }
        else    {
            timeout1 = setTimeout(function(){
                try{
                    uploadStatusBottom.style.animation = "hidebottom 0.5s forwards";
                    timeout2 = setTimeout(function(){uploadStatusBottom.style.display = "none";}, 500);
                }catch{}
            }, 3000);
        }
    }catch{}
}
function flexCenter(element) {
    try{
        element.style.display = "inline-flex";
        element.style.alignItems = "center";
        element.style.flexDirection = "column";
    }catch{
        element.style.display = "inline-block";
    }
}
var uploadStatusBottom = document.getElementById("uploadstatusbottom");
var bottomProgressBar = document.createElement("div");
uploadStatusBottom.appendChild(bottomProgressBar);
var uploadstatusesdisplayed = 0;
var maxFileSize = 25000000;
var maxFilesNum = 10;
var allowedFileExtensions = ["bmp", "gif", "x-icon", "jpeg", "png", "tiff", "webp", "x-msvideo", "mpeg", "ogg", "mp2t", "webm", "3gpp", "3gpp2", "mp4"];
var lastUploadID = 0;
function filesUpload(files, fileInput){
    var currentUploadID = ++lastUploadID;
    if(files === null)  {
        files = fileInput.files;
    }
    try{
        if(files.length > maxFilesNum){
            alert(getString("maxfilesnum") + " " + maxFilesNum);
            return;
        }
        if(files.length == 1){
            if(files[0].size > maxFileSize)    {
                alert(getString("maxfilesize") + " " + (maxFileSize / 1000000) + "MB.");
                return;
            }
            var fileTypeArray = files[0].type.split('/');
            var fileType = fileTypeArray[0];
            var fileExtension = fileTypeArray[1];
            if(fileType != "image" && fileType != "video")    {
                alert(getString("onlyimgvid"));
                return;
            }
            if(allowedFileExtensions.indexOf(fileExtension) == -1)    {
                alert(getString("allowedext") + ": ." + allowedFileExtensions.join(", .") + ".");
                return;
            }
        }
        unloadWarning = 1;
        var subbox = document.createElement("div");
        flexCenter(subbox);
        subbox.className = "boxs";
        uploadStatuses.insertBefore(subbox, uploadStatuses.childNodes[0]);
        var status = document.createElement("div");
        status.className = "boxs boxs2";
        var statusDiv = document.createElement("div");
        status.appendChild(statusDiv);
        subbox.appendChild(status);
        var statusText = document.createElement("div");
        var typeString;
        var typeImg = "<img width=\"16\" height=\"16\" src=\"images/";
        if(files.length == 1){
            if(fileType == "image"){
                typeString = getString("photo");
                typeImg += "photo";
            }else{
                typeString = getString("video");
                typeImg += "video";
            }
        }else{
            typeString = getString("files");
            typeImg += "photovideo";
        }
        typeImg += ".svg\">";
        typeString += "; ";
        statusText.innerHTML = typeImg + ' ' + typeString + getString("uploading");
        statusDiv.appendChild(statusText);
        var progress = document.createElement("div");
        statusDiv.appendChild(progress);
        var progressBar0 = document.createElement("div");
        progressBar0.className = "progressbar0";
        statusDiv.appendChild(progressBar0);
        var progressBar = document.createElement("div");
        progressBar.className = "progressbar";
        progressBar0.appendChild(progressBar);
        var color = "#ffff00";
        statusDiv.className = "statusText";
        statusDiv.style.borderColor = color;
        if(!uploadstatusesdisplayed) {
            flexCenter(uploadStatuses);
            uploadstatusesdisplayed = 1;
        }
        statusText = document.createElement("div");
        bottomProgressBar.style.backgroundColor = color;
        bottomProgressBar.style.width = "0%";
        bottomProgressVisible(1);
        var after = document.createElement("div");
        after.classList.add("boxs", "boxs2");
    }catch{}
    var formData = new FormData();
    var fileTypeArray2;
    var fileType2;
    var fileExtension2;
    function displayUploadError(text){
        var div = document.createElement("div");
        div.style.border = "2px solid #ff0000";
        div.innerText = text;
        subbox.insertBefore(div, subbox.childNodes[0]);
    }
    for(var file in files){
        try{
            if(files[file].size > maxFileSize)    {
                try{
                    displayUploadError(getString("maxfilesize") + " " + (maxFileSize / 1000000) + "MB. (" + files[file].name + ")");
                }catch{}
                continue;
            }
            fileTypeArray2 = files[file].type.split('/');
            fileType2 = fileTypeArray2[0];
            fileExtension2 = fileTypeArray2[1];
            if(fileType2 != "image" && fileType2 != "video")    {
                try{
                    displayUploadError(getString("onlyimgvid") + " (" + files[file].name + ")");
                }catch{}
                continue;
            }
            if(allowedFileExtensions.indexOf(fileExtension2) == -1)    {
                try{
                    displayUploadError(getString("allowedext") + ": ." + allowedFileExtensions.join(", .") + ". (" + files[file].name + ")");
                }catch{}
                continue;
            }
        }catch{}
        formData.append("photovideo[]", files[file]);
    }
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        if(this.responseText.charAt(0) == '#')    {
            try{
                subbox.insertBefore(after, subbox.childNodes[0]);
            }catch{}
            var responseArray = this.responseText.substring(1).split('|');
            var n = responseArray[0];
            var key = responseArray[1];
            try{
                var html = "<div class=\"boxs boxs2\">" + getString("uploadedid") + ": #" + n + "</div>";
                html += "<button onclick=window.open(\"?" + n + "\") class=\"texts buttons afteruploadbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;"+strings["viewupload"]+"</button>";
                html += "<br><br><div class=\"descriptioninput\"><textarea id=\""+n+"\" class=\"texts\" rows=\"2\" cols=\"10\" placeholder=\""+strings["writedescription"]+"...\"></textarea></div>";
                html += "<div class=\"buttonsDivs\"><div><button id=\"b"+n+"\" class=\"texts buttons afteruploadbuttons\" disabled><img width=\"32\" height=\"32\" src=\"images/description.svg\">&nbsp;"+strings["uploaddescription"]+"</button></div>";
                html += "<div><input type=\"file\" accept=\"audio/*\" id=\"v"+n+"\" onchange=uploadVoice(\""+n+"\",\""+key+"\") hidden><button id=\"vb"+n+"\" class=\"texts buttons afteruploadbuttons\" onclick=document.getElementById(\"v"+n+"\").click()><img width=\"32\" height=\"32\" src=\"images/microphone.svg\">&nbsp;"+strings["uploadvoice"]+"</button></div></div>";
                html += "<br><br><div id=\"q"+n+"\" class=\"boxs boxs2\"></div>";
                after.innerHTML = html;
                var textarea = document.getElementById(n);
                var button = document.getElementById("b"+n);
                button.addEventListener("click", function(){
                    textarea.disabled = 1;
                    button.disabled = 1;
                    uploadDescription(n,key);
                });
                textarea.addEventListener("input", function(){
                    button.disabled = textarea.value == '';
                    textarea.style.height = "0";
                    textarea.style.height = textarea.scrollHeight + "px";
                });
                statusText.innerHTML += typeImg + ' ' + typeString + getString("uploadcompleted")+"\n(#" + n + ")";
                color = "#00ff00";
                if(currentUploadID == lastUploadID){
                    bottomProgressVisible(0);
                }
                try{
                    var shareButton = document.createElement("button");
                    shareButton.innerHTML = "<img width=\"32\" height=\"32\" src=\"images/share.svg\"> "+getString("share");
                    shareButton.classList.add("buttons", "afteruploadbuttons");
                    shareButton.addEventListener("click", function(){
                        try{
                            navigator.share({url: window.location.href+"?"+n});
                        }catch{
                            try{
                                shareButton.style.color = "#ff0000";
                                shareButton.innerText = "SHARE ERROR!";
                            }catch{}
                        }
                    });
                    after.appendChild(shareButton);
                }catch{}
            }catch{}
            if(latitude != null && longitude != null)    {
                uploadLocation(n, key);
            }else{
                locationUploadArray.push([n, key]);
            }
        }
        else    {
            statusText.innerHTML += typeImg + ' ' + typeString + getString("uploadfailed")+"\n(" + this.responseText + ")";
            color = "#ff0000";
            if(currentUploadID == lastUploadID){
                bottomProgressVisible(0);
            }
            addRetryButton(function(){filesUpload(files, fileInput);}, status);
        }
        if(fileInput !== undefined)fileInput.value = null;
        statusText.className = "statusText";
        statusText.style.borderColor = color;
        if(currentUploadID == lastUploadID){
            bottomProgressBar.style.backgroundColor = color;
        }
        status.insertBefore(statusText, status.childNodes[0]);
    };
    ajax.onerror = function(){
        statusText.innerHTML += typeImg + ' ' + typeString + getString("uploaderror")+"\n(" + this.Error + ")";
        statusText.className = "statusText";
        color = "#ff0000";
        statusText.style.borderColor = color;
        if(currentUploadID == lastUploadID){
            bottomProgressBar.style.backgroundColor = color;
            bottomProgressVisible(0);
        }
        status.insertBefore(statusText, status.childNodes[0]);
        addRetryButton(function(){filesUpload(files, fileInput);}, status);
    };
    var progressPercent;
    ajax.upload.onprogress = function(e){
        progressPercent = ((e.loaded / e.total) * 100).toFixed(2) + '%';
        progress.innerText = progressPercent + " (" + e.loaded + " / " + e.total + ")";
        progressBar.style.width = progressPercent;
        if(currentUploadID == lastUploadID){
            bottomProgressBar.style.width = progressPercent;
        }
    };
    ajax.open("POST", "/");
    ajax.send(formData);
}
var unloadWarning = 0;
function uploadFunction(input){
    try{
        filesUpload(null, input);
    }catch{
        try{
            if(unloadWarning){
                unloadWarning = 0;
            }
            input.parentNode.parentNode.submit();
        }catch{
            button.style.display = "inline-block";
            input.hidden = 0;
        }
    }
}
function buttonSetup(id0) {
    var input = document.getElementById(id0 + "input");
    var button = document.getElementById(id0 + "upload");
    input.addEventListener("change", function(){uploadFunction(input);});
    if(input.value){
        uploadFunction(input);
    }
    button.style.display = "none";
    input.hidden = 1;
}
try{
    buttonSetup("takephoto");
    buttonSetup("recordvideo");
    buttonSetup("choosephoto");
    buttonSetup("choosevideo");
    buttonSetup("choosefiles");
    var uploadForms = document.getElementsByClassName("uploadforms");
    for(var i = 0; i < uploadForms.length; i++){
        uploadForms[i].style.border = "none";
        uploadForms[i].style.padding = "0";
    }
}catch{}
var darkModeEnabled;
function setDarkMode(enabled) {
    var color = "#000000";
    var backgroundColor = "#ffffff";
    if(enabled)    {
        var temp = color;
        color = backgroundColor;
        backgroundColor = temp;
        document.documentElement.style.colorScheme = "dark";
    }
    else    {
        document.documentElement.style.colorScheme = "light";
    }
    mainDiv.style.backgroundColor = backgroundColor;
    var elements = document.getElementsByClassName("texts");
    for(var i = 0; i < elements.length; i++)   {
        elements[i].style.color = color;
    }
    darkModeEnabled = enabled;
}
try{
    var matchmedia = window.matchMedia("(prefers-color-scheme: dark)");
    function defaultdarkmode()  {
        setDarkMode(matchmedia.matches);
        matchmedia.onchange = function(e){setDarkMode(e.matches);};
    }
    if(localStorage.getItem("darkmode") == null)    {
        defaultdarkmode();
    }
    else    {
        setDarkMode(localStorage.getItem("darkmode")=="true");
        matchmedia.onchange=function(){};
    }
    window.addEventListener("beforeunload", function(e){
        if(unloadWarning)    {
            e.preventDefault();
            e.returnValue = '';
        }
    });
    var dragOverlay = document.getElementById("dragoverlay");
    var uploadImageDiv = document.createElement("div");
    uploadImageDiv.style.width = "50%";
    uploadImageDiv.style.height = "50%";
    uploadImageDiv.style.backgroundImage = "url(images/uploadicon.svg)";
    uploadImageDiv.style.backgroundRepeat = "no-repeat";
    uploadImageDiv.style.backgroundPosition = "center";
    uploadImageDiv.style.backgroundSize = "contain";
    uploadImageDiv.style.backgroundColor = "#ffffff80";
    uploadImageDiv.style.borderRadius = "8px";
    dragOverlay.appendChild(uploadImageDiv);
    var dragOverlay2 = document.createElement("div");
    dragOverlay2.className = "overlay";
    dragOverlay.appendChild(dragOverlay2);
    dragOverlay2.addEventListener("dragover", function(e){
        e.preventDefault();
    });
    dragOverlay2.addEventListener("drop", function(e){
        e.preventDefault();
        var files = [];
        for(var i = 0; i < e.dataTransfer.items.length; i++){
            files.push(e.dataTransfer.items[i].getAsFile());
        }
        filesUpload(files);
        dragOverlay.style.display = "none";
    });
    mainDiv.addEventListener("dragenter", function(e){
        if(e.dataTransfer.items[0].kind == "file")    {
            dragOverlay.style.display = "flex";
        }
    });
    dragOverlay2.addEventListener("dragleave", function(){
        dragOverlay.style.display = "none";
    });
    var bottomSpace = document.createElement("div");
    bottomSpace.style.height = "25vh";
    mainDiv.appendChild(bottomSpace);
    function translateHTML(html){
        for(var key in strings) {
            html = html.replaceAll("<string>"+key+"</string>", strings[key]);
        }
        return html;
    }
    var settingsWindowOverlay = document.getElementById("settingswindowoverlay");
    settingsWindowOverlay.addEventListener("click", function(e){
        if((e.target != settingsWindowOverlay) && (e.target.id != "settingsclosewindow")){
            return;
        }
        this.style.display = "none";
    });
    var settingsWindow = document.createElement("div");
    settingsWindow.id = "settingswindow";
    settingsWindowOverlay.appendChild(settingsWindow);
    function setWindowDarkMode(windowOverlay, windowDiv){
        if(darkModeEnabled){
            windowOverlay.style.backgroundColor = "#ffffff80";
            windowDiv.style.backgroundColor = "#000000";
        }
        else{
            windowOverlay.style.backgroundColor = "#00000080";
            windowDiv.style.backgroundColor = "#ffffff";
        }
    }
    var settingsButton = document.getElementById("settingsbutton");
    settingsButton.addEventListener("click", function(){
        settingsWindowOverlay.style.display = "block";
        settingsWindowOverlay.style.display = "flex";
        if(settingsWindow.innerHTML != '')    {
            return;
        }
        setWindowDarkMode(settingsWindowOverlay, settingsWindow);
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "html/settings.html");
        ajax.onload = function(){
            settingsWindow.innerHTML = translateHTML(this.responseText);
            var script = document.createElement("script");
            script.src = "scripts/settings.js";
            settingsWindow.appendChild(script);
        };
        ajax.send();
    });
    settingsButton.innerHTML = "<img width=\"64\" height=\"64\" src=\"images/settings.svg\"> <span id=\"settings\"><string>settings</string></span>";
    settingsButton.style.display = "inline-block";
    function setLanguage(lang,get)  {
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "json/languages/" + lang + ".json");
        ajax.onload = function()    {
            if(this.status == 200){
                document.documentElement.lang = lang;
                var json = JSON.parse(this.responseText);
                strings = json;
                var element;
                for(var key in json) {
                    element = document.getElementById(key);
                    if(element!=null)element.innerText = json[key];
                }
                if(typeof settingsTitle!=="undefined")settingsTitle.innerHTML = strings["settings"];
                if(typeof langLabel!=="undefined")langLabel.innerHTML = strings["devicedefault"];
                document.title = strings["title"];
            }
            else{
                var getlang = (new URL(window.location.href)).searchParams.get("lang");
                if(getlang != null && get != 1){
                    lang = getlang;
                    setLanguage(lang,1);
                }else{
                    lang = "en";
                    setLanguage(lang);
                }
            }
        };
        ajax.send();
    }
    var lang = localStorage.getItem("lang");
    if(lang == null){
        lang = navigator.language.substring(0, 2);
    }
    setLanguage(lang);
    document.getElementById("langform").remove();
}catch{}
try{
    var isOffline;
    window.addEventListener("offline", function(){
        if(isOffline){
            isOffline.style.display = "block";
            return;
        }
        isOffline = document.createElement("div");
        isOffline.style.border = "2px solid #ff0000";
        var offlineImg = document.createElement("img");
        offlineImg.width = "64";
        offlineImg.height = "64";
        offlineImg.src = "images/offline.svg";
        isOffline.appendChild(offlineImg);
        var offlineText = document.createElement("span");
        offlineText.innerText = getString("offline");
        offlineText.style.fontWeight = "bold";
        offlineImg.style.verticalAlign = "middle";
        offlineText.style.verticalAlign = "middle";
        isOffline.appendChild(offlineText);
        mainDiv.insertBefore(isOffline, mainDiv.childNodes[2]);
        window.addEventListener("online", function(){
            isOffline.style.display = "none";
        });
    });
}catch{}