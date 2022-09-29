var video = document.getElementById("video");
var flashLight = document.getElementById("flashlight");
var cameraFacing = localStorage.getItem("camerafacing");
if(!cameraFacing){
    cameraFacing = "environment";
}
var flashLightState = false;
var loadSetup = 1;
try{
    var urlParams = (new URL(window.location.href)).searchParams;
}catch(e){}
function cameraSetup(stream){
    video.srcObject = stream;
    var track = stream.getVideoTracks()[0];
    if(!videoRecording && !liveStreaming){
        takePhotoButton.disabled = 0;
        recordVideoButton.childNodes[0].childNodes[0].style.borderRadius = "50%";
        recordVideoButton.disabled = 0;
        liveButton.disabled = 0;
        rotate.disabled = 0;
        takePhotoDraggable.disabled = 0;
    }
    if(track.getCapabilities().torch){
        flashLight.onclick = function(){
            flashLightState = !flashLightState;
            track.applyConstraints({
                advanced: [{torch: flashLightState}]
            });
            if(flashLightState){
                flashLight.childNodes[0].src = "../images/flashlight1.svg";
            }else{
                flashLight.childNodes[0].src = "../images/flashlight0.svg";
            }
        };
        flashLight.disabled = 0;
    }
}
function cameraStart(){
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: {ideal: 1920},
            height: {ideal: 1080},
            facingMode: cameraFacing
        }
    })
    .then(function(stream){cameraSetup(stream)});
}
function cameraStop(){
    if(!video.srcObject){
        return;
    }
    video.srcObject.getTracks().forEach(function(track){
        track.stop();
    });
    video.srcObject = null;
}
var videoRecording;
var recorder;
var data;
function videoSetup(live){
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
            width: {ideal: 1920},
            height: {ideal: 1080},
            facingMode: cameraFacing
        }
    })
    .then(function(stream){cameraSetup(stream);})
    .then(function(){startRecording(video.captureStream(), live);});
}
var rotate = document.getElementById("rotate");
rotate.onclick = function(){
    this.disabled = 1;
    recordVideoButton.disabled = 1;
    takePhotoButton.disabled = 1;
    liveButton.disabled = 1;
    flashLight.disabled = 1;
    takePhotoDraggable.disabled = 1;
    if(flashLightState){
        flashLightState = 0;
        flashLight.childNodes[0].src = "../images/flashlight0.svg";
    }
    if(cameraFacing == "environment"){
        cameraFacing = "user";
    }else{
        cameraFacing = "environment";
    }
    localStorage.setItem("camerafacing", cameraFacing);
    cameraStop();
    cameraStart();
};
var canvas = document.getElementById("canvas");
/*function dataURItoBlob(dataURI){
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ua = new Uint8Array(ab);
    for(var i = 0; i < byteString.length; i++){
        ua[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}*/
