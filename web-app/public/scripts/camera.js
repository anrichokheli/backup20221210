var video = document.getElementById("video");
var flashLight = document.getElementById("flashlight");
var cameraFacing = localStorage.getItem("camerafacing");
if(!cameraFacing){
    cameraFacing = "environment";
}
var flashLightState = false;
function cameraSetup(stream){
    video.srcObject = stream;
    var track = stream.getVideoTracks()[0];
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
cameraStart();
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
    flashLight.disabled = 1;
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
function dataURItoBlob(dataURI){
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ua = new Uint8Array(ab);
    for(var i = 0; i < byteString.length; i++){
        ua[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}
var statusBox = document.getElementById("statusBox");
var statusBigBox = document.getElementById("statusBigBox");
statusBox.addEventListener("click", function(){
    if(statusBigBox.style.display == "flex"){
        statusBigBox.style.display = "none";
    }else{
        statusBigBox.style.display = "flex";
    }
});
var status2 = document.getElementById("status2");
var statusPhotovideo = document.getElementById("statusphotovideo");
var statusLocation = document.getElementById("statuslocation");
var locationUploadArray = [];
function uploadLocation(n, id, key, coordinates){
    if(!locationWait){
        unloadWarning++;
    }
    statusLocation.style.backgroundColor = "#ffff0080";
    addStatus("location", "ffff00", "#" + n + "<br>" + coordinates[0] + ", " + coordinates[1] + "; " + coordinates[2] + "; " + coordinates[3] + "; " + coordinates[4]);
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "../");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.onload = function(){
        if(this.responseText === "1"){
            statusLocation.style.backgroundColor = "#00ff0080";
            addStatus("location", "00ff00", "#" + n);
            unloadWarning--;
        }else{
            statusLocation.style.backgroundColor = "#ff000080";
            addStatus("location", "ff0000", "#" + n + "<br>" + this.responseText);
        }
    };
    ajax.onerror = function(){
        statusLocation.style.backgroundColor = "#ff000080";
        var retryButton = document.createElement("button");
        retryButton.innerHTML = '<img width="32" height="32" src="../images/retry.svg">';
        retryButton.onclick = function(){
            uploadLocation(n, id, key, coordinates);
        };
        retryButton.classList.add("buttons");
        addStatus("location", "ff0000", "#" + n + "<br>" + this.Error, retryButton);
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
var locationWait;
function getLocation()  {
    if(navigator.geolocation)    {
        locationWait = 1;
        navigator.geolocation.watchPosition(afterLocation, locationError);
        statusLocation.style.borderColor = "#ffff0080";
    }
}
function afterLocation(position)  {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    altitude = position.coords.altitude;
    accuracy = position.coords.accuracy;
    altitudeAccuracy = position.coords.altitudeAccuracy;
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
}
function locationError(error){
    setTimeout(getLocation, 250);
    statusLocation.style.borderColor = "#ff000080";
    if(error.code == error.PERMISSION_DENIED){
        locationWait = 0;
    }
}
function getCurrentDateTime(){
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
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
function addStatus(imageName, color, text, html){
    var statusSubDiv = document.createElement("div");
    statusSubDiv.style.backgroundColor = "#"+color+"80";
    if(text){
        text = "<br>" + text;
    }else{
        text = '';
    }
    statusSubDiv.innerHTML = '<img width="32" height="32" src="../images/'+imageName+'.svg"> <span>'+getCurrentDateTime()+text+'</span>';
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
    var div = addStatus("location", "ffff00", value.join("; "));
    element.appendChild(div);
}
function uploadFile(file, cameraMode, id0){
    var currentUploadID = ++lastUploadID;
    unloadWarning++;
    statusLocation.style.backgroundColor = "";
    topProgressBar.style.width = "0";
    topProgressBar.style.backgroundColor = "#ffff0080";
    status2.style.borderColor = "#ffff0080";
    var imageName;
    var fileType = file.type.split('/')[0];
    if(fileType == "image"){
        imageName = "photo";
    }else if(fileType == "video"){
        imageName = "video";
    }
    statusPhotovideo.src = "../images/" + imageName + ".svg";
    if(statusPhotovideo.style.display != "block"){
        statusPhotovideo.style.display = "block";
    }
    var downloadButton = document.createElement("a");
    downloadButton.innerHTML = '<img width="32" height="32" src="../images/download.svg">';
    downloadButton.classList.add("buttons");
    downloadButton.href = URL.createObjectURL(file);
    downloadButton.download = (new Date()).getTime();
    var statusDiv = addStatus(imageName, "ffff00", null, downloadButton);
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
    var locationUploadEnabled = (localStorage.getItem("camera" + cameraMode + "locationattach") == "true");
    if(id0){
        preUpload(locationCoordinates, currentUploadID, locationCoordinates[id0], statusDiv);
    }else if(locationUploadEnabled){
        if(latitude != null && longitude != null)    {
            preUpload(locationCoordinates, currentUploadID, [latitude, longitude, altitude, accuracy, altitudeAccuracy], statusDiv);
        }else{
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
            if(locationUploadEnabled){
                if(locationCoordinates[currentUploadID]){
                    uploadLocation(n, id, key, locationCoordinates[currentUploadID]);
                }else{
                    locationUploadArray.push([n, id, key]);
                }
            }
            topProgressBar.style.backgroundColor = "#00ff0080";
            status2.style.borderColor = "#00ff0080";
            var viewButton = document.createElement("a");
            viewButton.innerHTML = '<img width="32" height="32" src="../images/viewicon.svg">';
            viewButton.classList.add("buttons");
            viewButton.href = "../view2?n=" + n;
            viewButton.target = "_blank";
            addStatus(imageName, "00ff00", "#" + n, viewButton);
            try{
                if(localStorage.getItem("saveuploads") == "true"){
                    var uploadsStorage = localStorage.getItem("uploads");
                    if(uploadsStorage){
                        uploadsStorage = JSON.parse(uploadsStorage);
                    }else{
                        uploadsStorage = [];
                    }
                    uploadsStorage.push([n, id, key, true, true]);
                    localStorage.setItem("uploads", JSON.stringify(uploadsStorage));
                }
            }catch(e){}
            if(!locationWait){
                unloadWarning--;
            }
        }else{
            topProgressBar.style.backgroundColor = "#ff000080";
            status2.style.borderColor = "#ff000080";
            var retryButton = document.createElement("button");
            retryButton.innerHTML = '<img width="32" height="32" src="../images/retry.svg">';
            retryButton.onclick = function(){
                uploadFile(file, cameraMode, currentUploadID);
            };
            retryButton.classList.add("buttons");
            addStatus(imageName, "ff0000", this.responseText, retryButton);
        }
    };
    ajax.onerror = function(){
        topProgressBar.style.backgroundColor = "#ff000080";
        status2.style.borderColor = "#ff000080";
        var retryButton = document.createElement("button");
        retryButton.innerHTML = '<img width="32" height="32" src="../images/retry.svg">';
        retryButton.onclick = function(){
            uploadFile(file, cameraMode, currentUploadID);
        };
        retryButton.classList.add("buttons");
        addStatus(imageName, "ff0000", this.Error, retryButton);
        var onlineFunc = function(){window.removeEventListener("online", onlineFunc);uploadFile(file, cameraMode, currentUploadID);};
        window.addEventListener("online", onlineFunc);
    }
    ajax.upload.onprogress = function(e){
        progressPercent = ((e.loaded / e.total) * 100).toFixed(2) + '%';
        progress.innerText = progressPercent + " (" + e.loaded + " / " + e.total + ")";
        progressBar.style.width = progressPercent;
        topProgressBar.style.width = progressPercent;
    };
    var formData = new FormData();
    formData.append("photovideo", file);
    ajax.send(formData);
}
function takePhoto(){
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    uploadFile(dataURItoBlob(canvas.toDataURL("image/png")), "takephoto");
}
document.getElementById("takephoto").addEventListener("click", function(){
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
        videoRecording = 0;
        recordVideoButton.childNodes[0].childNodes[0].style.borderRadius = "50%";
        recordVideoButton.disabled = 0;
    }
    if(recordedBlob != ""){
        if(live){
            var downloadButton = document.createElement("a");
            downloadButton.innerHTML = '<img width="32" height="32" src="../images/download.svg">';
            downloadButton.classList.add("buttons");
            downloadButton.href = URL.createObjectURL(recordedBlob);
            downloadButton.download = (new Date()).getTime();
            addStatus("live", "00ff00", "#" + liveN, downloadButton);
            if(parseInt(liveErrorChunks.innerText) > 0){
                uploadFile(recordedBlob, "recordvideo");
            }
        }else{
            uploadFile(recordedBlob, "recordvideo");
        }
    }
    clearInterval(recordDurationInterval);
    recordStatus.style.display = "none";
}
try{
    var recordStatus = document.getElementById("recordstatus");
    var recordIcon = document.getElementById("recordicon");
    var recordDuration = document.getElementById("recordduration");
    var recordDurationData;
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
        recordIcon.src = "../images/live.svg";
    }else{
        data = [];
        recorder.ondataavailable = function(e){data.push(e.data);};
        recorder.start();
        videoRecording = 1;
        recordVideoButton.childNodes[0].childNodes[0].style.borderRadius = "0";
        recordIcon.src = "../images/record_video.svg";
    }
    recordDurationData = 0;
    recordDuration.innerText = recordDurationData;
    recordDurationInterval = setInterval(function(){
        // if(navigator.onLine || videoRecording){
            recordDuration.innerText = ++recordDurationData;
        // }
    }, 1000);
    recordStatus.style.display = "flex";
    recorder.onstop = function(){onVideoStop(live);};
    if(!live){
        recordVideoButton.disabled = 0;
    }
}
recordVideoButton.addEventListener("click", function(){
    recordVideoButton.disabled = 1;
    cameraStop();
    if(!videoRecording){
        liveButton.disabled = 1;
        rotate.disabled = 1;
        videoSetup();
    }else{
        liveButton.disabled = 0;
        rotate.disabled = 0;
    }
});
getLocation();
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
    statusBox.prepend(offlineImg);
    window.addEventListener("online", function(){
        offlineImg.style.display = "none";
        statusBox.style.backgroundColor = "#256aff40";
        if(liveStreaming){
            recordStatus.style.backgroundColor = "#256aff40";
            recordStatus.style.opacity = "1";
            // recorder.resume();
        }
    });
});
window.addEventListener("beforeunload", function(e){
    if(unloadWarning || videoRecording || liveStreaming || (liveUploadedChunks.innerText != liveTotalChunks.innerText))    {
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
            takePhotoDraggable.style.left = "0";
            takePhotoDraggable.style.right = "initial";
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
            takePhotoDraggable.style.left = "0";
            takePhotoDraggable.style.right = "initial";
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
            takePhotoDraggable.style.right = "0";
            takePhotoDraggable.style.left = "initial";
        }
        takePhotoDraggable.style.top = "calc(50% - 72px)";
    }
    window.onorientationchange = function(){
        setScreenOrientation();
    };
    window.onload = function(){
        if(screen.orientation.type == "landscape-secondary"){
            setScreenOrientation();
        }
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
            addStatus("live", "00ff00", "#" + liveN, liveChunksStatus);
            liveUploadedChunks = document.getElementById("liveuploadedchunks"+liveN);
            liveTotalChunks = document.getElementById("livetotalchunks"+liveN);
            liveErrorChunks = document.getElementById("liveerrorchunks"+liveN);
        }else{
            liveSetupAjaxOnerror(ajax);
        }
    }
    function liveSetupAjaxOnerror(ajax){
        addStatus("live", "ff0000", ajax.Error);
    }
    function liveSetup(){
        addStatus("live", "ffff00");
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
    liveButton.onclick = function(){
        cameraStop();
        if(!liveStreaming){
            liveStreaming = true;
            recordVideoButton.disabled = 1;
            rotate.disabled = 1;
            liveSetup();
        }else{
            liveStreaming = false;
            recordVideoButton.disabled = 0;
            rotate.disabled = 0;
            cameraStart();
        }
    };
}catch(e){}
try{
    var onlyVideo;
    video.onclick = function(){
        document.documentElement.requestFullscreen();
        onlyVideo = !onlyVideo;
        if(onlyVideo){
            var display = "none";
        }else{
            var display = "flex";
        }
        var elements = document.querySelectorAll(".buttons,#statusBox,#recordstatus");
        for(var i = 0; i < elements.length; i++){
            if(elements[i].id == "recordstatus" && display == "flex"){
                if(videoRecording || liveStreaming){
                    elements[i].style.display = display;
                }
            }else{
                elements[i].style.display = display;
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
    video.ondblclick = function(){blackscreenfunc();};
    blackscreenOverlay.ondblclick = function(){blackscreenfunc();};
}catch(e){}