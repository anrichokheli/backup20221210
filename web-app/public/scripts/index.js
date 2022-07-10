var styleTag = document.createElement("link");
styleTag.rel = "stylesheet";
styleTag.href = "styles/index1.css";
document.head.appendChild(styleTag);
var mainDiv = document.getElementById("main");
var strings = null;
function getString(key)  {
    if(strings!=null)return strings[key];
    return key;
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
        var coordinatesArray = [latitude, longitude, altitude, accuracy, altitudeAccuracy];
        for(var key in locationUploadArray){
            var element;
            try{
                element = document.getElementById('q'+n_key[locationUploadArray[key][0]][0]);
            }catch(e){}
            if(element){
                uploadLocation(n_key[locationUploadArray[key][0]][1], n_key[locationUploadArray[key][0]][2], element, locationUploadArray[key][1], coordinatesArray);
            }else{
                locationPreUpload(locationUploadArray[key][0], coordinatesArray, locationUploadArray[key][2]);
            }
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
function uploadString(n, key, post, location, automaticLocation, value, element, input, button) {
    if((automaticLocation && location && !locationWait) || !location){
        unloadWarning++;
    }
    try{
        if(location){
            setUploadStatusTop(locationUploadStatus, locationUploadString, 0);
        }
    }catch(e){}
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
        try{
            div.className = "statusText";
        }catch(e){}
        div.innerHTML = img+text+'<span class="uploading">'+getString("uploading")+'</span>';
        var color = "#ffff00";
        try{
            div.style.borderColor = color;
        }catch(e){}
        var div2 = document.createElement("div");
        div2.innerText = value;
        try{
            var borderStyle = "1px dotted ";
            div2.style.border = borderStyle + color;
            div2.style.overflowY = "auto";
            div2.style.maxHeight = "50vh";
        }catch(e){}
        div.appendChild(div2);
        element.insertBefore(div, element.childNodes[0]);
    }catch(e){}
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        div = document.createElement("div");
        try{
            div.classList.add("statusText");
        }catch(e){}
        try{
            div.className = "statusText";
        }catch(e){}
        if(this.responseText === "1")    {
            try{
                if(location){
                    setUploadStatusTop(locationUploadStatus, locationUploadString, 1);
                }
            }catch(e){}
            div.innerHTML = img + text + '<span class="uploadcompleted">' + getString("uploadcompleted") + '</span>';
            color = "#00ff00";
            unloadWarning--;
            // try{
            //     if(!location && storage_ID){
            //         var uploadsArray = JSON.parse(localStorage.getItem("uploads"));
            //         uploadsArray[storage_ID][2] = false;
            //         localStorage.setItem("uploads", JSON.stringify(uploadsArray));
            //     }
            // }catch(e){}
        }
        else    {
            try{
                if(location){
                    setUploadStatusTop(locationUploadStatus, locationUploadString, -1);
                }
            }catch(e){}
            div.innerHTML = img + text + '<span class="uploadfailed">' + getString("uploadfailed") + '</span>';
            color = "#ff0000";
            // if(!location)    {
            //     input.disabled = 0;
            //     button.disabled = 0;
            // }
            var div2 = document.createElement("div");
            div2.innerText = this.responseText;
            div2.style.border = borderStyle + color;
            div.appendChild(div2);
            addRetryButton(function(){uploadString(n, key, post, location, automaticLocation, value, element, input, button);}, element);
        }
        try{
            div.style.borderColor = color;
        }catch(e){}
        element.insertBefore(div, element.childNodes[0]);
    };
    ajax.onerror = function(){
        try{
            if(location){
                setUploadStatusTop(locationUploadStatus, locationUploadString, -1);
            }
        }catch(e){}
        div = document.createElement("div");
        try{
            div.className = "statusText";
        }catch(e){}
        div.innerHTML = img + text + '<span class="uploaderror">' + getString("uploaderror") + '</span>';
        color = "#ff0000";
        div.style.borderColor = color;
        // if(!location)    {
        //     input.disabled = 0;
        //     button.disabled = 0;
        // }
        div2 = document.createElement("div");
        div2.innerText = this.Error;
        div2.style.border = borderStyle + color;
        div.appendChild(div2);
        element.insertBefore(div, element.childNodes[0]);
        addRetryButton(function(){uploadString(n, key, post, location, automaticLocation, value, element, input, button);}, element);
    };
    try{
        uploadProgressSetup(ajax, div);
    }catch(e){}
    ajax.open("POST", "/");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("id="+encodeURIComponent(n)+"&key="+encodeURIComponent(key)+post);
}
function getLocationString(data){
    if(data){
        return data;
    }else{
        return "-";
    }
}
function uploadLocation(n, key, element, automaticLocation, coordinates)   {
    uploadString(n, key, "&latitude="+encodeURIComponent(coordinates[0])+"&longitude="+encodeURIComponent(coordinates[1])+"&altitude="+encodeURIComponent(coordinates[2])+"&accuracy="+encodeURIComponent(coordinates[3])+"&altitudeAccuracy="+encodeURIComponent(coordinates[4]), true, automaticLocation, getLocationString(coordinates[0]) + ", " + getLocationString(coordinates[1]) + "; " + getLocationString(coordinates[2]) + "; " + getLocationString(coordinates[3]) + "; " + getLocationString(coordinates[4]), element);
}
function uploadDescription(n, key, descriptionValue, input, button, element)    {
    uploadString(n, key, "&description="+encodeURIComponent(descriptionValue), false, null, descriptionValue, element, input, button);
}
var maxVoiceFileSize = 25000000;
function uploadVoice(n, key, statusElement, voiceinput, button, formdata0/*voicefiles0*/)  {
    /*if(voicefiles0){
        voicefiles = voicefiles0;
    }else{
        voicefiles = voiceinput.files[0];
    }*/
    if(!formdata0){
        var voicefiles = voiceinput.files[0];
        if(!voicefiles){
            return;
        }
        if(voicefiles.size > maxVoiceFileSize){
            alert(getString("maxvoicefilesize")+": "+(maxVoiceFileSize/1000000)+"MB");
            return;
        }
    }
    unloadWarning++;
    // button.disabled = 1;
    var div = document.createElement("div");
    try{
        div.className = "statusText";
    }catch(e){}
    var text = '<span class="voice">' + getString("voice") + '</span>' + "; ";
    var img = "<img width=\"16\" height=\"16\" src=\"images/microphone.svg\"> ";
    div.innerHTML = img+text+'<span class="uploading">'+getString("uploading")+'</span>';
    div.style.borderColor = "#ffff00";
    statusElement.insertBefore(div, statusElement.childNodes[0]);
    var formData;
    if(formdata0){
        formData = formdata0;
    }else{
        formData = new FormData();
        formData.append("voice", voicefiles);
    }
    formData.append("id", n);
    formData.append("key", key);
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        div = document.createElement("div");
        try{
            div.className = "statusText";
        }catch(e){}
        if(this.responseText === "1")    {
            div.innerHTML = img+text+'<span class="uploadcompleted">'+getString("uploadcompleted")+'</span>';
            div.style.borderColor = "#00ff00";
            unloadWarning--;
            // try{
            //     if(storage_ID){
            //         var uploadsArray = JSON.parse(localStorage.getItem("uploads"));
            //         uploadsArray[storage_ID][3] = false;
            //         localStorage.setItem("uploads", JSON.stringify(uploadsArray));
            //     }
            // }catch(e){}
        }
        else    {
            div.innerHTML = img+text+'<span class="uploadfailed">'+getString("uploadfailed")+'</span>'+"\n(" + this.responseText + ")";
            div.style.borderColor = "#ff0000";
            // button.disabled = 0;
            addRetryButton(function(){uploadVoice(n, key, statusElement, voiceinput, button, formData/*formdata0*//*voicefiles0*/);}, statusElement);
        }
        statusElement.insertBefore(div, statusElement.childNodes[0]);
    };
    ajax.onerror = function(){
        div = document.createElement("div");
        try{
            div.className = "statusText";
        }catch(e){}
        div.innerHTML = img+text+'<span class="uploaderror">'+getString("uploaderror")+'</span>'+"\n(" + this.Error + ")";
        div.style.borderColor = "#ff0000";
        statusElement.insertBefore(div, statusElement.childNodes[0]);
        // button.disabled = 0;
        addRetryButton(function(){uploadVoice(n, key, statusElement, voiceinput, button, formData/*formdata0*//*voicefiles0*/);}, statusElement);
    };
    try{
        uploadProgressSetup(ajax, div);
    }catch(e){}
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
            uploadStatusBottom.style.animation = "showbottom 0.25s forwards";
        }
        else    {
            timeout1 = setTimeout(function(){
                try{
                    uploadStatusBottom.style.animation = "hidebottom 0.25s forwards";
                    timeout2 = setTimeout(function(){uploadStatusBottom.style.display = "none";}, 250);
                }catch(e){}
            }, 3000);
        }
    }catch(e){}
}
function flexCenter(element, columnDirection) {
    try{
        element.style.display = "inline-block";
        element.style.display = "inline-flex";
        element.style.alignItems = "center";
        if(columnDirection){
            element.style.flexDirection = "column";
        }
    }catch(e){}
}
try{
    var uploadStatusBottom = document.getElementById("uploadstatusbottom");
    /*try{
        uploadStatusBottom.addEventListener("click", function(){
            if(timeout1 != undefined)    {
                clearTimeout(timeout1);
            }
            if(timeout2 != undefined)    {
                clearTimeout(timeout2);
            }
            this.style.display = "none";
            this.style.bottom = "-8vh";
        });
    }catch(e){}*/
    var bottomProgressBar = document.createElement("div");
    uploadStatusBottom.appendChild(bottomProgressBar);
    var uploadstatusesdisplayed = 0;
    var maxFileSize = 25000000;
    var maxFilesNum = 10;
    var maxDescriptionLength = 100000;
    var allowedFileExtensions = ["bmp", "gif", "x-icon", "jpg", "jpeg", "png", "tiff", "webp", "x-msvideo", "mpeg", "ogg", "mp2t", "webm", "3gpp", "3gpp2", "mp4"];
    var lastUploadID = 0;
}catch(e){}
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
try{
    var uploadStatusTop = document.getElementById("uploadstatustop");
    uploadStatusTop.style.border = "1px solid #256aff";
    uploadStatusTop.innerHTML = '<div><img width="16" height="16" src="images/uploadicon.svg"> <span class="uploadstatus">' + getString("uploadstatus") + '</span></div>';
    var fileUploadStatus = document.createElement("div");
    fileUploadStatus.style.border = "2px solid #256aff";
    fileUploadStatus.style.margin = "1px";
    fileUploadStatus.style.padding = "1px";
    fileUploadStatus.innerHTML = '<img width="16" height="16" src="images/photovideo.svg"> <span class="file(s)">' + getString("file(s)") + '</span>; ';
    var fileUploadString = document.createElement("span");
    fileUploadStatus.appendChild(fileUploadString);
    uploadStatusTop.appendChild(fileUploadStatus);
    var locationUploadStatus = document.createElement("div");
    locationUploadStatus.style.border = "2px solid #256aff";
    locationUploadStatus.style.margin = "1px";
    locationUploadStatus.style.padding = "1px";
    locationUploadStatus.innerHTML = '<img width="16" height="16" src="images/location.svg"> <span class="locationcoordinates">' + getString("locationcoordinates") + '</span>; ';
    var locationUploadString = document.createElement("span");
    locationUploadStatus.appendChild(locationUploadString);
    try{
        function scrollIntoViewFunc(element){
            try{
                element.scrollIntoView();
                try{
                    window.scrollTo(0, window.scrollY - topScrollDivHeight - 3);
                }catch(e){}
            }catch(e){}
        }
        locationUploadStatus.addEventListener("click", function(){
            scrollIntoViewFunc(locationDiv);
        });
    }catch(e){}
    uploadStatusTop.appendChild(locationUploadStatus);
    function setUploadStatusTop(element, stringelement, statusValue){
        if(statusValue == 0){
            element.style.border = "2px solid #ffff00";
            stringelement.innerText = getString("uploading");
            if(element == fileUploadStatus){
                locationUploadString.innerText = '';
                locationUploadStatus.style.border = "2px solid #256aff";
            }
        }else if(statusValue == 1){
            element.style.border = "2px solid #00ff00";
            stringelement.innerText = getString("uploadcompleted");
        }else if(statusValue == -1){
            element.style.border = "2px solid #ff0000";
            stringelement.innerText = getString("uploadfailed");
        }
    }
}catch(e){}
try{
    var n_key = [];
    var locationCoordinates = [];
    var attachFiles = [];
    var descriptionTexts = [];
    var voiceFiles = [];
}catch(e){}
var fileTypeArray2;
var fileType2;
var fileExtension2;
function displayUploadError(text, element){
    var div = document.createElement("div");
    div.style.border = "2px solid #ff0000";
    div.innerText = text;
    element.insertBefore(div, element.childNodes[0]);
}
function checkFile(file, element){
    try{
        if(file.size > maxFileSize)    {
            try{
                displayUploadError(getString("maxfilesize") + " " + (maxFileSize / 1000000) + "MB. (" + file.name + ")", element);
            }catch(e){}
            return false;
        }
        fileTypeArray2 = file.type.split('/');
        fileType2 = fileTypeArray2[0];
        fileExtension2 = fileTypeArray2[1];
        if(fileType2 != "image" && fileType2 != "video")    {
            try{
                displayUploadError(getString("onlyimgvid") + " (" + file.name + ")", element);
            }catch(e){}
            return false;
        }
        if(allowedFileExtensions.indexOf(fileExtension2) == -1)    {
            try{
                displayUploadError(getString("allowedext") + ": ." + allowedFileExtensions.join(", .") + ". (" + file.name + ")", element);
            }catch(e){}
            return false;
        }
        return true;
    }catch(e){}
}
function filesAttach(n, id, key, files, formdata0, element){
    if(!element){
        var element = document.getElementById('q'+n);
    }
    var formData;
    if(formdata0){
        formData = formdata0;
    }else{
        if(!files.length){
            return;
        }
        formData = new FormData();
        for(var i = 0; i < files.length; i++){
            if(checkFile(files[i], element)){
                formData.append("photovideo[]", files[i]);
            }
        }
    }
    formData.append("id", id);
    formData.append("key", key);
    /*if(!files.length){
        return;
    }
    formData = new FormData();
    formData.append("n", n);
    formData.append("key", key);
    for(var i = 0; i < files.length; i++){
        if(checkFile(files[i], element)){
            formData.append("photovideo[]", files[i]);
        }
    }*/
    var div = document.createElement("div");
    try{
        div.classList.add("statusText");
    }catch(e){}
    try{
        div.className = "statusText";
    }catch(e){}
    var text = '<span class="file(s)">' + getString("file(s)") + '</span>' + "; ";
    var img = "<img width=\"16\" height=\"16\" src=\"images/photovideo.svg\"> ";
    div.innerHTML = img+text+'<span class="uploading">'+getString("uploading")+'</span>';
    div.style.borderColor = "#ffff00";
    element.insertBefore(div, element.childNodes[0]);
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        div = document.createElement("div");
        try{
            div.classList.add("statusText");
        }catch(e){}
        try{
            div.className = "statusText";
        }catch(e){}
        if(this.responseText == "1"){
            div.innerHTML = img+text+'<span class="uploadcompleted">'+getString("uploadcompleted")+'</span>';
            div.style.borderColor = "#00ff00";
        }else{
            div.innerHTML = img+text+'<span class="uploadfailed">'+getString("uploadfailed")+'</span>'+"\n(" + this.responseText + ")";
            div.style.borderColor = "#ff0000";
            addRetryButton(function(){filesAttach(n, id, key, files, formData, element/*formdata0*/);}, element);
        }
        element.insertBefore(div, element.childNodes[0]);
    };
    ajax.onerror = function(){
        div = document.createElement("div");
        try{
            div.classList.add("statusText");
        }catch(e){}
        try{
            div.className = "statusText";
        }catch(e){}
        div.innerHTML = img+text+'<span class="uploaderror">'+getString("uploaderror")+'</span>'+"\n(" + this.Error + ")";
        div.style.borderColor = "#ff0000";
        element.insertBefore(div, element.childNodes[0]);
        addRetryButton(function(){filesAttach(n, id, key, files, formData, element/*formdata0*/);}, element);
    };
    try{
        uploadProgressSetup(ajax, div);
    }catch(e){}
    ajax.open("POST", "/");
    ajax.send(formData);
}
function preUpload(id, value, div, imageName, stringName, array, displayValue){
    if(!array[id]){
        array[id] = [];
    }
    array[id].push(value);
    var statusText = document.createElement("div");
    statusText.innerHTML = '<img width="16" height="16" src="images/' + imageName + '.svg"> <span class="' + stringName + '">' + getString(stringName) + '</span>; <span class="uploadstartafterfile">' + getString("uploadstartafterfile") + '</span>';
    var div2 = document.createElement("div");
    div2.innerText = displayValue;
    try{
        var borderStyle = "1px dotted ";
        div2.style.border = borderStyle + color;
        div2.style.overflowY = "auto";
        div2.style.maxHeight = "50vh";
    }catch(e){}
    statusText.appendChild(div2);
    div.insertBefore(statusText, div.childNodes[0]);
}
function locationPreUpload(id, value, div){
    /*if(!locationCoordinates[id]){
        locationCoordinates[id] = [];
    }
    locationCoordinates[id].push(value);
    var statusText = document.createElement("div");
    statusText.innerHTML = '<img width="16" height="16" src="images/location.svg"> <span class="locationcoordinates">' + getString("locationcoordinates") + '</span>; <span class="uploadstartafterfile">' + getString("uploadstartafterfile") + '</span>';
    var div2 = document.createElement("div");
    div2.innerText = value.join("; ");
    try{
        var borderStyle = "1px dotted ";
        div2.style.border = borderStyle + color;
        div2.style.overflowY = "auto";
        div2.style.maxHeight = "50vh";
    }catch(e){}
    statusText.appendChild(div2);
    div.insertBefore(statusText, div.childNodes[0]);*/
    preUpload(id, value, div, "location", "locationcoordinates", locationCoordinates, value.join("; "));
}
function filesPreAttach(id, value, div){
    /*if(!attachFiles[id]){
        attachFiles[id] = [];
    }
    attachFiles[id].push(value);
    var statusText = document.createElement("div");
    statusText.innerHTML = '<img width="16" height="16" src="images/photovideo.svg"> <span class="file(s)">' + getString("file(s)") + '</span>; <span class="uploadstartafterfile">' + getString("uploadstartafterfile") + '</span>';
    div.insertBefore(statusText, div.childNodes[0]);*/
    preUpload(id, value, div, "photovideo", "file(s)", attachFiles);
}
function descriptionPreUpload(id, value, div){
    /*if(!descriptionTexts[id]){
        descriptionTexts[id] = [];
    }
    descriptionTexts[id].push(value);
    var statusText = document.createElement("div");
    statusText.innerHTML = '<img width="16" height="16" src="images/description.svg"> <span class="description">' + getString("description") + '</span>; <span class="uploadstartafterfile">' + getString("uploadstartafterfile") + '</span>';
    var div2 = document.createElement("div");
    div2.innerText = value;
    try{
        var borderStyle = "1px dotted ";
        div2.style.border = borderStyle + color;
        div2.style.overflowY = "auto";
        div2.style.maxHeight = "50vh";
    }catch(e){}
    statusText.appendChild(div2);
    div.insertBefore(statusText, div.childNodes[0]);*/
    preUpload(id, value, div, "description", "description", descriptionTexts, value);
}
function voicePreUpload(id, value, div){
    /*if(!voiceFiles[id]){
        voiceFiles[id] = [];
    }
    voiceFiles[id].push(value);
    var statusText = document.createElement("div");
    statusText.innerHTML = '<img width="16" height="16" src="images/microphone.svg"> <span class="voice">' + getString("voice") + '</span>; <span class="uploadstartafterfile">' + getString("uploadstartafterfile") + '</span>';
    div.insertBefore(statusText, div.childNodes[0]);*/
    preUpload(id, value, div, "microphone", "voice", voiceFiles);
}
function addProgressBar(element){
    var progress = document.createElement("div");
    element.appendChild(progress);
    var progressBar0 = document.createElement("div");
    try{
        progressBar0.classList.add("progressbar0");
    }catch(e){}
    try{
        progressBar0.className = "progressbar0";
    }catch(e){}
    element.appendChild(progressBar0);
    var progressBar = document.createElement("div");
    try{
        progressBar.classList.add("progressbar");
    }catch(e){}
    try{
        progressBar.className = "progressbar";
    }catch(e){}
    progressBar0.appendChild(progressBar);
    return [progressBar, progress];
}
function getProgressPercent(e){
    return ((e.loaded / e.total) * 100).toFixed(2) + '%';
}
function getProgressText(progressPercent, e){
    return progressPercent + " (" + e.loaded + " / " + e.total + ")";
}
function uploadProgressSetup(ajax, div, currentUploadID){
    var progressArray = addProgressBar(div);
    var progressBar = progressArray[0];
    var progress = progressArray[1];
    var progressPercent;
    ajax.upload.onprogress = function(e){
        progressPercent = getProgressPercent(e);
        progress.innerText = getProgressText(progressPercent, e);
        progressBar.style.width = progressPercent;
        if(currentUploadID){
            if(currentUploadID == lastUploadID){
                bottomProgressBar.style.width = progressPercent;
                uploadStatusBottom.onclick = function(){
                    scrollIntoViewFunc(progress);
                };
            }
        }
    };
}
function uploadLocationFunc(currentUploadID, automaticLocation, statusDiv, status){
    if(latitude != null && longitude != null)    {
        var n;
        var id;
        var key;
        try{
            n = n_key[currentUploadID][0];
            id = n_key[currentUploadID][1];
            key = n_key[currentUploadID][2];
        }catch(e){}
        if(n && id && key){
            uploadLocation(id, key, document.getElementById('q'+n), automaticLocation, [latitude, longitude, altitude, accuracy, altitudeAccuracy]);
        }else{
            locationPreUpload(currentUploadID, [latitude, longitude, altitude, accuracy, altitudeAccuracy], statusDiv);
        }
    }else{
        locationUploadArray.push([currentUploadID, automaticLocation, statusDiv]);
        var div = document.createElement("div");
        div.style.border = "2px solid #0000ff";
        div.style.margin = "2px";
        div.style.padding = "2px";
        div.innerHTML = '<img width="16" height="16" src="images/location.svg"><img width="16" height="16" src="images/uploadicon.svg"> <span class="locationattachafterdetect">' + getString("locationattachafterdetect") + '</span>';
        status.insertBefore(div, status.childNodes[0]);
    }
}
function filesUpload(files, fileInput, inputMode, filelink, formData0, typeImg0, typeString0, attachFiles0, locationCoordinates0, descriptionTexts0, voiceFiles0){
    var currentUploadID = ++lastUploadID;
    if(!filelink && files === null && !formData0)  {
        files = fileInput.files;
    }
    try{
        if(!filelink && !formData0){
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
            }catch(e){}
        }
        if(!formData0){
            unloadWarning++;
        }
        var subbox = document.createElement("div");
        flexCenter(subbox, 1);
        try{
            subbox.className = "boxs";
        }catch(e){}
        uploadStatuses.insertBefore(subbox, uploadStatuses.childNodes[0]);
        var status = document.createElement("div");
        try{
            status.classList.add("boxs", "boxs2");
        }catch(e){}
        var statusDiv = document.createElement("div");
        status.appendChild(statusDiv);
        subbox.appendChild(status);
        var statusText = document.createElement("div");
        var typeString;
        var typeImg;
        try{
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
        }catch(e){}
        statusText.innerHTML = typeImg + ' ' + typeString + '<span class="uploading">' + getString("uploading") + '</span>';
        statusDiv.appendChild(statusText);
        /*var progressArray = addProgressBar(statusDiv);
        var progressBar = progressArray[0];
        var progress = progressArray[1];*/
        var color = "#ffff00";
        if(filelink){
            var linkDiv = document.createElement("div");
            linkDiv.innerText = filelink;
            linkDiv.style.border = "1px dotted " + color;
            statusDiv.appendChild(linkDiv);
        }
        try{
            statusDiv.className = "statusText";
        }catch(e){}
        statusDiv.style.borderColor = color;
        if(!uploadstatusesdisplayed) {
            flexCenter(uploadStatuses, 1);
            uploadstatusesdisplayed = 1;
        }
        statusText = document.createElement("div");
        bottomProgressBar.style.backgroundColor = color;
        bottomProgressBar.style.width = "0%";
        bottomProgressVisible(1);
        var after = document.createElement("div");
        try{
            after.classList.add("boxs", "boxs2");
        }catch(e){}
        try{
            after.className = "boxs boxs2";
        }catch(e){}
        var html = '<div><input type="file" accept="image/*,video/*" id="f'+currentUploadID+'" name="photovideo[]" required multiple style=\"width:0;height:0;\"><button class="buttons afteruploadbuttons" onclick=document.getElementById("f'+currentUploadID+'").click()><img width="32" height="32" src="images/photovideo.svg">&nbsp;<span class="choosefiles">'+getString("choosefiles")+'</span></button></div><br>';
        html += "<div class=\"descriptioninput\"><textarea id=\""+currentUploadID+"\" class=\"texts writedescription\" rows=\"2\" cols=\"10\" placeholder=\""+getString("writedescription")+"...\" maxlength=\""+maxDescriptionLength+"\"></textarea><br><span id=\"charnum"+currentUploadID+"\">0</span> / "+maxDescriptionLength+"</div>";
        html += "<div class=\"buttonsDivs\"><div><button id=\"b"+currentUploadID+"\" class=\"texts buttons afteruploadbuttons\" disabled><img width=\"32\" height=\"32\" src=\"images/description.svg\">&nbsp;<span class=\"uploaddescription\">"+getString("uploaddescription")+"</span></button></div>";
        html += "<div><input type=\"file\" accept=\"audio/*\" id=\"v"+currentUploadID+"\" style=\"width:0;height:0;\"><button id=\"vb"+currentUploadID+"\" class=\"texts buttons afteruploadbuttons\" onclick=document.getElementById(\"v"+currentUploadID+"\").click()><img width=\"32\" height=\"32\" src=\"images/microphone.svg\">&nbsp;<span class=\"uploadvoice\">"+getString("uploadvoice")+"</span></button><span class=\"maxvoicefilesize\">"+getString("maxvoicefilesize")+"</span>: "+(maxVoiceFileSize/1000000)+"MB</div></div>";
        var after0 = document.createElement("div");
        after0.innerHTML = html;
        var uploadMyLocation = document.createElement("button");
        uploadMyLocation.innerHTML = '<img width="32" height="32" src="images/location.svg"><img width="32" height="32" src="images/uploadicon.svg"> <span class="attachmylocation">' + getString("attachmylocation") + '</span>';
        try{
            uploadMyLocation.classList.add("buttons", "afteruploadbuttons");
        }catch(e){}
        try{
            uploadMyLocation.className = "buttons afteruploadbuttons";
        }catch(e){}
        var automaticLocation = false;
        try{
            if(localStorage.getItem(inputMode + "locationattach") == "true"){
                automaticLocation = true;
            }
        }catch(e){
            if(inputMode == "takephoto" || inputMode == "recordvideo"){
                automaticLocation = true;
            }
        }
        uploadMyLocation.onclick = function(){
            uploadLocationFunc(currentUploadID, automaticLocation, statusDiv, status);
        };
        after0.appendChild(uploadMyLocation);
        if(!locationCoordinates0 && automaticLocation){
            uploadLocationFunc(currentUploadID, automaticLocation, statusDiv, status);
        }
        after.appendChild(after0);
        subbox.insertBefore(after, subbox.childNodes[0]);
        var filesInput = document.getElementById("f"+currentUploadID);
        filesInput.addEventListener("change", function(){
            if(!this.files.length){
                return;
            }
            var n;
            var id;
            var key;
            try{
                n = n_key[currentUploadID][0];
                id = n_key[currentUploadID][1];
                key = n_key[currentUploadID][2];
            }catch(e){}
            if(n && id && key){
                filesAttach(n, id, key, this.files);
            }else{
                var filesFormData = new FormData();
                for(var i = 0; i < this.files.length; i++){
                    if(checkFile(this.files[i], statusDiv)){
                        filesFormData.append("photovideo[]", this.files[i]);
                    }
                }
                filesPreAttach(currentUploadID, filesFormData/*this.files*/, statusDiv);
            }
            this.value = null;
        });
        var textarea = document.getElementById(currentUploadID);
        var button = document.getElementById("b"+currentUploadID);
        button.addEventListener("click", function(){
            var n;
            var id;
            var key;
            try{
                n = n_key[currentUploadID][0];
                id = n_key[currentUploadID][1];
                key = n_key[currentUploadID][2];
            }catch(e){}
            if(n && id && key){
                uploadDescription(id,key,textarea.value,textarea,button,document.getElementById('q'+n));
            }else{
                descriptionPreUpload(currentUploadID, textarea.value, statusDiv);
            }
            button.disabled = 1;
            textarea.value = '';
            document.getElementById("charnum"+currentUploadID).innerText = 0;
        });
        if(attachFiles0){
            for(var i = 0; i < attachFiles0.length; i++){
                filesPreAttach(currentUploadID, attachFiles0[i], statusDiv);
            }
        }
        if(locationCoordinates0){
            for(var i = 0; i < locationCoordinates0.length; i++){
                locationPreUpload(currentUploadID, locationCoordinates0[i], statusDiv);
            }
        }
        if(descriptionTexts0){
            for(var i = 0; i < descriptionTexts0.length; i++){
                descriptionPreUpload(currentUploadID, descriptionTexts0[i], statusDiv);
            }
        }
        if(voiceFiles0){
            for(var i = 0; i < voiceFiles0.length; i++){
                voicePreUpload(currentUploadID, voiceFiles0[i], statusDiv);
            }
        }
        var charNumSpan = document.getElementById("charnum"+currentUploadID);
        textarea.addEventListener("input", function(){
            button.disabled = textarea.value == '';
            textarea.style.height = "0";
            textarea.style.height = textarea.scrollHeight + "px";
            charNumSpan.innerText = textarea.value.length;
        });
        var vinput = document.getElementById("v"+currentUploadID);
        vinput.addEventListener("change", function(){
            var n;
            var id;
            var key;
            try{
                n = n_key[currentUploadID][0];
                id = n_key[currentUploadID][1];
                key = n_key[currentUploadID][2];
            }catch(e){}
            if(n && id && key){
                uploadVoice(id, key, document.getElementById('q'+n), document.getElementById('v'+currentUploadID), document.getElementById("vb"+currentUploadID));
            }else{
                if(this.files[0].size > maxVoiceFileSize){
                    alert(getString("maxvoicefilesize")+": "+(maxVoiceFileSize/1000000)+"MB");
                    return;
                }
                var voiceFormData = new FormData();
                voiceFormData.append("voice", this.files[0]);
                voicePreUpload(currentUploadID, voiceFormData/*this.files[0]*/, statusDiv);
            }
            this.value = null;
        });
        if(!filelink && (files.length == 1)){
            var downloadButton = document.createElement("a");
            downloadButton.innerHTML = '<img width="32" height="32" src="images/download.svg"> <span class="download">' + getString("download") + '</span>';
            try{
                downloadButton.classList.add("buttons", "afteruploadbuttons");
            }catch(e){}
            downloadButton.href = URL.createObjectURL(files[0]);
            downloadButton.download = (new Date()).getTime();
            status.appendChild(downloadButton);
            try{
                var previewDiv = document.createElement("div");
                previewDiv.style.border = "1px dotted #256aff";
                previewDiv.style.margin = "1px";
                previewDiv.style.padding = "1px";
                try{
                    previewDiv.style.display = "flex";
                    previewDiv.style.justifyContent = "center";
                }catch(e){}
                if(fileType == "image"){
                    previewDiv.innerHTML = '<img style="max-width:100%;min-height:25vh;max-height:75vh;object-fit:contain;" src="'+downloadButton.href+'">';
                }else{
                    previewDiv.innerHTML = '<video style="max-width:100%;min-height:25vh;max-height:75vh;" controls src="'+downloadButton.href+'"></video>';
                }
                status.appendChild(previewDiv);
            }catch(e){}
        }
    }catch(e){}
    try{
        setUploadStatusTop(fileUploadStatus, fileUploadString, 0);
    }catch(e){}
    try{
        fileUploadStatus.addEventListener("click", function(e){
            try{
                if(e.target.tagName != "A"){
                    scrollIntoViewFunc(subbox);
                }
            }catch(e){}
        });
    }catch(e){}
    if(formData0){
        formData = formData0;
    }else{
        var formData = new FormData();
        if(filelink){
            formData.append("filelink", filelink);
        }else{
            for(var file in files){
                if(checkFile(files[file], subbox)){
                    formData.append("photovideo[]", files[file]);
                }
            }
            if(fileInput)fileInput.value = null;
        }
    }
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        if(this.responseText.charAt(0) == '#')    {
            var responseArray = this.responseText.substring(1).split('|');
            var n = responseArray[0];
            var id = responseArray[1];
            var key = responseArray[2];
            try{
                if(localStorage.getItem("saveuploads") == "true"){
                    var uploadsStorage = localStorage.getItem("uploads");
                    if(uploadsStorage){
                        uploadsStorage = JSON.parse(uploadsStorage);
                    }else{
                        uploadsStorage = [];
                    }
                    // var storage_ID = uploadsStorage.push([n, key, true, true]) - 1;
                    uploadsStorage.push([n, id, key]);
                    localStorage.setItem("uploads", JSON.stringify(uploadsStorage));
                }
            }catch(e){}
            try{
                setUploadStatusTop(fileUploadStatus, fileUploadString, 1);
            }catch(e){}
            try{
                n_key[currentUploadID] = [n, id, key];
            }catch(e){}
            try{
                var fullLink = window.location.href+"?view&n="+n;
                html = "<div class=\"boxs boxs2\"><span class=\"uploadedid\">" + getString("uploadedid") + "</span>: #" + n + "</div>";
                html += '<div class="boxs boxs2"><label for="link'+n+'"><img width="16" height="16" src="images/link.svg"><span class="link title">' + getString("link") + '</span></label><input type="text" readonly value="' + fullLink + '" id="link'+n+'"><button class="buttons afteruploadbuttons" onclick="copyString(this.previousElementSibling.value, this.nextElementSibling)"><img width="32" height="32" src="images/copy.svg"> <span class="copy">'+getString("copy")+'</span></button><span style="padding:1px;border:1px solid #00ff00;display:none;"></span></div>';
                html += "<button onclick=location.assign(\"?view&n=" + n + "\") class=\"texts buttons afteruploadbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;<span class=\"viewupload\">"+getString("viewupload")+"</span></button>";
                html += "<button onclick=window.open(\"?view&n=" + n + "\") class=\"texts buttons afteruploadbuttons\"><img width=\"32\" height=\"32\" src=\"images/newtab.svg\"></button>";
                html += "<br><br><div id=\"q"+n+"\" class=\"boxs boxs2\"></div>";
                var after2 = document.createElement("div");
                after2.innerHTML = html;
                after.appendChild(after2);
                var element = document.getElementById('q'+n);
                statusText.innerHTML += typeImg + ' ' + typeString + '<span class="uploadcompleted">' + getString("uploadcompleted")+'</span>'+"\n(#" + n + ")";
                color = "#00ff00";
                if(currentUploadID == lastUploadID){
                    bottomProgressVisible(0);
                }
                addShareButton(after, fullLink);
            }catch(e){}
            try{
                if(attachFiles[currentUploadID]){
                    for(var i = 0; i < attachFiles[currentUploadID].length; i++){
                        if(attachFiles[currentUploadID][i]){
                            filesAttach(n, id, key, null, attachFiles[currentUploadID][i]);
                        }
                    }
                }
            }catch(e){}
            try{
                if(locationCoordinates[currentUploadID]){
                    for(var i = 0; i < locationCoordinates[currentUploadID].length; i++){
                        if(locationCoordinates[currentUploadID][i]){
                            uploadLocation(id, key, element, automaticLocation, locationCoordinates[currentUploadID][i]);
                        }
                    }
                }
            }catch(e){}
            try{
                if(descriptionTexts[currentUploadID]){
                    for(var i = 0; i < descriptionTexts[currentUploadID].length; i++){
                        if(descriptionTexts[currentUploadID][i] && descriptionTexts[currentUploadID][i] != ""){
                            uploadDescription(id,key,descriptionTexts[currentUploadID][i],null,button,element);
                        }
                    }
                }
            }catch(e){}
            try{
                if(voiceFiles[currentUploadID]){
                    for(var i = 0; i < voiceFiles[currentUploadID].length; i++){
                        if(voiceFiles[currentUploadID][i]){
                            uploadVoice(id,key,element,null,button,voiceFiles[currentUploadID][i]);
                        }
                    }
                }
            }catch(e){}
            /*if(automaticLocation){
                if(latitude != null && longitude != null)    {
                    uploadLocation(id, key, element, true);
                }else{
                    locationUploadArray.push([n, id, key, true]);
                }
                if(!locationWait){
                    unloadWarning--;
                }
            }else{
                unloadWarning--;
            }*/
            if((automaticLocation && !locationWait) || !automaticLocation){
                unloadWarning--;
            }
        }
        else    {
            try{
                setUploadStatusTop(fileUploadStatus, fileUploadString, -1);
            }catch(e){}
            statusText.innerHTML += typeImg + ' ' + typeString + '<span class="uploadfailed">' + getString("uploadfailed") + '</span>';
            var errorDiv = document.createElement("div");
            errorDiv.style.border = "1px dotted #ff0000";
            errorDiv.innerText = this.responseText;
            statusText.appendChild(errorDiv);
            color = "#ff0000";
            if(currentUploadID == lastUploadID){
                bottomProgressVisible(0);
            }
            addRetryButton(function(){filesUpload(files, fileInput, inputMode, filelink, formData, typeImg, typeString, attachFiles[currentUploadID], locationCoordinates[currentUploadID], descriptionTexts[currentUploadID], voiceFiles[currentUploadID]);}, status);
        }
        try{
            statusText.classList.add("statusText");
        }catch(e){}
        try{
            statusText.className = "statusText";
        }catch(e){}
        statusText.style.borderColor = color;
        if(currentUploadID == lastUploadID){
            bottomProgressBar.style.backgroundColor = color;
        }
        status.insertBefore(statusText, status.childNodes[0]);
    };
    ajax.onerror = function(){
        try{
            setUploadStatusTop(fileUploadStatus, fileUploadString, -1);
        }catch(e){}
        statusText.innerHTML += typeImg + ' ' + typeString + '<span class="uploaderror">' + getString("uploaderror")+'</span>'+"\n(" + this.Error + ")";
        try{
            statusText.className = "statusText";
        }catch(e){}
        color = "#ff0000";
        statusText.style.borderColor = color;
        if(currentUploadID == lastUploadID){
            bottomProgressBar.style.backgroundColor = color;
            bottomProgressVisible(0);
        }
        status.insertBefore(statusText, status.childNodes[0]);
        addRetryButton(function(){filesUpload(files, fileInput, inputMode, filelink, formData, typeImg, typeString, attachFiles[currentUploadID], locationCoordinates[currentUploadID], descriptionTexts[currentUploadID], voiceFiles[currentUploadID]);}, status);
    };
    /*var progressPercent;
    ajax.upload.onprogress = function(e){
        progressPercent = getProgressPercent(e);
        progress.innerText = getProgressText(progressPercent, e);
        progressBar.style.width = progressPercent;
        if(currentUploadID == lastUploadID){
            bottomProgressBar.style.width = progressPercent;
        }
    };*/
    try{
        uploadProgressSetup(ajax, statusDiv, currentUploadID);
    }catch(e){}
    ajax.open("POST", "/");
    ajax.send(formData);
}
var unloadWarning = 0;
function uploadFunction(input, div, inputMode){
    try{
        filesUpload(null, input, inputMode);
        /*try{
            if(localStorage.getItem(inputMode + "reopen")){
                input.click();
            }
        }catch(e){}*/
    }catch(e){
        try{
            input.parentNode.submit();
        }catch(e){
            div.style.display = "inline-block";
            input.style.width = "initial";
            input.style.height = "initial";
        }
    }
}
function buttonSetup(id0) {
    var input = document.getElementById(id0 + "input");
    var div = document.getElementById(id0 + "div");
    function uploadIfInput(){
        if(input.value){
            uploadFunction(input, div, id0);
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
    div.style.display = "none";
    input.style.width = "0";
    input.style.height = "0";
}
try{
    buttonSetup("takephoto");
    buttonSetup("recordvideo");
    buttonSetup("choosephotos");
    buttonSetup("choosevideos");
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
        filesUpload(null, null, "enterlink", fileLink.value);
        fileLink.value = "";
    });
}catch(e){}
var darkModeEnabled;
function setDarkMode(enabled) {
    var color;
    var backgroundColor;
    if(enabled)    {
        try{
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
        }catch(e){
            color = "#ffffff";
            backgroundColor = "#000000";
        }
        document.documentElement.style.colorScheme = "dark";
    }
    else    {
        try{
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
        }catch(e){
            color = "#000000";
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
    document.getElementById("camerabuttonsdiv").innerHTML = '<button class="buttons" onclick=location.assign("camera") id="camerabutton">                        <svg width="64" height="64" viewBox="0 0 1e3 999" class="icons">                            <g transform="translate(0 999) scale(.1 -.1)">                                <path d="m4690 9479c-1477-105-2788-910-3554-2182-557-926-758-2045-560-3127 177-964 686-1874 1415-2524 472-422 1001-730 1589-926 1130-377 2387-284 3449 255 1281 650 2183 1879 2411 3287 117 721 58 1463-170 2148-316 948-938 1763-1765 2315-206 137-321 204-530 307-699 344-1508 502-2285 447zm732-483c1072-116 2041-646 2714-1482 502-624 800-1367 874-2179 13-142 13-548 0-690-103-1129-652-2141-1538-2833-603-471-1318-754-2102-834-179-18-600-15-787 5-672 75-1254 284-1809 653-1753 1161-2315 3478-1291 5319 80 144 267 419 380 560 483 600 1138 1055 1868 1298 324 108 678 175 1054 201 114 7 500-4 637-18z"/>                                <path d="m4775 8724c-22-2-92-9-155-15-843-79-1662-468-2269-1078-69-70-143-147-163-172l-38-46 35-129c144-525 333-1022 599-1569 97-198 288-560 306-578 4-5 49 54 101 130 427 637 941 1158 1509 1529 264 173 859 490 1252 668 369 167 833 339 1187 440l153 43-117 85c-506 366-1103 596-1750 673-122 15-563 28-650 19z"/>                                <path d="m7355 7824c-539-155-851-267-1286-459-288-128-930-456-928-474 0-3 59-44 130-91 598-388 1146-928 1524-1500 179-270 488-843 666-1235 176-389 373-918 464-1252 16-57 31-103 35-103 7 0 88 112 167 230 314 473 517 1035 589 1630 22 181 25 628 6 800-86 748-340 1367-803 1959-91 116-479 512-501 510-7-1-35-8-63-15z"/>                                <path d="m1952 7157c-264-367-466-804-577-1245-323-1288 50-2639 987-3573 70-70 147-143 171-163l44-36 149 41c464 126 1007 334 1504 575 227 110 630 324 630 333-1 3-33 26-73 51-111 69-347 240-502 365-444 355-792 735-1090 1189-184 279-471 817-661 1234-173 379-368 906-459 1240-16 56-31 102-35 102s-43-51-88-113z"/>                                <path d="m4855 5930c-196-31-381-126-525-270-356-356-373-904-41-1299 103-123 305-247 476-293 119-31 347-31 465 1 225 60 429 201 549 380 260 384 217 882-104 1207-118 119-275 210-440 254-92 24-286 34-380 20z"/>                                <path d="m6815 4728c-187-285-438-598-678-845-456-468-879-762-1692-1173-548-277-1077-489-1584-634l-153-43 117-85c1345-973 3207-922 4513 125 131 105 349 311 454 429l59 67-46 163c-146 521-359 1066-627 1603-106 213-269 515-277 515-3 0-42-55-86-122z"/>                            </g>                        </svg>                        &nbsp;                        <span class="camera">' + getString("camera") + '</span>                    </button>                    <button class="buttons" onclick=window.open("camera")>                        <svg width="64" height="64" viewBox="0 0 512 512" class="icons">                            <g transform="translate(0 512) scale(.1 -.1)">                                <path d="m685 4428c-3-7-4-852-3-1878l3-1865h1875 1875l3 938 2 937h-190-190v-750-750h-1500-1500v1500 1500h750 750v190 190h-935c-739 0-937-3-940-12z"/>                                <path d="m3210 4165 265-265-528-528c-290-290-527-532-527-537 0-6 92-102 205-215l205-205 738 738c174 174 321 317 327 317 5 0 130-120 277-267l268-268v748 747h-747-748l265-265z"/>                            </g>                        </svg>                    </button>';
}catch(e){}
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
    topScrollDiv.style.overflowY = "hidden";
    topScrollDiv.style.overflowX = "auto";
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
    addTopButton("choosephotosbutton");
    addTopButton("choosevideosbutton");
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
        filesUpload(files, null, "enterlink");
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
                filesUpload(null, null, "enterlink", s);
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
        filesUpload(files, "choosefiles");
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
            try{
                html = html.replaceAll("<string>"+key+"</string>", strings[key]);
            }catch(e){
                html = html.replace("<string>"+key+"</string>", strings[key]);
            }
        }
        return html;
    }
}catch(e){}
function copyString(string, copiedElement){
    navigator.clipboard.writeText(string);
    copiedElement.innerText = string;
    copiedElement.style.display = "inline";
}
/*try{
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
}catch(e){}*/
try{
    var loaderStyle = document.createElement("link");
    loaderStyle.rel = "stylesheet";
    loaderStyle.href = "styles/loader.css";
    document.head.appendChild(loaderStyle);
}catch(e){}
try{
    window.addEventListener("load", function(){
        location.hash = '';
    });
}catch(e){}
try{
    function closeSettingsWindow(){
        document.body.style.overflow = "visible";
        settingsWindowOverlay.style.display = "none";
        //lightFilter.style.position = "absolute";
    }
    var settingsWindowOverlay = document.getElementById("settingswindowoverlay");
    settingsWindowOverlay.style.zIndex = "1";
    settingsWindowOverlay.addEventListener("click", function(e){
        if((e.target != settingsWindowOverlay) && (e.target.id != "settingsclosewindow")){
            return;
        }
        closeSettingsWindow();
        history.back();
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
    var disableSettingsWindowLoad;
    var settingsScript;
    var settingsMain;
    var settingsContent;
    var settingsSetup;
    function setSettingsWindow(reset){
        if(reset){
            settingsScript.remove();
        }
        disableSettingsWindowLoad = 1;
        if(!settingsMain){
            settingsMain = document.createElement("div");
            try{
                settingsMain.style.fontFamily = "sans-serif";
            }catch(e){}
            settingsMain.style.height = "100%";
            settingsMain.innerHTML = '<div id="settingstop" style="display: flex;justify-content: space-between;align-items: center;padding: 4px;"><div style="display: flex;align-items: center;"><img width="32" height="32" src="images/settings.svg">&nbsp;<h3 style="margin: 0;"><span class="settings">' + getString("settings") + '</span></h3></div><button id="settingsclosewindow" class="closeButtons">&times;</button></div><div class="settingsbottomline"></div>';
        }
        if(!settingsContent){
            settingsContent = document.createElement("div");
            settingsContent.id = "settingscontent";
            try{
                settingsContent.style.display = "flex";
                settingsContent.style.flexDirection = "column";
                settingsContent.style.alignItems = "center";
            }catch(e){
                settingsContent.style.display = "block";
            }
            settingsContent.style.padding = "4px";
            settingsContent.style.maxHeight = "calc(100% - 49px)";
            settingsContent.style.overflowY = "auto";
            settingsMain.appendChild(settingsContent);
            settingsWindow.appendChild(settingsMain);
        }
        settingsContent.innerHTML = '<div class="loader"></div>';
        try{
            setWindowDarkMode(settingsWindowOverlay, settingsWindow);
        }catch(e){}
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "?gethtml=settings");
        ajax.onload = function(){
            settingsContent.innerHTML = translateHTML(this.responseText);
            if(!settingsSetup){
                settingsSetup = 1;
                var settingsStyle = document.createElement("link");
                settingsStyle.rel = "stylesheet";
                settingsStyle.href = "styles/settings.css";
                document.head.appendChild(settingsStyle);
                settingsContent.style.maxHeight = "calc(100% - 9px - "+document.getElementById("settingstop").clientHeight+"px)";
                settingsWindow.style.height = settingsContent.clientHeight + "px";
            }
            settingsScript = document.createElement("script");
            settingsScript.src = "scripts/settings.js";
            settingsWindow.appendChild(settingsScript);
        };
        ajax.onerror = function(){
            settingsContent.innerHTML = '<div style="color:#ff0000;padding:1%;">LOAD ERROR!</div>';
            disableSettingsWindowLoad = 0;
        };
        ajax.send();
    }
    function openSettingsWindow(){
        settingsWindowOverlay.style.display = "block";
        settingsWindowOverlay.style.display = "flex";
        document.body.style.overflow = "hidden";
        //lightFilter.style.position = "";
        if(disableSettingsWindowLoad)    {
            return;
        }
        setSettingsWindow();
    }
    var settingsWindowID;
    function settingsURL(){
        if(settingsWindowOverlay.style.display == "flex"){
            closeSettingsWindow();
        }else if(location.hash == "#settings" + settingsWindowID){
            openSettingsWindow();
        }
    }
    window.addEventListener("popstate", function(){
        settingsURL();
    });
    settingsButton.addEventListener("click", function(){
        settingsWindowID = Date.now();
        location.hash = "settings" + settingsWindowID;
        openSettingsWindow();
    });
    settingsButton.innerHTML = '<svg width="64" height="64" viewBox="0 0 64 64" class="icons"><g transform="translate(0 64) scale(.1 -.1)"><path d="m257 584c-4-4-7-22-7-40 0-23-7-36-26-49-23-15-29-15-64-1l-39 15-64-112 32-26c20-17 31-35 31-51s-11-34-31-51l-32-26 32-56 32-57 36 15c19 8 38 15 42 15 20-1 45-35 50-67l6-38h65 65l6 38c5 32 30 66 50 67 4 0 23-7 42-15l36-15 64 112-32 25c-42 33-42 73 0 106l32 25-32 56-32 55-39-15c-35-14-41-14-64 1-18 12-26 27-28 53l-3 37-60 3c-34 2-64 0-68-4zm128-199c36-35 35-97-1-130-61-57-154-17-154 65 0 56 34 90 90 90 30 0 47-6 65-25z"/></g></svg> <span class="settings"><string>settings</string></span>';
    settingsButton.style.display = "inline-block";
}catch(e){}
try{
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
                try{
                    consoleWarning(strings["warning"],strings["consolewarning"]);
                }catch(e){}
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
                setCookie("lang", lang, 1000);
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
    function openMyUploads(){
        myUploadsWindow.style.height = "";
        myUploadsContent.innerHTML = '<div class="loader" style="align-self:center;"></div>';
        myUploadsOverlay.style.display = "flex";
        document.body.style.overflow = "hidden";
        if(darkModeEnabled){
            myUploadsWindow.style.backgroundColor = "#000000";
        }else{
            myUploadsWindow.style.backgroundColor = "#ffffff";
        }
        setTimeout(function(){loadMyUploads();}, 1);
    }
    var myuploadsWindowID;
    function myuploadsURL(){
        if(myUploadsOverlay.style.display == "flex"){
            closeMyUploadsFunction();
        }else if(location.hash == "#myuploads" + myuploadsWindowID){
            openMyUploads();
        }
    }
    window.addEventListener("popstate", function(){
        myuploadsURL();
    });
    closeMyUploads.onclick = function(){
        closeMyUploadsFunction();
        history.back();
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
            history.back();
        }
    };
    mainDiv.appendChild(myUploadsOverlay);
    function loadMyUploads(){
        var uploadsData = localStorage.getItem("uploads");
        if(uploadsData){
            uploadsData = JSON.parse(uploadsData);
            myUploadsContent.innerHTML = '';
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
                myUploadView.href = "?view&n=" + uploadsData[i][0];
                myUploadBox.appendChild(myUploadView);
                var myUploadDownload = document.createElement("a");
                myUploadDownload.classList.add("buttons", "afteruploadbuttons");
                myUploadDownload.innerHTML = '<img width="32" height="32" src="images/download.svg"> <span class="download">' + getString("download") + '</span>';
                myUploadDownload.download = "";
                myUploadDownload.href = "?download=" + uploadsData[i][0];
                myUploadBox.appendChild(myUploadDownload);
                addShareButton(myUploadBox, window.location.href.replace(window.location.hash, "")+"?view&n="+uploadsData[i][0]);
                var element = document.createElement("div");
                element.id = 'i'+i;
                myUploadBox.appendChild(element);
                var filesUpload = document.createElement("button");
                filesUpload.innerHTML = '<img width="32" height="32" src="images/photovideo.svg"> <span class="choosefiles">'+getString("choosefiles")+'</span>';
                filesUpload.classList.add("buttons", "afteruploadbuttons");
                filesUpload.id = "fb"+i;
                var fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*,video/*";
                fileInput.id = 'f'+i;
                fileInput.oninput = function(){
                    var i = this.id.substring(1);
                    var element = document.getElementById('i'+i);
                    filesAttach(uploadsData[i][0], uploadsData[i][1], uploadsData[i][2], this.files, null, element);
                };
                fileInput.hidden = 1;
                myUploadBox.appendChild(fileInput);
                filesUpload.onclick = function(){
                    document.getElementById("f"+this.id.substring(2)).click();
                }
                myUploadBox.insertBefore(filesUpload, element);
                // if(uploadsData[i][2]){
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
                        uploadDescription(uploadsData[i][1], uploadsData[i][2], this.children[0].value, this.children[0], this.children[1], element);
                        this.children[0].value = '';
                        this.children[2].innerText = "0";
                        this.children[4].disabled = 1;
                    };
                    myUploadBox.insertBefore(descriptionForm, element);
                // }
                // if(uploadsData[i][3]){
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
                        uploadVoice(uploadsData[i][1], uploadsData[i][2], element, this, document.getElementById("vb"+i));
                    };
                    voiceInput.hidden = 1;
                    myUploadBox.appendChild(voiceInput);
                    voiceUpload.onclick = function(){
                        document.getElementById("v"+this.id.substring(2)).click();
                    }
                    myUploadBox.insertBefore(voiceUpload, element);
                // }
                myUploadsContent.appendChild(myUploadBox);
            }
        }else{
            myUploadsContent.innerText = getString("nodata");
        }
        myUploadsWindow.style.height = myUploadsTop.clientHeight + 1 + myUploadsContent.clientHeight + "px";
        myUploadsContent.style.maxHeight = "calc(100% - 1px - "+myUploadsTop.clientHeight+"px)";
    }
    myUploadsButton.onclick = function(){
        myuploadsWindowID = Date.now();
        location.hash = "myuploads" + myuploadsWindowID;
        openMyUploads();
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
    window.addEventListener("storage", function(){
        try{
            darkmode();
        }catch(e){}
        try{
            language();
        }catch(e){}
        /*try{
            colorfilter();
        }catch(e){}*/
    });
}catch(e){}
/*try{
    var startupSetting = localStorage.getItem("startupmode");
    if(startupSetting && startupSetting != "default"){
        document.getElementById(startupSetting + "input").click();
    }
}catch(e){}*/
setCookie("timezone", (new Date()).getTimezoneOffset(), 1000);