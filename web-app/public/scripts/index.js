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
var locationDiv;
try{
    locationDiv = document.getElementById("location");
    var locationTop = document.createElement("div");
    locationTop.id = "locationtop";
    locationDiv.appendChild(locationTop);
    var locationImage = document.createElement("img");
    locationImage.src = "images/location.svg";
    locationImage.width = "32";
    locationImage.height = "32";
    locationTop.appendChild(locationImage);
    var locationTitle = document.createElement("span");
    locationTitle.className = "currentlocation";
    locationTitle.style.fontSize = "20px";
    locationTop.appendChild(locationTitle);
    var locationData = document.createElement("div");
    locationDiv.appendChild(locationData);
}catch(e){}
function addLocationElements(text)  {
    var div = document.createElement("div");
    div.className = "locationDivs";
    locationData.appendChild(div);
    var title = document.createElement("span");
    title.className = "locationTitles";
    title.innerText = ": ";
    var titleText = document.createElement("span");
    titleText.className = text;
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
        element.className = "nodata";
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
}catch(e){}
var locationUploadArray = [];
var locationWait;
function getLocation()  {
    if(navigator.geolocation)    {
        locationWait = 1;
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
            uploadLocation(locationUploadArray[key][0], locationUploadArray[key][1], document.getElementById('q'+locationUploadArray[key][0]));
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
    }catch(e){}
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
            locationWait = 0;
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
        img.width = "0";
        img.height = "0";
        img.style.display = "block";
        mainDiv.appendChild(img);
        img.remove();
    }
    preImg("images/offline.svg");
    preImg("images/retry.svg");
}catch(e){}
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
function uploadString(n, key, post, location, value, element, storage_ID, input, button) {
    if(!location)    {
        input.disabled = 1;
        button.disabled = 1;
    }
    if((location && !locationWait) || !location){
        unloadWarning++;
    }
    try{
        var text;
        var img = "<img width=\"16\" height=\"16\" src=\"images/";
        if(location == true)    {
            text = '<span class="locationcoordinates">'+getString("locationcoordinates")+'</span>';
            img += "location";
        }
        else    {
            text = '<span class="description">'+getString("description")+'</span>';
            img += "description";
        }
        text += "; ";
        img += ".svg\"> ";
        var div = document.createElement("div");
        div.className = "statusText";
        div.innerHTML = img+text+'<span class="uploading">'+getString("uploading")+'</span>';
        var color = "#ffff00";
        div.style.borderColor = color;
        var div2 = document.createElement("div");
        div2.innerText = value;
        var borderStyle = "1px dotted ";
        div2.style.border = borderStyle + color;
        div2.style.maxHeight = "50vh";
        div2.style.overflowY = "auto";
        div.appendChild(div2);
        element.insertBefore(div, element.childNodes[0]);
    }catch(e){}
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        div = document.createElement("div");
        div.className = "statusText";
        if(this.responseText === "1")    {
            div.innerHTML = img + text + '<span class="uploadcompleted">' + getString("uploadcompleted") + '</span>';
            color = "#00ff00";
            unloadWarning--;
            try{
                if(!location && storage_ID){
                    var uploadsArray = JSON.parse(localStorage.getItem("uploads"));
                    uploadsArray[storage_ID][2] = false;
                    localStorage.setItem("uploads", JSON.stringify(uploadsArray));
                }
            }catch(e){}
        }
        else    {
            div.innerHTML = img + text + '<span class="uploadfailed">' + getString("uploadfailed") + '</span>';
            color = "#ff0000";
            if(!location)    {
                input.disabled = 0;
                button.disabled = 0;
            }
            var div2 = document.createElement("div");
            div2.innerText = this.responseText;
            div2.style.border = borderStyle + color;
            div.appendChild(div2);
            addRetryButton(function(){uploadString(n, key, post, location, value, element, storage_ID, input, button);}, element);
        }
        div.style.borderColor = color;
        element.insertBefore(div, element.childNodes[0]);
    };
    ajax.onerror = function(){
        div = document.createElement("div");
        div.className = "statusText";
        div.innerHTML = img + text + '<span class="uploaderror">' + getString("uploaderror") + '</span>';
        color = "#ff0000";
        div.style.borderColor = color;
        if(!location)    {
            input.disabled = 0;
            button.disabled = 0;
        }
        div2 = document.createElement("div");
        div2.innerText = this.Error;
        div2.style.border = borderStyle + color;
        div.appendChild(div2);
        element.insertBefore(div, element.childNodes[0]);
        addRetryButton(function(){uploadString(n, key, post, location, value, element, storage_ID, input, button);}, element);
    };
    ajax.open("POST", "/");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("n="+encodeURIComponent(n)+"&key="+encodeURIComponent(key)+post);
}
function uploadLocation(n, key, element)   {
    uploadString(n, key, "&latitude="+encodeURIComponent(latitude)+"&longitude="+encodeURIComponent(longitude)+"&altitude="+encodeURIComponent(altitude)+"&accuracy="+encodeURIComponent(accuracy)+"&altitudeAccuracy="+encodeURIComponent(altitudeAccuracy), true, latitude + ", " + longitude + "; " + altitude + "; " + accuracy + "; " + altitudeAccuracy, element);
}
function uploadDescription(n, key, descriptionValue, storage_ID, input, button, element)    {
    uploadString(n, key, "&description="+encodeURIComponent(descriptionValue), false, descriptionValue, element, storage_ID, input, button);
}
var maxVoiceFileSize = 25000000;
function uploadVoice(n, key, storage_ID, statusElement, voiceinput, button)  {
    if(!voiceinput)var voiceinput = document.getElementById('v'+n);
    if(voiceinput.files[0].size > maxVoiceFileSize){
        alert(getString("maxvoicefilesize")+": "+(maxVoiceFileSize/1000000)+"MB");
        return;
    }
    unloadWarning++;
    if(!statusElement)var statusElement = document.getElementById('q'+n);
    if(!button)var button = document.getElementById("vb"+n);
    button.disabled = 1;
    var div = document.createElement("div");
    div.className = "statusText";
    var text = '<span class="voice">' + getString("voice") + '</span>' + "; ";
    var img = "<img width=\"16\" height=\"16\" src=\"images/microphone.svg\"> ";
    div.innerHTML = img+text+'<span class="uploading">'+getString("uploading")+'</span>';
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
            div.innerHTML = img+text+'<span class="uploadcompleted">'+getString("uploadcompleted")+'</span>';
            div.style.borderColor = "#00ff00";
            unloadWarning--;
            try{
                if(storage_ID){
                    var uploadsArray = JSON.parse(localStorage.getItem("uploads"));
                    uploadsArray[storage_ID][3] = false;
                    localStorage.setItem("uploads", JSON.stringify(uploadsArray));
                }
            }catch(e){}
        }
        else    {
            div.innerHTML = img+text+'<span class="uploadfailed">'+getString("uploadfailed")+'</span>'+"\n(" + this.responseText + ")";
            div.style.borderColor = "#ff0000";
            button.disabled = 0;
            addRetryButton(function(){uploadVoice(n, key, storage_ID, statusElement, voiceinput, button);}, statusElement);
        }
        statusElement.insertBefore(div, statusElement.childNodes[0]);
    };
    ajax.onerror = function(){
        div = document.createElement("div");
        div.className = "statusText";
        div.innerHTML = img+text+'<span class="uploaderror">'+getString("uploaderror")+'</span>'+"\n(" + this.Error + ")";
        div.style.borderColor = "#ff0000";
        statusElement.insertBefore(div, statusElement.childNodes[0]);
        button.disabled = 0;
        addRetryButton(function(){uploadVoice(n, key, storage_ID, statusElement, voiceinput, button);}, statusElement);
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
                }catch(e){}
            }, 3000);
        }
    }catch(e){}
}
function flexCenter(element, columnDirection) {
    try{
        element.style.display = "inline-flex";
        element.style.alignItems = "center";
        if(columnDirection){
            element.style.flexDirection = "column";
        }
    }catch(e){
        element.style.display = "inline-block";
    }
}
var uploadStatusBottom = document.getElementById("uploadstatusbottom");
var bottomProgressBar = document.createElement("div");
uploadStatusBottom.appendChild(bottomProgressBar);
var uploadstatusesdisplayed = 0;
var maxFileSize = 25000000;
var maxFilesNum = 10;
var maxDescriptionLength = 100000;
var allowedFileExtensions = ["bmp", "gif", "x-icon", "jpg", "jpeg", "png", "tiff", "webp", "x-msvideo", "mpeg", "ogg", "mp2t", "webm", "3gpp", "3gpp2", "mp4"];
var lastUploadID = 0;
function addShareButton(element, fullurl){
    try{
        var shareButton = document.createElement("button");
        shareButton.innerHTML = "<img width=\"32\" height=\"32\" src=\"images/share.svg\"> <span class=\"share\">"+getString("share")+"</span>";
        shareButton.classList.add("buttons", "afteruploadbuttons");
        shareButton.addEventListener("click", function(){
            try{
                navigator.share({url: fullurl});
            }catch(e){
                try{
                    shareButton.style.color = "#ff0000";
                    shareButton.innerText = "SHARE ERROR!";
                }catch(e){}
            }
        });
        element.appendChild(shareButton);
    }catch(e){}
}
function filesUpload(files, fileInput, filelink, formData0, typeImg0, typeString0){
    var currentUploadID = ++lastUploadID;
    if(!filelink && files === null && !formData0)  {
        files = fileInput.files;
    }
    var subbox;
    var after;
    try{
        if(!filelink && !formData0){
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
        }
        if(!formData0){
            unloadWarning++;
        }
        subbox = document.createElement("div");
        flexCenter(subbox, 1);
        subbox.className = "boxs";
        uploadStatuses.insertBefore(subbox, uploadStatuses.childNodes[0]);
        var status = document.createElement("div");
        status.className = "boxs boxs2";
        var statusDiv = document.createElement("div");
        status.appendChild(statusDiv);
        subbox.appendChild(status);
        var statusText = document.createElement("div");
        var typeString;
        var typeImg;
        if(typeImg0 && typeString0){
            typeImg = typeImg0;
            typeString = typeString0;
        }else{
            typeImg = "<img width=\"16\" height=\"16\" src=\"images/";
            if(filelink){
                typeString = '<span class="link">'+getString("link")+'</span>';
                typeImg += "link";
            }else{
                if(files.length == 1){
                    if(fileType == "image"){
                        typeString = '<span class="photo">'+getString("photo")+'</span>';
                        typeImg += "photo";
                    }else{
                        typeString = '<span class="video">'+getString("video")+'</span>';
                        typeImg += "video";
                    }
                }else{
                    typeString = '<span class="files">'+getString("files")+'</span>';
                    typeImg += "photovideo";
                }
            }
            typeImg += ".svg\">";
            typeString += "; ";
        }
        statusText.innerHTML = typeImg + ' ' + typeString + '<span class="uploading">' + getString("uploading") + '</span>';
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
        if(filelink){
            var linkDiv = document.createElement("div");
            linkDiv.innerText = filelink;
            linkDiv.style.border = "1px dotted " + color;
            statusDiv.appendChild(linkDiv);
        }
        statusDiv.className = "statusText";
        statusDiv.style.borderColor = color;
        if(!uploadstatusesdisplayed) {
            flexCenter(uploadStatuses, 1);
            uploadstatusesdisplayed = 1;
        }
        statusText = document.createElement("div");
        bottomProgressBar.style.backgroundColor = color;
        bottomProgressBar.style.width = "0%";
        bottomProgressVisible(1);
        after = document.createElement("div");
        after.classList.add("boxs", "boxs2");
        if(!filelink && (files.length == 1)){
            var downloadButton = document.createElement("a");
            downloadButton.innerHTML = '<img width="32" height="32" src="images/download.svg"> <span class="download">' + getString("download") + '</span>';
            downloadButton.classList.add("buttons", "afteruploadbuttons");
            downloadButton.href = URL.createObjectURL(files[0]);
            downloadButton.download = (new Date()).getTime();
            status.appendChild(downloadButton);
        }
    }catch(e){}
    if(formData0){
        formData = formData0;
    }else{
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
        if(filelink){
            formData.append("filelink", filelink);
        }else{
            for(var file in files){
                try{
                    if(files[file].size > maxFileSize)    {
                        try{
                            displayUploadError(getString("maxfilesize") + " " + (maxFileSize / 1000000) + "MB. (" + files[file].name + ")");
                        }catch(e){}
                        continue;
                    }
                    fileTypeArray2 = files[file].type.split('/');
                    fileType2 = fileTypeArray2[0];
                    fileExtension2 = fileTypeArray2[1];
                    if(fileType2 != "image" && fileType2 != "video")    {
                        try{
                            displayUploadError(getString("onlyimgvid") + " (" + files[file].name + ")");
                        }catch(e){}
                        continue;
                    }
                    if(allowedFileExtensions.indexOf(fileExtension2) == -1)    {
                        try{
                            displayUploadError(getString("allowedext") + ": ." + allowedFileExtensions.join(", .") + ". (" + files[file].name + ")");
                        }catch(e){}
                        continue;
                    }
                }catch(e){}
                formData.append("photovideo[]", files[file]);
            }
            if(fileInput)fileInput.value = null;
        }
    }
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        if(this.responseText.charAt(0) == '#')    {
            var responseArray = this.responseText.substring(1).split('|');
            var n = responseArray[0];
            var key = responseArray[1];
            try{
                if(localStorage.getItem("saveuploads") == "true"){
                    var uploadsStorage = localStorage.getItem("uploads");
                    if(uploadsStorage){
                        uploadsStorage = JSON.parse(uploadsStorage);
                    }else{
                        uploadsStorage = [];
                    }
                    var storage_ID = uploadsStorage.push([n, key, true, true]) - 1;
                    localStorage.setItem("uploads", JSON.stringify(uploadsStorage));
                }
            }catch(e){}
            try{
                var fullLink = window.location.href+"?"+n;
                var html = "<div class=\"boxs boxs2\"><span class=\"uploadedid\">" + getString("uploadedid") + "</span>: #" + n + "</div>";
                html += '<div class="boxs boxs2"><label for="link'+n+'"><img width="16" height="16" src="images/link.svg"><span class="link title">' + getString("link") + '</span></label><input type="text" readonly value="' + fullLink + '" id="link'+n+'"></div>';
                html += "<button onclick=location.assign(\"?" + n + "\") class=\"texts buttons afteruploadbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;<span class=\"viewupload\">"+getString("viewupload")+"</span></button>";
                html += "<button onclick=window.open(\"?" + n + "\") class=\"texts buttons afteruploadbuttons\"><img width=\"32\" height=\"32\" src=\"images/newtab.svg\"></button>";
                html += "<br><br><div class=\"descriptioninput\"><textarea id=\""+n+"\" class=\"texts writedescription\" rows=\"2\" cols=\"10\" placeholder=\""+getString("writedescription")+"...\" maxlength=\""+maxDescriptionLength+"\"></textarea><br><span id=\"charnum"+n+"\">0</span> / "+maxDescriptionLength+"</div>";
                html += "<div class=\"buttonsDivs\"><div><button id=\"b"+n+"\" class=\"texts buttons afteruploadbuttons\" disabled><img width=\"32\" height=\"32\" src=\"images/description.svg\">&nbsp;<span class=\"uploaddescription\">"+getString("uploaddescription")+"</span></button></div>";
                html += "<div><input type=\"file\" accept=\"audio/*\" id=\"v"+n+"\" onchange=uploadVoice(\""+n+"\",\""+key+"\",\""+storage_ID+"\") hidden><button id=\"vb"+n+"\" class=\"texts buttons afteruploadbuttons\" onclick=document.getElementById(\"v"+n+"\").click()><img width=\"32\" height=\"32\" src=\"images/microphone.svg\">&nbsp;<span class=\"uploadvoice\">"+getString("uploadvoice")+"</span></button><span class=\"maxvoicefilesize\">"+getString("maxvoicefilesize")+"</span>: "+(maxVoiceFileSize/1000000)+"MB</div></div>";
                html += "<br><br><div id=\"q"+n+"\" class=\"boxs boxs2\"></div>";
                after.innerHTML = html;
                subbox.insertBefore(after, subbox.childNodes[0]);
                var element = document.getElementById('q'+n);
                var textarea = document.getElementById(n);
                var button = document.getElementById("b"+n);
                button.addEventListener("click", function(){
                    uploadDescription(n,key,textarea.value,storage_ID,textarea,button,element);
                });
                var charNumSpan = document.getElementById("charnum"+n);
                textarea.addEventListener("input", function(){
                    button.disabled = textarea.value == '';
                    textarea.style.height = "0";
                    textarea.style.height = textarea.scrollHeight + "px";
                    charNumSpan.innerText = textarea.value.length;
                });
                statusText.innerHTML += typeImg + ' ' + typeString + '<span class="uploadcompleted">' + getString("uploadcompleted")+'</span>'+"\n(#" + n + ")";
                color = "#00ff00";
                if(currentUploadID == lastUploadID){
                    bottomProgressVisible(0);
                }
                addShareButton(after, fullLink);
            }catch(e){}
            if(latitude != null && longitude != null)    {
                uploadLocation(n, key, element);
            }else{
                locationUploadArray.push([n, key]);
            }
            if(!locationWait){
                unloadWarning--;
            }
        }
        else    {
            statusText.innerHTML += typeImg + ' ' + typeString + '<span class="uploadfailed">' + getString("uploadfailed") + '</span>';
            var errorDiv = document.createElement("div");
            errorDiv.style.border = "1px dotted #ff0000";
            errorDiv.innerText = this.responseText;
            statusText.appendChild(errorDiv);
            color = "#ff0000";
            if(currentUploadID == lastUploadID){
                bottomProgressVisible(0);
            }
            addRetryButton(function(){filesUpload(files, fileInput, filelink, formData, typeImg, typeString);}, status);
        }
        statusText.className = "statusText";
        statusText.style.borderColor = color;
        if(currentUploadID == lastUploadID){
            bottomProgressBar.style.backgroundColor = color;
        }
        status.insertBefore(statusText, status.childNodes[0]);
    };
    ajax.onerror = function(){
        statusText.innerHTML += typeImg + ' ' + typeString + '<span class="uploaderror">' + getString("uploaderror")+'</span>'+"\n(" + this.Error + ")";
        statusText.className = "statusText";
        color = "#ff0000";
        statusText.style.borderColor = color;
        if(currentUploadID == lastUploadID){
            bottomProgressBar.style.backgroundColor = color;
            bottomProgressVisible(0);
        }
        status.insertBefore(statusText, status.childNodes[0]);
        addRetryButton(function(){filesUpload(files, fileInput, filelink, formData, typeImg, typeString);}, status);
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
    }catch(e){
        try{
            input.parentNode.parentNode.submit();
        }catch(e){
            button.style.display = "inline-block";
            input.hidden = 0;
        }
    }
}
function buttonSetup(id0) {
    var input = document.getElementById(id0 + "input");
    var upload = document.getElementById(id0 + "upload");
    function uploadIfInput(){
        if(input.value){
            uploadFunction(input);
        }
    }
    input.addEventListener("change", function(){uploadIfInput();});
    uploadIfInput();
    var button = document.getElementById(id0 + "button");
    button.onclick = function(e){
        e.preventDefault();
        input.click();
    };
    button.tabIndex = "";
    upload.style.display = "none";
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
}catch(e){}
try{
    var fileLinkForm = document.getElementById("filelinkform");
    var fileLink = document.getElementById("filelink");
    fileLinkForm.addEventListener("submit", function(e){
        e.preventDefault();
        filesUpload(null, null, fileLink.value);
        fileLink.value = "";
    });
}catch(e){}
var darkModeEnabled;
function setDarkMode(enabled) {
    var color;
    var backgroundColor;
    if(enabled)    {
        if(localStorage.getItem("darkcolor")){
            color = localStorage.getItem("darkcolor");
        }else{
            color = "#ffffff";
        }
        if(localStorage.getItem("darkbackgroundcolor")){
            backgroundColor = localStorage.getItem("darkbackgroundcolor");
        }else{
            backgroundColor = "#000000";
        }
        document.documentElement.style.colorScheme = "dark";
    }
    else    {
        if(localStorage.getItem("lightcolor")){
            color = localStorage.getItem("lightcolor");
        }else{
            color = "#000000";
        }
        if(localStorage.getItem("lightbackgroundcolor")){
            backgroundColor = localStorage.getItem("lightbackgroundcolor");
        }else{
            backgroundColor = "#ffffff";
        }
        document.documentElement.style.colorScheme = "light";
    }
    mainDiv.style.backgroundColor = backgroundColor;
    var elements = document.getElementsByClassName("texts");
    for(var i = 0; i < elements.length; i++)   {
        elements[i].style.color = color;
    }
    elements = document.getElementsByClassName("backgrounds");
    for(var i = 0; i < elements.length; i++)   {
        elements[i].style.backgroundColor = backgroundColor;
    }
    elements = document.getElementsByClassName("icons");
    for(var i = 0; i < elements.length; i++)   {
        elements[i].style.fill = color;
    }
    darkModeEnabled = enabled;
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
try{
    var topDiv = document.getElementById("top");
    var topScrollDiv = document.createElement("div");
    var topScrollDivHeight = topDiv.clientHeight / 2;
    topScrollDiv.style.position = "fixed";
    topScrollDiv.style.top = "0";
    topScrollDiv.style.left = "0";
    topScrollDiv.style.width = "100%";
    topScrollDiv.style.backgroundColor = "#256aff80";
    topScrollDiv.style.borderBottomWidth = "2px";
    topScrollDiv.style.borderBottomColor = "#256aff";
    topScrollDiv.style.transition = "0.1s";
    topScrollDiv.style.height = "0";
    topScrollDiv.style.overflow = "hidden";
    topScrollDiv.style.display = "flex";
    topScrollDiv.style.justifyContent = "space-evenly";
    var psImg = document.createElement("img");
    psImg.src = "images/pedestriansos.svg";
    psImg.style.width = topScrollDivHeight + "px";
    psImg.style.height = topScrollDivHeight + "px";
    psImg.onclick = function(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    psImg.style.cursor = "pointer";
    topScrollDiv.appendChild(psImg);
    function addTopButton(btnid){
        var topButton = document.createElement("div");
        topButton.classList.add("backgrounds");
        topButton.style.width = topScrollDivHeight + "px";
        topButton.style.height = topScrollDivHeight + "px";
        topButton.style.cursor = "pointer";
        topButton.style.borderRadius = "10%";
        var btn = document.getElementById(btnid);
        var html = btn.innerHTML;
        topButton.innerHTML = html.substring(html.indexOf("<svg"), html.indexOf("</svg>")+1).replace('width="64" height="64"', 'width="'+topScrollDivHeight+'" height="'+topScrollDivHeight+'"');
        topButton.onclick = function(){
            btn.click();
        };
        topScrollDiv.appendChild(topButton);
    }
    addTopButton("takephotobutton");
    addTopButton("recordvideobutton");
    addTopButton("choosephotobutton");
    addTopButton("choosevideobutton");
    addTopButton("choosefilesbutton");
    addTopButton("camerabutton");
    mainDiv.appendChild(topScrollDiv);
    window.onscroll = function(){
        if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0){
            topScrollDiv.style.height = topScrollDivHeight + "px";
            topScrollDiv.style.borderBottomStyle = "solid";
        }else{
            topScrollDiv.style.height = "0";
            topScrollDiv.style.borderBottomStyle = "";
        }
    };
}catch(e){}
try{
    function inputsHaveContent(){
        var inputs = document.getElementsByTagName("input");
        for(var i = 0; i < inputs.length; i++){
            if((inputs[i].type == "text" || inputs[i].type == "url") && !inputs[i].readOnly && inputs[i].value != ""){
                return true;
            }
        }
        inputs = document.getElementsByTagName("textarea");
        for(var i = 0; i < inputs.length; i++){
            if(!inputs[i].disabled && inputs[i].value != ""){
                return true;
            }
        }
        return false;
    }
    window.addEventListener("beforeunload", function(e){
        if(unloadWarning || inputsHaveContent())    {
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
        var items = e.dataTransfer.items;
        for(var i = 0; i < items.length; i++){
            files.push(items[i].getAsFile());
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
    mainDiv.addEventListener("paste", function(e){
        if((e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") && e.target.id != pasteInput.id){
            return;
        }
        var items = e.clipboardData.items;
        if(items[0].kind == "string"){
            items[0].getAsString(function(s){
                if(!urlInput){
                    var urlInput = document.createElement("input");
                    urlInput.type = "url";
                }
                urlInput.value = s;
                if(!urlInput.checkValidity()){
                    return;
                }
                filesUpload(null, null, s);
            });
            return;
        }
        if(items[0].kind != "file"){
            return;
        }
        var files = [];
        for(var i = 0; i < items.length; i++){
            files.push(items[i].getAsFile());
        }
        filesUpload(files);
    });
    try{
        var pasteElement = document.createElement("div");
        pasteElement.innerHTML = '<label for="pasteinput"><img width="32" height="32" src="images/photovideo.svg"></label>';
        flexCenter(pasteElement);
        var pasteInput = document.createElement("input");
        pasteInput.type = "text";
        pasteInput.oninput = function(){this.value='';};
        pasteInput.style.caretColor = "transparent";
        pasteInput.placeholder = getString("pastefiles");
        pasteInput.className = "pastefiles";
        pasteInput.id = "pasteinput";
        pasteElement.appendChild(pasteInput);
        mainDiv.insertBefore(pasteElement, locationDiv);
        var br0 = document.createElement("br");
        mainDiv.insertBefore(br0, pasteElement.nextElementSibling);
        var br = document.createElement("br");
        mainDiv.insertBefore(br, br0);
    }catch(e){}
    function translateHTML(html){
        for(var key in strings) {
            html = html.replaceAll("<string>"+key+"</string>", strings[key]);
        }
        return html;
    }
    var settingsWindowOverlay = document.getElementById("settingswindowoverlay");
    settingsWindowOverlay.style.zIndex = "1";
    settingsWindowOverlay.addEventListener("click", function(e){
        if((e.target != settingsWindowOverlay) && (e.target.id != "settingsclosewindow")){
            return;
        }
        document.body.style.overflow = "visible";
        this.style.display = "none";
    });
    var settingsWindow = document.createElement("div");
    settingsWindow.style.maxWidth = "90%";
    settingsWindow.style.maxHeight = "90%";
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
    function setSettingsWindow(){
        setWindowDarkMode(settingsWindowOverlay, settingsWindow);
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "html/settings.html");
        ajax.onload = function(){
            settingsWindow.innerHTML = translateHTML(this.responseText);
            var style = document.createElement("link");
            style.rel = "stylesheet";
            style.href = "styles/settings.css";
            document.head.appendChild(style);
            var script = document.createElement("script");
            script.src = "scripts/settings.js";
            settingsWindow.appendChild(script);
        };
        ajax.send();
    }
    settingsButton.addEventListener("click", function(){
        settingsWindowOverlay.style.display = "block";
        settingsWindowOverlay.style.display = "flex";
        document.body.style.overflow = "hidden";
        if(settingsWindow.innerHTML != '')    {
            return;
        }
        setSettingsWindow();
    });
    settingsButton.innerHTML = '<svg width="64" height="64" viewBox="0 0 64 64" class="icons"><g transform="translate(0 64) scale(.1 -.1)"><path d="m257 584c-4-4-7-22-7-40 0-23-7-36-26-49-23-15-29-15-64-1l-39 15-64-112 32-26c20-17 31-35 31-51s-11-34-31-51l-32-26 32-56 32-57 36 15c19 8 38 15 42 15 20-1 45-35 50-67l6-38h65 65l6 38c5 32 30 66 50 67 4 0 23-7 42-15l36-15 64 112-32 25c-42 33-42 73 0 106l32 25-32 56-32 55-39-15c-35-14-41-14-64 1-18 12-26 27-28 53l-3 37-60 3c-34 2-64 0-68-4zm128-199c36-35 35-97-1-130-61-57-154-17-154 65 0 56 34 90 90 90 30 0 47-6 65-25z"/></g></svg> <span class="settings"><string>settings</string></span>';
    settingsButton.style.display = "inline-block";
    function setLanguage(lang,get)  {
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "json/languages/" + lang + ".json");
        ajax.onload = function()    {
            if(this.status == 200){
                document.documentElement.lang = lang;
                var json = JSON.parse(this.responseText);
                strings = json;
                for(var key in json) {
                    var elements = document.getElementsByClassName(key);
                    if(elements!=null){
                        for(var element in elements){
                            if(elements[element]!=null){
                                if(elements[element].tagName == "INPUT" || elements[element].tagName == "TEXTAREA"){
                                    if(elements[element].placeholder.includes("...")){
                                        elements[element].placeholder=json[key]+"...";
                                    }else{
                                        elements[element].placeholder=json[key];
                                    }
                                }else{
                                    elements[element].innerText=json[key];
                                }
                            };
                        }
                    }
                }
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
            if(lang != getCookie("lang")){
                setCookie("lang", lang);
            }
        };
        ajax.send();
    }
    function onLanguageChange(){
        lang = navigator.language.substring(0, 2);
        setLanguage(lang);
        if(typeof languageSelect != "undefined")languageSelect.value = lang;
    }
    var lang;
    function language(){
        lang = localStorage.getItem("lang");
        if(lang == null){
            lang = navigator.language;
            lang = lang.substring(0, 2);
            window.onlanguagechange = function(){
                onLanguageChange();
            };
        }
        setLanguage(lang);
    }
    language();
    document.getElementById("langform").remove();
}catch(e){}
try{
    window.addEventListener("storage", function(){
        try{
            darkmode();
        }catch(e){}
        try{
            language();
        }catch(e){}
    });
}catch(e){}
try{
    var isOffline;
    window.addEventListener("offline", function(){
        try{
            topScrollDiv.style.backgroundColor = "#ec040080";
            topScrollDiv.style.borderBottomColor = "#ec0400";
        }catch(e){}
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
        mainDiv.insertBefore(isOffline, mainDiv.children[1]);
        window.addEventListener("online", function(){
            isOffline.style.display = "none";
            try{
                topScrollDiv.style.backgroundColor = "#256aff80";
                topScrollDiv.style.borderBottomColor = "#256aff";
            }catch(e){}
        });
    });
}catch(e){}
try{
    if(localStorage.getItem("saveuploads") == null){
        localStorage.setItem("saveuploads", true);
    }
}catch(e){}
try{
    var myUploadsButton = document.createElement("button");
    myUploadsButton.innerHTML = '<svg width="64" height="64" viewBox="0 0 256 256" class="icons"><g transform="translate(0 256) scale(.1 -.1)"><path d="m705 2254c-326-72-588-347-646-680-16-93-6-270 21-364 94-328 381-569 723-605l67-7v31c0 30-2 31-42 31-24 0-79 9-123 19-355 86-595 390-597 756-2 305 159 563 441 704 142 72 357 96 515 57 190-46 362-167 472-333l36-55-176-177c-161-163-176-181-176-213 0-72 73-118 128-82 15 10 73 63 130 117l102 100v-240-240l-49-69c-98-140-244-252-398-305-31-10-58-19-60-19-1 0-3 38-3 85 0 89-15 137-45 149-37 14-86 6-110-19-28-27-29-54-25-410 2-173 8-197 56-215 39-15 1416-13 1449 2 51 23 55 45 55 327v259l-26 31c-19 23-34 31-59 31-88 0-95-20-95-275v-205h-600-600v95c0 88 1 95 20 95 32 0 150 48 222 91 76 44 172 129 230 202l38 49v-102c0-134 19-169 92-170 28 0 42 7 62 31l26 31v396 396l113-111c66-65 123-113 140-117 32-8 81 14 97 43 28 53 19 66-197 283-194 195-210 208-244 208-24 0-45-8-63-25-28-26-36-22-11 5 15 16 11 24-46 99-104 139-238 234-409 292-85 29-109 32-230 35-95 3-156-1-205-12z"/><path d="m762 1919c-125-62-177-214-116-337 94-188 364-188 458 0 32 64 35 152 7 213-21 46-88 111-137 131-52 22-161 18-212-7z"/><path d="m701 1405c-136-38-227-149-239-291-4-53-2-64 16-82 39-39 87-43 425-40 304 3 324 4 357 24 34 19 35 22 38 88 5 120-58 220-176 278-65 32-69 33-217 35-109 2-165-1-204-12z"/></g></svg> <span class="myuploads">' + getString("myuploads") + '</span>';
    myUploadsButton.classList.add("buttons");
    var myUploadsOverlay = document.createElement("div");
    myUploadsOverlay.id = "myuploadsoverlay";
    myUploadsOverlay.classList.add("overlay");
    myUploadsOverlay.style.backgroundColor = "#256aff80";
    var myUploadsWindow = document.createElement("div");
    myUploadsWindow.className = "backgrounds";
    myUploadsWindow.style.border = "1px solid #256aff";
    myUploadsWindow.style.borderRadius = "8px";
    var myUploadsTitle = document.createElement("h3");
    myUploadsTitle.innerHTML = '<img width="32" height="32" src="images/myuploads.svg"> <span class="myuploads">'+getString("myuploads")+'</span>';
    myUploadsTitle.style.display = "flex";
    myUploadsTitle.style.justifyContent = "center";
    myUploadsTitle.style.alignItems = "center";
    myUploadsTitle.style.margin = "0";
    var myUploadsTop = document.createElement("div");
    myUploadsTop.style.padding = "4px";
    myUploadsTop.style.borderBottom = "1px solid #256aff";
    myUploadsTop.style.display = "flex";
    myUploadsTop.style.justifyContent = "space-between";
    myUploadsTop.appendChild(myUploadsTitle);
    var closeMyUploads = document.createElement("button");
    closeMyUploads.innerHTML = "&times;";
    closeMyUploads.classList.add("closeButtons");
    function closeMyUploadsFunction(){
        document.body.style.overflow = "visible";
        myUploadsOverlay.style.display = "none";
        myUploadsContent.innerHTML = '';
    }
    closeMyUploads.onclick = function(){
        closeMyUploadsFunction();
    };
    myUploadsTop.appendChild(closeMyUploads);
    myUploadsWindow.style.maxWidth = "90%";
    myUploadsWindow.style.maxHeight = "90%";
    myUploadsWindow.appendChild(myUploadsTop);
    var myUploadsContent = document.createElement("div");
    myUploadsContent.style.overflowY = "auto";
    myUploadsContent.style.display = "flex";
    myUploadsContent.style.flexDirection = "column";
    myUploadsWindow.appendChild(myUploadsContent);
    myUploadsOverlay.appendChild(myUploadsWindow);
    myUploadsOverlay.style.display = "none";
    myUploadsOverlay.onclick = function(e){
        if(e.target.id == this.id){
            closeMyUploadsFunction();
        }
    };
    mainDiv.appendChild(myUploadsOverlay);
    myUploadsButton.onclick = function(){
        if(darkModeEnabled){
            myUploadsWindow.style.backgroundColor = "#000000";
        }else{
            myUploadsWindow.style.backgroundColor = "#ffffff";
        }
        var uploadsData = localStorage.getItem("uploads");
        if(uploadsData){
            var clearMyUploads = document.createElement("button");
            clearMyUploads.innerHTML = '<span style="color:#ec0400;font-size:32px;">&times;</span> <span class="clearall">'+getString("clearall")+'</span>';
            clearMyUploads.classList.add("buttons", "afteruploadbuttons");
            clearMyUploads.onclick = function(){
                if(confirm(getString("clearall")+"?")){
                    localStorage.removeItem("uploads");
                    myUploadsContent.innerText = getString("nodata");
                }
            };
            myUploadsContent.appendChild(clearMyUploads);
            uploadsData = JSON.parse(uploadsData);
            for(var i = uploadsData.length - 1; i >= 0; i--){
                var myUploadBox = document.createElement("div");
                myUploadBox.style.border = "2px solid #256aff";
                myUploadBox.style.margin = "4px 2px";
                myUploadBox.style.padding = "2px";
                var myUploadID = document.createElement("div");
                myUploadID.style.borderBottom = "1px solid #256aff";
                myUploadID.style.marginBottom = "1px";
                myUploadID.innerText = "#" + uploadsData[i][0];
                myUploadBox.appendChild(myUploadID);
                var myUploadView = document.createElement("a");
                myUploadView.classList.add("buttons", "afteruploadbuttons");
                myUploadView.innerHTML = '<img width="32" height="32" src="images/viewicon.svg"> <span class="viewupload">' + getString("viewupload") + '</span> <img width="32" height="32" src="images/newtab.svg">';
                myUploadView.target = "_blank";
                myUploadView.href = "?" + uploadsData[i][0];
                myUploadBox.appendChild(myUploadView);
                var myUploadDownload = document.createElement("a");
                myUploadDownload.classList.add("buttons", "afteruploadbuttons");
                myUploadDownload.innerHTML = '<img width="32" height="32" src="images/download.svg"> <span class="download">' + getString("download") + '</span>';
                myUploadDownload.download = "";
                myUploadDownload.href = "?download=" + uploadsData[i][0];
                myUploadBox.appendChild(myUploadDownload);
                addShareButton(myUploadBox, window.location.href+"?"+uploadsData[i][0]);
                var element = document.createElement("div");
                element.id = 'i'+i;
                myUploadBox.appendChild(element);
                if(uploadsData[i][2]){
                    var descriptionForm = document.createElement("form");
                    descriptionForm.innerHTML = '<textarea class="writedesciption" rows="2" cols="10" placeholder="'+getString("writedescription")+'..." maxlength="'+maxDescriptionLength+'"></textarea><br><span>0</span> / '+maxDescriptionLength+'<br><button type="submit" class="buttons afteruploadbuttons" disabled><img width="32" height="32" src="images/description.svg"> <span class="uploaddescription">'+getString("uploaddescription")+'</span></button>';
                    descriptionForm.children[0].addEventListener("input", function(){
                        this.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.disabled = this.value == '';
                        this.style.height = "0";
                        this.style.height = this.scrollHeight + "px";
                        this.nextElementSibling.nextElementSibling.innerText = this.value.length;
                    });
                    descriptionForm.id = 'd'+i;
                    descriptionForm.onsubmit = function(e){
                        e.preventDefault();
                        var i = this.id.substring(1);
                        var element = document.getElementById('i'+i);
                        uploadDescription(uploadsData[i][0], uploadsData[i][1], this.children[0].value, i, this.children[0], this.children[1], element);
                    };
                    myUploadBox.insertBefore(descriptionForm, element);
                }
                if(uploadsData[i][3]){
                    var voiceUpload = document.createElement("button");
                    voiceUpload.innerHTML = '<img width="32" height="32" src="images/microphone.svg"> <span class="uploadvoice">'+getString("uploadvoice")+'</span>';
                    voiceUpload.classList.add("buttons", "afteruploadbuttons");
                    voiceUpload.id = "vb"+i;
                    var voiceInput = document.createElement("input");
                    voiceInput.type = "file";
                    voiceInput.accept = "audio/*";
                    voiceInput.id = 'v'+i;
                    voiceInput.oninput = function(){
                        var i = this.id.substring(1);
                        var element = document.getElementById('i'+i);
                        uploadVoice(uploadsData[i][0], uploadsData[i][1], i, element, this, document.getElementById("vb"+i));
                    };
                    voiceInput.hidden = 1;
                    myUploadBox.appendChild(voiceInput);
                    voiceUpload.onclick = function(){
                        document.getElementById("v"+this.id.substring(2)).click();
                    }
                    myUploadBox.insertBefore(voiceUpload, element);
                }
                myUploadsContent.appendChild(myUploadBox);
            }
        }else{
            myUploadsContent.innerText = getString("nodata");
        }
        myUploadsOverlay.style.display = "flex";
        myUploadsContent.style.maxHeight = "calc(90vh - "+myUploadsTop.clientHeight+"px)";
        document.body.style.overflow = "hidden";
    };
    mainDiv.insertBefore(myUploadsButton, settingsButton);
    var br0 = document.createElement("br");
    mainDiv.insertBefore(br0, myUploadsButton.nextElementSibling);
    var br = document.createElement("br");
    mainDiv.insertBefore(br, br0);
}catch(e){}
try{
    var matchmedia = window.matchMedia("(prefers-color-scheme: dark)");
    function onDarkModeChange(checked){
        if(typeof darkmodecheckbox != "undefined"){
            darkmodecheckbox.checked = checked;
        }
        if(typeof settingsWindowOverlay != "undefined" && typeof settingsWindow != "undefined"){
            setWindowDarkMode(settingsWindowOverlay, settingsWindow);
        }
    }
    function defaultdarkmode()  {
        setDarkMode(matchmedia.matches);
        matchmedia.onchange = function(e){
            setDarkMode(e.matches);
            onDarkModeChange(e.matches);
        };
    }
    function darkmode(){
        if(localStorage.getItem("darkmode") == null)    {
            defaultdarkmode();
        }
        else    {
            setDarkMode(localStorage.getItem("darkmode")=="true");
            matchmedia.onchange=function(){};
        }
    }
    darkmode();
}catch(e){}
try{
    var colorFilterDefaultValue = 90;
    var lightFilter = document.createElement("div");
    lightFilter.className = "overlay";
    mainDiv.style.position = "relative";
    lightFilter.style.position = "absolute";
    lightFilter.style.pointerEvents = "none";
    lightFilter.style.mixBlendMode = "multiply";
    lightFilter.style.zIndex = "1";
    lightFilter.style.display = "none";
    mainDiv.appendChild(lightFilter);
    var r = 255;
    var g;
    var b;
    function setFilterValue(value0){
        var value = (value0 / 100.0) * 510;
        if(value < 0){
            value = 0;
        }else if(value > 510){
            value = 510;
        }
        if(value < 256){
            g = value;
            b = 0;
        }else{
            g = 255;
            b = value - 255;
        }
        lightFilter.style.backgroundColor = "rgb("+r+", "+g+", "+b+")";
        localStorage.setItem("colorfiltervalue", value0);
    }
    function colorfilter(){
        if(localStorage.getItem("colorfiltervalue")){
            setFilterValue(localStorage.getItem("colorfiltervalue"));
        }else{
            setFilterValue(colorFilterDefaultValue);
        }
        if(localStorage.getItem("colorfilterenabled") == "true"){
            lightFilter.style.display = "block";
        }else{
            lightFilter.style.display = "none";
        }
    }
    colorfilter();
}catch(e){}
setCookie("timezone", (new Date()).getTimezoneOffset(), 1000);