var statusBox = document.getElementById("statusBox");
var statusBigBox = document.getElementById("statusBigBox");
var statusLocation = document.getElementById("statuslocation");
statusBox.addEventListener("click", function(e){
    if(e.target == statusLocation || e.target == statusLocation.children[0]){
        return;
    }
    if(statusBigBox.style.display == "flex"){
        statusBigBox.style.display = "none";
        try{
            var videos = document.querySelectorAll("#statusBigBox video");
            for(var i = 0; i < videos.length; i++){
                videos[i].pause();
            }
        }catch(e){}
    }else{
        statusBigBox.style.display = "flex";
    }
});
var status2 = document.getElementById("status2");
var statusPhotovideo = document.getElementById("statusphotovideo");
function getNoValIfNoVal(val){
    if(!val){
        return "-";
    }
    return val;
}
function getLocationString(local_latitude, local_longitude, local_altitude, local_accuracy, local_altitudeAccuracy, local_timestamp){
    local_latitude = getNoValIfNoVal(local_latitude);
    local_longitude = getNoValIfNoVal(local_longitude);
    local_altitude = getNoValIfNoVal(local_altitude);
    local_accuracy = getNoValIfNoVal(local_accuracy);
    local_altitudeAccuracy = getNoValIfNoVal(local_altitudeAccuracy);
    var timeStamp = "";
    if(local_timestamp){
        timeStamp = "\n" + getDateTime(local_timestamp) + " (" + local_timestamp + ")";
    }
    return local_latitude + ", " + local_longitude + "; " + local_altitude + "; " + local_accuracy + "; " + local_altitudeAccuracy + timeStamp;
}
var locationDetails = document.getElementById("locationDetails");
var locationDetailsCoordinates = document.createElement("div");
locationDetails.appendChild(locationDetailsCoordinates);
statusLocation.addEventListener("click", function(){
    if(locationDetails.style.display == "flex"){
        locationDetails.style.display = "none";
    }else{
        locationDetailsCoordinates.innerText = getLocationString(latitude, longitude, altitude, accuracy, altitudeAccuracy, locationTime);
        locationDetails.style.display = "flex";
    }
});
var locationUploadArray = [];
var lastUploadLocationID = 0;
function uploadLocation(n, id, key, coordinates){
    var currentUploadLocationID = ++lastUploadLocationID;
    unloadWarning++;
    if(currentUploadLocationID == lastUploadLocationID){
        statusLocation.style.backgroundColor = "#ffff0080";
    }
    addStatus("location", "locationcoordinates", "ffff00", "#" + n + "<br>" + getLocationString(coordinates[0], coordinates[1], coordinates[2], coordinates[3], coordinates[4]));
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "../");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.onload = function(){
        if(this.responseText === "1"){
            if(currentUploadLocationID == lastUploadLocationID){
                statusLocation.style.backgroundColor = "#00ff0080";
            }
            addStatus("location", "locationcoordinates", "00ff00", "#" + n);
            unloadWarning--;
        }else{
            if(currentUploadLocationID == lastUploadLocationID){
                statusLocation.style.backgroundColor = "#ff000080";
            }
            addStatus("location", "locationcoordinates", "ff0000", "#" + n + "<br>" + this.responseText);
        }
    };
    ajax.onerror = function(){
        if(currentUploadLocationID == lastUploadLocationID){
            statusLocation.style.backgroundColor = "#ff000080";
        }
        var retryButton = document.createElement("button");
        retryButton.innerHTML = '<img class="whiteicon" width="32" height="32" src="../images/retry.svg">';
        retryButton.onclick = function(){
            uploadLocation(n, id, key, coordinates);
        };
        retryButton.classList.add("buttons");
        addStatus("location", "locationcoordinates", "ff0000", "#" + n + "<br>" + this.Error, retryButton);
        var onlineFunc = function(){window.removeEventListener("online", onlineFunc);uploadLocation(n, id, key, coordinates);};
        window.addEventListener("online", onlineFunc);
    };
    ajax.send("id="+encodeURIComponent(id)+"&key="+encodeURIComponent(key)+"&latitude="+encodeURIComponent(coordinates[0])+"&longitude="+encodeURIComponent(coordinates[1])+"&altitude="+encodeURIComponent(coordinates[2])+"&accuracy="+encodeURIComponent(coordinates[3])+"&altitudeaccuracy="+encodeURIComponent(coordinates[4]));
}
var latitude;
var longitude;
var altitude;
var accuracy;
var altitudeAccuracy;
var locationTime;
var geolocationSupported;
try{
    function setStorageIfNot(local_name, local_value){
        if(!localStorage.getItem(local_name)){
            localStorage.setItem(local_name, local_value);
        }
    }
    if(navigator.geolocation){
        geolocationSupported = true;
        statusLocation.children[0].src = "../images/waitinglocation.svg";
        statusLocation.children[0].title = getString("locationcoordinates") + " | " + getString("notdetecting");
        statusLocation.children[0].classList.add("locationcoordinates", "notdetecting");
        try{
            setStorageIfNot("locationhighaccuracymode", true);
            setStorageIfNot("locationcachemode", true);
            setStorageIfNot("locationcachetimeout", 1000);
        }catch(e){}
    }else{
        statusLocation.style.borderColor = "#ff000080";
        statusLocation.children[0].src = "../images/nolocation.svg";
        statusLocation.children[0].title = getString("locationcoordinates") + " | " + getString("unavailable");
        statusLocation.children[0].classList.add("locationcoordinates", "unavailable");
        statusLocation.children[0].classList.remove("whiteicon");
        locationDetails.style.backgroundColor = "#ec040080";
    }
}catch(e){}
var watchPositionID;
var detectingLocation;
function getLocation(continuousUpdate, highAccuracy, cacheData, cacheTimeout)  {
    detectingLocation = true;
    if(watchPositionID){
        navigator.geolocation.clearWatch(watchPositionID);
        watchPositionID = null;
    }
    if(continuousUpdate){
        if(cacheData){
            watchPositionID = navigator.geolocation.watchPosition(afterLocation, locationError, {enableHighAccuracy: highAccuracy, maximumAge: cacheTimeout});
        }else{
            watchPositionID = navigator.geolocation.watchPosition(afterLocation, locationError, {enableHighAccuracy: highAccuracy});
        }
    }else{
        if(cacheData){
            navigator.geolocation.getCurrentPosition(afterLocation, locationError, {enableHighAccuracy: highAccuracy, maximumAge: cacheTimeout});
        }else{
            navigator.geolocation.getCurrentPosition(afterLocation, locationError, {enableHighAccuracy: highAccuracy});
        }
    }
    statusLocation.style.borderColor = "#ffff0080";
    statusLocation.children[0].className = '';
    statusLocation.children[0].src = "../images/detectinglocation.svg";
    statusLocation.children[0].title = getString("locationcoordinates") + " | " + getString("detecting");
    statusLocation.children[0].classList.add("locationcoordinates", "detecting");
}
function getLocation2(){
    getLocation(localStorage.getItem("currentlocationmode") == "true", localStorage.getItem("locationhighaccuracymode") == "true", localStorage.getItem("locationcachemode") == "true", parseInt(localStorage.getItem("locationcachetimeout")));
}
function afterLocation(position)  {
    detectingLocation = false;
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    altitude = position.coords.altitude;
    accuracy = position.coords.accuracy;
    altitudeAccuracy = position.coords.altitudeAccuracy;
    locationTime = position.timestamp;
    var locationCoordinatesArray = [latitude, longitude, altitude, accuracy, altitudeAccuracy];
    if(locationUploadArray.length > 0){
        for(var key in locationUploadArray){
            uploadLocation(locationUploadArray[key][0], locationUploadArray[key][1], locationUploadArray[key][2], locationCoordinatesArray);
            locationUploadArray.shift();
        }
    }
    if(locationPreUploadElements.length > 0){
        for(var key in locationPreUploadElements){
            preUpload(locationCoordinates, locationPreUploadElements[key][0], locationCoordinatesArray, locationPreUploadElements[key][1]);
            locationPreUploadElements.shift();
        }
    }
    statusLocation.style.borderColor = "#00ff0080";
    if(!statusLocation.children[0].classList.contains("whiteicon")){
        statusLocation.children[0].src = "../images/location.svg";
        statusLocation.children[0].className = '';
        statusLocation.children[0].title = getString("locationcoordinates") + " | " + getString("detected");
        statusLocation.children[0].classList.add("locationcoordinates", "detected");
        statusLocation.children[0].classList.add("whiteicon");
        locationDetails.style.backgroundColor = "#256aff80";
    }
    if(locationDetails.style.display == "flex"){
        locationDetailsCoordinates.innerText = getLocationString(latitude, longitude, altitude, accuracy, altitudeAccuracy, locationTime);
    }
    try{
        localStorage.setItem("locationallowed", "true");
    }catch(e){}
    if(locationErrorDiv){
        locationErrorDiv.remove();
        locationErrorDiv = null;
    }
    if(locationRetryButton){
        locationRetryButton.remove();
        locationRetryButton = null;
    }
}
var locationRetryButton;
var locationErrorDiv;
function locationError(error){
    detectingLocation = false;
    statusLocation.style.borderColor = "#ff000080";
    statusLocation.children[0].src = "../images/nolocation.svg";
    statusLocation.children[0].className = '';
    statusLocation.children[0].title = getString("locationcoordinates") + " | " + getString("unavailable");
    statusLocation.children[0].classList.add("locationcoordinates", "unavailable");
    // statusLocation.children[0].classList.remove("whiteicon");
    locationDetails.style.backgroundColor = "#ec040080";
    if(!locationErrorDiv){
        locationErrorDiv = document.createElement("div");
        var errorHTML = 'ERROR!<br>';
        switch(error.code)   {
            case error.PERMISSION_DENIED:
                locationErrorDiv.innerHTML = errorHTML + "permission denied";
                break;
            case error.POSITION_UNAVAILABLE:
                locationErrorDiv.innerHTML = errorHTML + "location unavailable";
                break;
            case error.TIMEOUT:
                locationErrorDiv.innerHTML = errorHTML + "request timed out";
                break;
            case error.UNKNOWN_ERROR:
                locationErrorDiv.innerHTML = errorHTML + "unknown error";
                break;
        }
        locationDetails.appendChild(locationErrorDiv);
        if(!locationRetryButton){
            locationRetryButton = document.createElement("button");
            locationRetryButton.innerHTML = '<img class="whiteicon" width="32" height="32" src="../images/retry.svg">';
            locationRetryButton.classList.add("buttons");
            locationRetryButton.addEventListener("click", function(){
                getLocation2();
            });
            locationDetails.appendChild(locationRetryButton);
        }
    }
    /*if(error.code == error.PERMISSION_DENIED){
        locationWait = 0;
    }*/
    try{
        if((error.code != error.PERMISSION_DENIED) || (localStorage.getItem("locationallowed") == "true")){
            setTimeout(getLocation, 250);
        }
    }catch(e){
        setTimeout(getLocation, 250);
    }
}
function getDateTime(millisecond){
    try{
        if(millisecond){
            var d = new Date(millisecond);
        }else{
            var d = new Date();
        }
        return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    }catch(e){
        return "";
    }
}
function preImg(image){
    var img = document.createElement("img");
    img.src = image;
    img.width = "0";
    img.height = "0";
    img.style.display = "block";
    document.body.appendChild(img);
    img.remove();
}
preImg("../images/offline.svg");
preImg("../images/retry.svg");
preImg("../images/photo.svg");
preImg("../images/video.svg");
preImg("../images/download.svg");
function addStatus(imageName, textName, color, text, html){
    var statusSubDiv = document.createElement("div");
    statusSubDiv.style.backgroundColor = "#"+color+"80";
    if(text){
        text = "<br>" + text;
    }else{
        text = '';
    }
    statusSubDiv.innerHTML = '<img class="whiteicon" width="32" height="32" src="../images/'+imageName+'.svg" title="'+getString(textName)+'">&nbsp;<span>'+getDateTime()+text+'</span>';
    if(html){
        statusSubDiv.appendChild(html);
    }
    statusBigBox.prepend(statusSubDiv);
    return statusSubDiv;
}
var unloadWarning = 0;
var topProgressBar = document.getElementById("progressbartop");
var lastUploadID = 0;
var locationCoordinates = [];
var locationPreUploadElements = [];
function preUpload(array, id, value, element){
    array[id] = value;
    var div = addStatus("location", "locationcoordinates", "ffff00", value.join("; "));
    element.appendChild(div);
}
function uploadFile(file, cameraMode, id0){
    var currentUploadID = ++lastUploadID;
    unloadWarning++;
    if(currentUploadID == lastUploadID){
        statusLocation.style.backgroundColor = "";
        topProgressBar.style.width = "0";
        topProgressBar.style.backgroundColor = "#ffff0080";
        status2.style.borderColor = "#ffff0080";
    }
    var imageName;
    var fileType = file.type.split('/')[0];
    if(fileType == "image"){
        imageName = "photo";
    }else if(fileType == "video"){
        imageName = "video";
    }
    statusPhotovideo.src = "../images/" + imageName + ".svg";
    statusPhotovideo.classList.add(imageName);
    statusPhotovideo.title = getString(imageName);
    if(statusPhotovideo.style.display != "block"){
        statusPhotovideo.style.display = "block";
    }
    var downloadButton = document.createElement("a");
    downloadButton.innerHTML = '<img class="whiteicon" width="32" height="32" src="../images/download.svg" alt>';
    downloadButton.classList.add("buttons");
    downloadButton.href = URL.createObjectURL(file);
    downloadButton.download = (new Date()).getTime();
    downloadButton.title = getString("download");
    var statusDiv = addStatus(imageName, imageName, "ffff00", null, downloadButton);
    try{
        var previewDiv = document.createElement("div");
        previewDiv.style.border = "1px solid #256aff80";
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
        statusDiv.appendChild(previewDiv);
    }catch(e){}
    var progress = document.createElement("span");
    var progressBarDiv = document.createElement("div");
    progressBarDiv.style.width = "100%";
    progressBarDiv.style.display = "flex";
    progressBarDiv.style.position = "relative";
    var progressDiv = document.createElement("div");
    progressDiv.style.position = "absolute";
    var progressBar = document.createElement("div");
    progressBar.innerText = "0";
    progressBar.style.textIndent = "-200vw";
    progressBar.style.backgroundColor = "#256aff80";
    progressBarDiv.style.borderColor = "#256aff80";
    progressDiv.style.width = "100%";
    progressDiv.style.textAlign = "center";
    progressDiv.appendChild(progress);
    progressBarDiv.appendChild(progressDiv);
    progressBarDiv.appendChild(progressBar);
    progressBarDiv.classList.add("progressbardiv");
    progressBar.classList.add("progressbar");
    statusDiv.prepend(progressBarDiv);
    var locationEnabledVal = localStorage.getItem("camera" + cameraMode + "locationattach");
    var locationUploadEnabled = ((locationEnabledVal == "true") || !locationEnabledVal);
    if(id0){
        if(locationCoordinates[id0]){
            preUpload(locationCoordinates, currentUploadID, locationCoordinates[id0], statusDiv);
        }
    }else if(locationUploadEnabled){
        if(latitude != null && longitude != null && localStorage.getItem("currentlocationmode") == "true")    {
            preUpload(locationCoordinates, currentUploadID, [latitude, longitude, altitude, accuracy, altitudeAccuracy], statusDiv);
        }else{
            if(!watchPositionID && !detectingLocation){
                getLocation2();
            }
            locationPreUploadElements.push([currentUploadID, statusDiv]);
        }
    }
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "../");
    ajax.onload = function(){
        if(this.responseText.charAt(0) == '#'){
            var responseArray = this.responseText.substring(1).split('|');
            var n = responseArray[0];
            var id = responseArray[1];
            var key = responseArray[2];
            /*if(latitude != null && longitude != null)    {
                uploadLocation(n, id, key);
            }else{
                locationUploadArray.push([n, id, key]);
            }*/
            /*if(locationUploadEnabled){
                if(locationCoordinates[currentUploadID] && localStorage.getItem("currentlocationmode") == "true"){
                    uploadLocation(n, id, key, locationCoordinates[currentUploadID]);
                }else{
                    if(!watchPositionID && !detectingLocation){
                        getLocation2();
                    }
                    locationUploadArray.push([n, id, key]);
                }
            }*/
            if(locationCoordinates[currentUploadID]){
                uploadLocation(n, id, key, locationCoordinates[currentUploadID]);
            }else{
                if(!watchPositionID && !detectingLocation){
                    getLocation2();
                }
                locationUploadArray.push([n, id, key]);
            }
            if(currentUploadID == lastUploadID){
                topProgressBar.style.backgroundColor = "#00ff0080";
                status2.style.borderColor = "#00ff0080";
            }
            var viewButton = document.createElement("a");
            viewButton.innerHTML = '<img class="whiteicon" width="32" height="32" src="../images/viewicon.svg" alt>';
            viewButton.classList.add("buttons");
            viewButton.href = "../view2?n=" + n;
            viewButton.target = "_blank";
            viewButton.title = getString("viewupload");
            viewButton.onclick = function(e){
                if(emergencyModeEnabled){
                    e.preventDefault();
                    this.classList.add("disabled");
                }
            };
            addStatus(imageName, imageName, "00ff00", "#" + n, viewButton);
            try{
                if(localStorage.getItem("saveuploads") == "true"){
                    var uploadsStorage = localStorage.getItem("uploads");
                    if(uploadsStorage){
                        uploadsStorage = JSON.parse(uploadsStorage);
                    }else{
                        uploadsStorage = [];
                    }
                    uploadsStorage.push([n, id, key/*, true, true*/]);
                    localStorage.setItem("uploads", JSON.stringify(uploadsStorage));
                }
            }catch(e){}
            unloadWarning--;
        }else{
            if(currentUploadID == lastUploadID){
                topProgressBar.style.backgroundColor = "#ff000080";
                status2.style.borderColor = "#ff000080";
            }
            var retryButton = document.createElement("button");
            retryButton.innerHTML = '<img class="whiteicon" width="32" height="32" src="../images/retry.svg">';
            retryButton.onclick = function(){
                uploadFile(file, cameraMode, currentUploadID);
            };
            retryButton.classList.add("buttons");
            addStatus(imageName, imageName, "ff0000", this.responseText, retryButton);
        }
    };
    ajax.onerror = function(){
        if(currentUploadID == lastUploadID){
            topProgressBar.style.backgroundColor = "#ff000080";
            status2.style.borderColor = "#ff000080";
        }
        var retryButton = document.createElement("button");
        retryButton.innerHTML = '<img class="whiteicon" width="32" height="32" src="../images/retry.svg">';
        retryButton.onclick = function(){
            uploadFile(file, cameraMode, currentUploadID);
        };
        retryButton.classList.add("buttons");
        addStatus(imageName, imageName, "ff0000", this.Error, retryButton);
        var onlineFunc = function(){window.removeEventListener("online", onlineFunc);uploadFile(file, cameraMode, currentUploadID);};
        window.addEventListener("online", onlineFunc);
    }
    ajax.upload.onprogress = function(e){
        progressPercent = ((e.loaded / e.total) * 100).toFixed(2) + '%';
        progress.innerText = progressPercent + " (" + e.loaded + " / " + e.total + ")";
        progressBar.style.width = progressPercent;
        if(currentUploadID == lastUploadID){
            topProgressBar.style.width = progressPercent;
        }
    };
    var formData = new FormData();
    formData.append("photovideo", file);
    ajax.send(formData);
}
var photoTakenIcon = document.getElementById("phototakenicon");
var photoTakenIconCount = 0;
var photoTakenIconTimeout;
function takePhoto(){
    unloadWarning++;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    // takingPhoto.style.backgroundColor = "#256aff40";
    clearTimeout(photoTakenIconTimeout);
    // takingPhoto.style.backgroundColor = "#ffff0040";
    if(!photoTakenIconCount++){
        photoTakenIcon.style.display = "flex";
    }
    // addStatus("take_photo", "ffff00");
    //uploadFile(dataURItoBlob(canvas.toDataURL("image/png")), "takephoto");
    addStatus("photo", "photo", "ffff00");
    if(!--photoTakenIconCount){
        photoTakenIconTimeout = setTimeout(function(){
            photoTakenIcon.style.display = "none";
        }, 1000);
    }
    canvas.toBlob(function(blob){
        uploadFile(blob, "takephoto");
        unloadWarning--;
        /*if(!--photoTakenIconCount){
            photoTakenIconTimeout = setTimeout(function(){
                photoTakenIcon.style.display = "none";
            }, 1000);
        }*/
    });
}
var takePhotoButton = document.getElementById("takephoto");
takePhotoButton.addEventListener("click", function(){
    takePhoto();
});
var recordVideoButton = document.getElementById("recordvideo");
function onVideoStop(live){
    var recordedBlob = new Blob(data, {type: "video/webm"});
    if(live){
        // data = [];
        // recorder.start();
        // liveStreamTimeout = setTimeout(function(){
        //     recorder.stop();
        // }, 1000);
    }else{
        if(recordedBlob == ""){
            cameraStop();
        }
        cameraStart();
    }
    if(recordedBlob != ""){
        if(live){
            var downloadButton = document.createElement("a");
            downloadButton.innerHTML = '<img class="whiteicon" width="32" height="32" src="../images/download.svg" alt>';
            downloadButton.classList.add("buttons");
            downloadButton.href = URL.createObjectURL(recordedBlob);
            downloadButton.download = (new Date()).getTime();
            downloadButton.title = getString("download");
            addStatus("live", "livestream", "00ff00", "#" + liveN, downloadButton);
            if(parseInt(liveErrorChunks.innerText) > 0){
                uploadFile(recordedBlob, "recordvideo");
            }
        }else{
            uploadFile(recordedBlob, "recordvideo");
            unloadWarning--;
        }
    }
    clearInterval(recordDurationInterval);
    recordDurationInterval = null;
    recordStatus.style.display = "none";
    recordDurationData = 0;
    recordDuration.innerText = '-';
}
try{
    var recordStatus = document.getElementById("recordstatus");
    var recordIcon = document.getElementById("recordicon");
    var recordDuration = document.getElementById("recordduration");
    var recordDurationData = 0;
    var recordDurationInterval;
}catch(e){}
function startRecording(stream, live){
    recorder = new MediaRecorder(stream);
    if(live){
        data = [];
        recorder.ondataavailable = function(e){
            if(navigator.onLine){
                sendLiveChunk(new Blob([e.data], {type: "video/webm"}));
            }
            data.push(e.data);
        };
        recorder.start(1000);
    }else{
        data = [];
        recorder.ondataavailable = function(e){data.push(e.data);};
        recorder.start();
        recordVideoButton.childNodes[0].childNodes[0].style.borderRadius = "0";
    }
    recordStatus.style.backgroundColor = "#256aff40";
    recordDuration.innerText = '0';
    recordDurationInterval = setInterval(function(){
        // if(navigator.onLine || videoRecording){
            recordDuration.innerText = ++recordDurationData;
        // }
    }, 1000);
    recorder.onstop = function(){onVideoStop(live);};
    takePhotoButton.disabled = 0;
    takePhotoDraggable.disabled = 0;
    if(!live){
        recordVideoButton.disabled = 0;
    }else if(!emergencyModeEnabled){
        liveButton.disabled = 0;
    }
}
function recordVideo(){
    recordVideoButton.disabled = 1;
    liveButton.disabled = 1;
    rotate.disabled = 1;
    flashLight.disabled = 1;
    takePhotoDraggable.disabled = 1;
    if(flashLightState){
        flashLightState = 0;
        flashLight.childNodes[0].src = "../images/flashlight0.svg";
    }
    takePhotoButton.disabled = 1;
    cameraStop();
    if(!videoRecording){
        unloadWarning++;
        videoRecording = 1;
        videoSetup();
        recordIcon.src = "../images/record_video.svg";
        recordIcon.classList.add("whiteicon");
        recordStatus.style.backgroundColor = "#ffff0040";
        recordStatus.style.display = "flex";
        recordStatus.title = getString("videorecording");
    }else{
        videoRecording = 0;
    }
}
recordVideoButton.addEventListener("click", function(){
    recordVideo();
});
try{
    if(geolocationSupported){
        var locationSettingsStatus = document.createElement("div");
        locationDetails.appendChild(locationSettingsStatus);
        function setLocationSettingDiv(storageName, local_div, changed){
            if(!local_div){
                local_div = document.getElementById("settingstatus"+storageName);
            }
            if(!local_div){
                return;
            }
            if(localStorage.getItem(storageName) == "true"){
                local_div.style.backgroundColor = "#00ff0080";
            }else{
                local_div.style.backgroundColor = "#ff000080";
            }
            if(changed){
                if(localStorage.getItem(storageName) == "true" && (storageName == "currentlocationmode" || storageName == "locationinitializationmode")){
                    getLocation2();
                }else if(watchPositionID){
                    navigator.geolocation.clearWatch(watchPositionID);
                    watchPositionID = null;
                }
            }
        }
        function locationModeStatusSetup(imageName, textName, storageName){
            var local_div = document.createElement("div");
            //var cachetimeoutval = '';
            /*if(storageName == "locationcachemode"){
                cachetimeoutval = '(<span id="cachetimeoutval">'+(localStorage.getItem("locationcachetimeout") / 1000)+'</span>s)';
                window.addEventListener("storage", function(){
                    locationCacheValue.innerText = localStorage.getItem("locationcachetimeout") / 1000;
                });
            }*/
            //local_div.innerHTML = '<div style="border:1px solid #256aff;text-align:center;display:inline-block;"><img width="16" height="16" src="images/'+imageName+'.svg">&nbsp;<span class="'+textName+'">'+getString(textName)+'</span>'+cachetimeoutval+'</div>';
            local_div.innerHTML = '<img class="whiteicon '+textName+'" title="'+getString(textName)+'" width="16" height="16" src="/images/'+imageName+'.svg">';
            local_div.style.display = "inline-flex";
            local_div.style.margin = "2px";
            local_div.style.padding = "2px";
            local_div.style.borderRadius = "50%";
            local_div.id = "settingstatus"+storageName;
            setLocationSettingDiv(storageName, local_div);
            window.addEventListener("storage", function(){
                setLocationSettingDiv(storageName, local_div, true);
            });
            locationSettingsStatus.appendChild(local_div);
        }
        locationModeStatusSetup("currentlocation", "currentlocation", "currentlocationmode");
        locationModeStatusSetup("locationhighaccuracy", "locationhighaccuracy", "locationhighaccuracymode");
        locationModeStatusSetup("initialization", "initiallocation", "locationinitializationmode");
        locationModeStatusSetup("cache", "locationcache", "locationcachemode");
    }
}catch(e){}
try{
    if(geolocationSupported)    {
        if(localStorage.getItem("locationinitializationmode") == "true"){
            getLocation2();
        }
    }
}catch(e){}
var offlineImg;
window.addEventListener("offline", function(){
    statusBox.style.backgroundColor = "#ec040040";
    if(liveStreaming){
        recordStatus.style.backgroundColor = "#ec040040";
        recordStatus.style.opacity = "0.5";
        // recorder.pause();
    }
    if(offlineImg){
        offlineImg.style.display = "block";
        return;
    }
    offlineImg = document.createElement("img");
    offlineImg.width = "32";
    offlineImg.height = "32";
    offlineImg.src = "../images/offline.svg";
    // offlineImg.style.backgroundColor = "#ffffff";
    statusBox.prepend(offlineImg);
    window.addEventListener("online", function(){
        offlineImg.style.display = "none";
        statusBox.style.backgroundColor = "#256aff40";
        if(liveStreaming){
            recordStatus.style.backgroundColor = "#256aff40";
            recordStatus.style.opacity = "1";
            // recorder.resume();
            uploadFile(new Blob(data, {type: "video/webm"}), "recordvideo");
        }
    });
});
function liveChunksUploaded(){
    try{
        return (liveUploadedChunks.innerText == liveTotalChunks.innerText);
    }catch(e){
        return true;
    }
}
window.addEventListener("beforeunload", function(e){
    if(unloadWarning || videoRecording || liveStreaming || !liveChunksUploaded() || locationPreUploadElements.length || locationUploadArray.length)    {
        e.preventDefault();
        e.returnValue = '';
    }
});
try{
    var takePhotoDraggable = document.getElementById("takephotodraggable");
    var dragging;
    takePhotoDraggable.onclick = function(){
        if(!dragging){
            takePhoto();
        }
    };
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    function dragElement(elmnt) {
        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragMouseDown;
        function dragMouseDown(e) {
            dragging = 0;
            e = e || window.event;
            try{
                if(e.changedTouches[0]){
                    e = e.changedTouches[0];
                }
            }catch(e){}
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchcancel = closeDragElement;
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        }
        function elementDrag(e) {
            dragging = 1;
            takePhotoDraggable.style.opacity = "0.5";
            e = e || window.event;
            try{
                if(e.changedTouches[0]){
                    e = e.changedTouches[0];
                }
            }catch(e){}
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            var topValue = (elmnt.offsetTop - pos2);
            var leftValue = (elmnt.offsetLeft - pos1);
            if(topValue < 0){
                topValue = 0;
            }else if(topValue > window.innerHeight - 72){
                topValue = window.innerHeight - 72;
            }
            if(leftValue < 0){
                leftValue = 0;
            }else if(leftValue > window.innerWidth - 72){
                leftValue = window.innerWidth - 72;
            }
            elmnt.style.top = topValue + "px";
            elmnt.style.left = leftValue + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchcancel = null;
            document.ontouchmove = null;
            takePhotoDraggable.style.opacity = "";
        }
    }
    dragElement(takePhotoDraggable);
    if(localStorage.getItem("cameramoveabletakephotobutton") == "true"){
        takePhotoDraggable.style.display = "inline-block";
    }
    window.addEventListener("storage", function(){
        if(localStorage.getItem("cameramoveabletakephotobutton") == "true"){
            takePhotoDraggable.style.display = "inline-block";
        }else{
            takePhotoDraggable.style.display = "none";
        }
    });
}catch(e){}
try{
    var bottomButtons = document.getElementById("bottombuttons");
    var psbutton = document.getElementById("psbutton");
    function setScreenOrientation(){
        if(screen.orientation.type == "portrait-primary"){
            bottomButtons.style.right = "initial";
            bottomButtons.style.left = "0";
            bottomButtons.style.bottom = "0";
            rotate.style.right = "0";
            rotate.style.left = "initial";
            flashLight.style.right = "0";
            flashLight.style.left = "initial";
            psbutton.style.right = "initial";
            psbutton.style.left = "0";
            try{
                takePhotoDraggable.style.left = "0";
                takePhotoDraggable.style.right = "initial";
            }catch(e){}
        }
        else if(screen.orientation.type == "landscape-primary"){
            bottomButtons.style.left = "initial";
            bottomButtons.style.right = "0";
            rotate.style.right = "initial";
            rotate.style.left = "64px";
            flashLight.style.right = "initial";
            flashLight.style.left = "0";
            psbutton.style.right = "initial";
            psbutton.style.left = "0";
            try{
                takePhotoDraggable.style.left = "0";
                takePhotoDraggable.style.right = "initial";
            }catch(e){}
        }
        else if(screen.orientation.type == "landscape-secondary"){
            bottomButtons.style.right = "initial";
            bottomButtons.style.left = "0";
            rotate.style.left = "initial";
            rotate.style.right = "64px";
            flashLight.style.left = "initial";
            flashLight.style.right = "0";
            psbutton.style.left = "initial";
            psbutton.style.right = "0";
            try{
                takePhotoDraggable.style.right = "0";
                takePhotoDraggable.style.left = "initial";
            }catch(e){}
        }
        try{
            takePhotoDraggable.style.top = "calc(50% - 72px)";
        }catch(e){}
    }
    window.onorientationchange = function(){
        setScreenOrientation();
    };
    window.onload = function(){
        if(screen.orientation.type == "landscape-secondary"){
            setScreenOrientation();
        }
    };
    window.onresize = function(){
        try{
            takePhotoDraggable.style.left = "0";
            takePhotoDraggable.style.right = "initial";
            takePhotoDraggable.style.top = "calc(50% - 72px)";
        }catch(e){}
    };
}catch(e){}
function ajax(method, url, onload, onerror, formdata){
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        onload(this);
    };
    ajax.onerror = function(){
        onerror(this);
    };
    ajax.open(method, url);
    ajax.send(formdata);
}
try{
    var liveStreaming = false;
    var liveButton = document.getElementById("live");
    var liveN;
    var liveID;
    var liveKey;
    function liveSetupAjaxOnload(ajax){
        if(ajax.response.charAt(0) == '#'){
            var responseArray = ajax.responseText.substring(1).split('|');
            liveN = responseArray[0];
            liveID = responseArray[1];
            liveKey = responseArray[2];
            videoSetup(true);
            var liveChunksStatus = document.createElement("div");
            liveChunksStatus.innerHTML = '<div style="background-color:#256aff80;"><span style="background-color:#00ff0080;" id="liveuploadedchunks'+liveN+'">0</span> / <span style="background-color:#0000ff80;" id="livetotalchunks'+liveN+'">0</span><br><span style="background-color:#ff000080;" id="liveerrorchunks'+liveN+'">0</span></div>';
            var downloadButton = document.createElement("a");
            downloadButton.innerHTML = '<img class="whiteicon" width="32" height="32" src="../images/download.svg" alt>';
            downloadButton.classList.add("buttons");
            downloadButton.onclick = function(){
                this.href = URL.createObjectURL(new Blob(data, {type: "video/webm"}));
            };
            downloadButton.download = (new Date()).getTime() + "";
            downloadButton.title = getString("download");
            var div = document.createElement("div");
            div.appendChild(liveChunksStatus);
            div.appendChild(downloadButton);
            addStatus("live", "livestream", "00ff00", "#" + liveN, div);
            liveUploadedChunks = document.getElementById("liveuploadedchunks"+liveN);
            liveTotalChunks = document.getElementById("livetotalchunks"+liveN);
            liveErrorChunks = document.getElementById("liveerrorchunks"+liveN);
        }else{
            liveSetupAjaxOnerror(ajax);
        }
    }
    function liveSetupAjaxOnerror(ajax){
        addStatus("live", "livestream", "ff0000", ajax.Error);
        liveStreaming = false;
        recordStatus.style.display = "none";
        cameraStart();
    }
    function liveSetup(){
        addStatus("live", "livestream", "ffff00");
        ajax("GET", "../?live=1&setup=1", liveSetupAjaxOnload, liveSetupAjaxOnerror);
    }
    var liveUploadedChunks;
    var liveTotalChunks;
    var liveErrorChunks;
    function sendLiveChunkAjaxOnload(ajax){
        if(ajax.response == "1"){
            liveUploadedChunks.innerText = parseInt(liveUploadedChunks.innerText) + 1;
        }else{
            sendLiveChunkAjaxOnerror(ajax);
        }
    }
    function sendLiveChunkAjaxOnerror(ajax){
        liveErrorChunks.innerText = parseInt(liveErrorChunks.innerText) + 1;
    }
    function sendLiveChunk(chunk){
        var formData = new FormData();
        formData.append("id", liveID);
        formData.append("key", liveKey);
        formData.append("chunk", chunk);
        liveTotalChunks.innerText = parseInt(liveTotalChunks.innerText) + 1;
        ajax("POST", "../?live=1", sendLiveChunkAjaxOnload, sendLiveChunkAjaxOnerror, formData);
    }
    function liveStream(){
        liveButton.disabled = 1;
        recordVideoButton.disabled = 1;
        rotate.disabled = 1;
        flashLight.disabled = 1;
        takePhotoDraggable.disabled = 1;
        if(flashLightState){
            flashLightState = 0;
            flashLight.childNodes[0].src = "../images/flashlight0.svg";
        }
        takePhotoButton.disabled = 1;
        cameraStop();
        if(!liveStreaming){
            liveStreaming = true;
            liveSetup();
            recordIcon.src = "../images/live.svg";
            recordIcon.classList.remove("whiteicon");
            recordStatus.style.backgroundColor = "#ffff0040";
            recordStatus.style.display = "flex";
            recordStatus.title = getString("livestreaming");
        }else{
            liveStreaming = false;
            cameraStart();
        }
    }
    liveButton.onclick = function(){
        liveStream();
    };
}catch(e){}
var emergencyModeEnabled;
function emergencyMode(){
    emergencyModeEnabled = 1;
    if(!liveStreaming){
        liveStream();
    }
    liveButton.disabled = 1;
    recordVideoButton.disabled = 1;
    // psbutton.onclick = function(e){
    //     e.preventDefault();
    // };
    psbutton.classList.add("disabled");
    emergencyModeButton.disabled = 1;
    emergencyModeButton.style.opacity = "1";
    setInterval(function(){
        if(emergencyModeButton.style.display != "none"){
            emergencyModeButton.style.display = "none";
        }else{
            emergencyModeButton.style.display = "flex";
        }
    },500);

}
try{
    var emergencyModeButton = document.getElementById("emergencymode");
    if(localStorage.getItem("cameraemergencymode") == "true"){
        emergencyModeButton.onclick = function(){
            emergencyMode();
        };
        emergencyModeButton.style.display = "flex";
    }
    window.addEventListener("storage", function(){
        if(localStorage.getItem("cameraemergencymode") == "true"){
            emergencyModeButton.style.display = "flex";
        }else{
            emergencyModeButton.style.display = "none";
        }
    });
}catch(e){}
if(localStorage.getItem("directrecordvideo") == "true" && urlParams.get("recordvideo") == 1){
    // recordVideoButton.click();
    recordVideo();
}else if(localStorage.getItem("directlivestream") == "true" && urlParams.get("livestream") == 1){
    // liveButton.click();
    liveStream();
}else{
    cameraStart();
}
try{
    document.documentElement.onclick = function(){
        if(localStorage.getItem("camerafullscreenonclick") == "true"){
            this.requestFullscreen();
        }
    };
    var onlyVideo;
    video.onclick = function(){
        if(localStorage.getItem("cameravideoonlyonclick") == "true"){
            onlyVideo = !onlyVideo;
            /*if(onlyVideo){
                var display = "none";
            }else{
                var display = "flex";
            }
            var elements = document.querySelectorAll(".buttons,#statusBox,#recordstatus");
            for(var i = 0; i < elements.length; i++){
                if(elements[i].id == "recordstatus" && display == "flex" && recordDurationInterval){
                    elements[i].style.display = display;
                }else{
                    elements[i].style.display = display;
                }
            }*/
            if(onlyVideo){
                this.style.zIndex = "10";
            }else{
                this.style.zIndex = "initial";
            }
        }
    };
    var blackscreenOverlay = document.createElement("div");
    blackscreenOverlay.style.position = "absolute";
    blackscreenOverlay.style.top = "0";
    blackscreenOverlay.style.left = "0";
    blackscreenOverlay.style.width = "100vw";
    blackscreenOverlay.style.height = "100vh";
    blackscreenOverlay.style.backgroundColor = "#000000";
    blackscreenOverlay.style.zIndex = "2";
    blackscreenOverlay.style.display = "none";
    document.body.appendChild(blackscreenOverlay);
    var blackscreenOverlayEnabled;
    function blackscreenfunc(){
        blackscreenOverlayEnabled = !blackscreenOverlayEnabled;
        if(blackscreenOverlayEnabled){
            blackscreenOverlay.style.display = "none";
        }else{
            blackscreenOverlay.style.display = "block";
        }
    }
    video.ondblclick = function(){
        if(localStorage.getItem("camerablackscreenondblclick") == "true"){
            blackscreenfunc();
        }
    };
    blackscreenOverlay.ondblclick = function(){blackscreenfunc();};
}catch(e){}
var strings;
function getString(key)  {
    if(strings && strings[key])return strings[key];
    return "!"+key;
}
function setLanguage(lang,get)  {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/json/languages/main/" + lang + ".json");
    ajax.onload = function()    {
        if(this.status == 200){
            document.documentElement.lang = lang;
            strings = JSON.parse(this.responseText);
            for(var key in strings) {
                var elements = document.getElementsByClassName(key);
                if(elements!=null){
                    for(var element in elements){
                        if(elements[element]!=null){
                            if(elements[element].title && elements[element].title.indexOf("!") == -1){
                                elements[element].title+=" | "+strings[key];
                            }else{
                                elements[element].title=strings[key];
                            }
                        };
                    }
                }
            }
            if(urlParams.get("recordvideo") == 1){
                var directName = "recordvideo";
            }else if(urlParams.get("livestream") == 1){
                var directName = "livestream";
            }
            if(directName){
                document.title = getString(directName) + " | " + getString("camera") + " | " + getString("title");
            }
        }
        else{
            var getlang = (new URL(window.location.href)).searchParams.get("lang");
            if(getlang != null && get != 1){
                lang = getlang;
                setLanguage(lang,1);
            }else if(lang != "en"){
                lang = "en";
                setLanguage(lang);
            }
        }
    };
    ajax.send();
}
var lang = localStorage.getItem("lang");
if(lang == null){
    lang = navigator.language;
    lang = lang.substring(0, 2);
}
setLanguage(lang);
try{
    if(urlParams.get("recordvideo") == 1){
        var directImage = "/images/recordvideops.svg";
    }else if(urlParams.get("livestream") == 1){
        var directImage = "/images/livestreamps.svg";
    }
    if(directImage){
        document.getElementById("favicon").href = directImage;
    }
}catch(e){}
try{
    /*if(!localStorage.getItem("mobilewebappmodecamera")){
        localStorage.setItem("mobilewebappmodecamera", true);
    }*/
    if(localStorage.getItem("mobilewebappmodecamera") == "true"){
        var metaApp = document.createElement("meta");
        metaApp.name = "mobile-web-app-capable";
        metaApp.content = "yes";
        document.head.appendChild(metaApp);
    }
}catch(e){}