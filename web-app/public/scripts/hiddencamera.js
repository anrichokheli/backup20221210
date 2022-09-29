var video = document.getElementById("video");
var screenDiv = document.getElementById("screen");
var backgroundImageSetup;
function backgroundImageSetupIfNot(){
    if(!backgroundImageSetup){
        backgroundImageSetup = 1;
        screenDiv.style.backgroundRepeat = "no-repeat";
        screenDiv.style.backgroundPosition = "center";
        screenDiv.style.backgroundSize = "contain";
    }
}
function backgroundImageFunc(name){
    var backgroundImageStorage = localStorage.getItem("hiddencamerabackgroundimage" + name);
    if(backgroundImageStorage){
        screenDiv.style.backgroundImage = 'url("' + backgroundImageStorage + '")';
        backgroundImageSetupIfNot();
    }
}
backgroundImageFunc("");
backgroundImageFunc("cameranotready");
var cameraNotReadyColor = localStorage.getItem("hiddencameracameranotreadycolor");
if(cameraNotReadyColor){
    screenDiv.style.backgroundColor = cameraNotReadyColor;
}
var cameraReady;
var mode = (new URL(window.location.href)).searchParams.get("mode");
var enabled;
if(
    (mode == "takephoto" && localStorage.getItem("takephotohiddencamera") == "true")
    ||
    (mode == "recordvideo" && localStorage.getItem("recordvideohiddencamera") == "true")
    ||
    (mode == "livestream" && localStorage.getItem("livestreamhiddencamera") == "true")
    ){
    enabled = 1;
}
var fullscreen = document.getElementById("fullscreen");
fullscreen.onclick = function(){
    document.documentElement.requestFullscreen();
};
if(localStorage.getItem("hiddencamerafullscreenbutton") == "true"){
    fullscreen.style.display = "initial";
}
document.onfullscreenchange = function(){
    if(fullscreen.style.display == "none"){
        fullscreen.style.display = "initial";
    }else{
        fullscreen.style.display = "none";
    }
};
function cameraSetup(stream){
    video.srcObject = stream;
}
var cameraReadyColor = localStorage.getItem("hiddencameracamerareadycolor");
if(!cameraReadyColor){
    cameraReadyColor = "#000";
}
var onplaySetup;
video.onplay = function(){
    cameraReady = 1;
    if(!onplaySetup){
        onplaySetup = 1;
        screenDiv.style.backgroundColor = cameraReadyColor;
        backgroundImageFunc("cameraready");
    }
};
var cameraFacing;
var cameraFacingStorage = localStorage.getItem("hiddencamerafacingmode");
if(cameraFacingStorage){
    cameraFacing = cameraFacingStorage;
}else{
    cameraFacing = "environment";
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
var canvas = document.getElementById("canvas");
function takePhoto(){
    beforeUnloadWarning++;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    canvas.toBlob(function(blob){
        uploadFile(blob);
        beforeUnloadWarning--;
    });
}
var videoRecording;
var recorder;
var data;
function onVideoStop(live){
    var recordedBlob = new Blob(data, {type: "video/webm"});
    if(!live){
        if(recordedBlob == ""){
            cameraStop();
        }
        cameraStart();
    }
    if(recordedBlob != ""){
        if(live){
            if(liveErrorChunks > 0){
                uploadFile(recordedBlob, "recordvideo");
            }
        }else{
            uploadFile(recordedBlob, "recordvideo");
            beforeUnloadWarning--;
        }
    }
}
var colorfulindicatorEnabled = localStorage.getItem("hiddencameracolorfulindicator") == "true";
if(colorfulindicatorEnabled){
    var colorfulindicatorSize = localStorage.getItem("hiddencameracolorfulindicatorsize");
    if(!colorfulindicatorSize){
        colorfulindicatorSize = 1;
    }
    var colorfulindicator_recordingstarted = "#000040";
    var colorfulindicator_uploading = "#404000";
    var colorfulindicator_uploaded = "#004000";
    var colorfulindicator_error = "#400000";
    var storageValue = localStorage.getItem("hiddencameracolorfulindicatorrecordingstarted");
    if(storageValue){
        colorfulindicator_recordingstarted = storageValue;
    }
    storageValue = localStorage.getItem("hiddencameracolorfulindicatoruploading");
    if(storageValue){
        colorfulindicator_uploading = storageValue;
    }
    storageValue = localStorage.getItem("hiddencameracolorfulindicatoruploaded");
    if(storageValue){
        colorfulindicator_uploaded = storageValue;
    }
    storageValue = localStorage.getItem("hiddencameracolorfulindicatorerror");
    if(storageValue){
        colorfulindicator_error = storageValue;
    }
    var colorfulindicatorDiv = document.getElementById("colorfulindicator");
    colorfulindicatorDiv.style.height = colorfulindicatorSize + "%";
    colorfulindicatorDiv.style.display = "block";
}
function colorfulIndicatorFunc(color){
    if(colorfulindicatorEnabled){
        colorfulindicatorDiv.style.backgroundColor = color;
    }
}
var vibrationEnabled = localStorage.getItem("hiddencameravibration") == "true";
if(vibrationEnabled){
    var vibration_recordingstarted = 50;
    var vibration_uploading = 50;
    var vibration_uploaded = 100;
    var vibration_error = 150;
    storageValue = localStorage.getItem("hiddencameravibrationrecordingstarted");
    if(storageValue){
        vibration_recordingstarted = storageValue;
    }
    storageValue = localStorage.getItem("hiddencameravibrationuploading");
    if(storageValue){
        vibration_uploading = storageValue;
    }
    storageValue = localStorage.getItem("hiddencameravibrationuploaded");
    if(storageValue){
        vibration_uploaded = storageValue;
    }
    storageValue = localStorage.getItem("hiddencameravibrationerror");
    if(storageValue){
        vibration_error = storageValue;
    }
}
function vibrationFunc(t){
    if(vibrationEnabled){
        navigator.vibrate(t);
    }
}
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
    }
    recorder.onstop = function(){onVideoStop(live);};
    colorfulIndicatorFunc(colorfulindicator_recordingstarted);
    vibrationFunc(vibration_recordingstarted);
    backgroundImageFunc("recordingstarted");
}
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
function recordVideo(){
    cameraReady = 0;
    cameraStop();
    if(!videoRecording){
        beforeUnloadWarning++;
        videoRecording = 1;
        videoSetup();
    }else{
        videoRecording = 0;
    }
}
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
var liveStreaming = false;
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
    }else{
        liveSetupAjaxOnerror(ajax);
    }
}
function liveSetupAjaxOnerror(ajax){
    liveStreaming = false;
    cameraStart();
}
function liveSetup(){
    ajax("GET", "../?live=1&setup=1", liveSetupAjaxOnload, liveSetupAjaxOnerror);
}
var liveUploadedChunks;
var liveTotalChunks;
var liveErrorChunks;
function sendLiveChunkAjaxOnload(ajax){
    if(ajax.response == "1"){
        liveUploadedChunks++;
        if(!liveStreaming && liveUploadedChunks == liveTotalChunks){
            colorfulIndicatorFunc(colorfulindicator_uploaded);
            vibrationFunc(vibration_uploaded);
            backgroundImageFunc("uploaded");
        }
    }else{
        sendLiveChunkAjaxOnerror(ajax);
    }
}
function sendLiveChunkAjaxOnerror(ajax){
    liveErrorChunks++;
}
function sendLiveChunk(chunk){
    var formData = new FormData();
    formData.append("id", liveID);
    formData.append("key", liveKey);
    formData.append("chunk", chunk);
    liveTotalChunks++;
    ajax("POST", "../?live=1", sendLiveChunkAjaxOnload, sendLiveChunkAjaxOnerror, formData);
}
function liveStream(){
    cameraStop();
    if(!liveStreaming){
        liveStreaming = true;
        liveUploadedChunks = 0;
        liveTotalChunks = 0;
        liveErrorChunks = 0;
        liveSetup();
    }else{
        liveStreaming = false;
        cameraStart();
    }
}
function liveChunksUploaded(){
    try{
        return (liveUploadedChunks == liveTotalChunks);
    }catch(e){
        return true;
    }
}
var beforeUnloadWarning = 0;
function uploadFile(file){
    beforeUnloadWarning++;
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        if(this.responseText.charAt(0) == '#'){
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
                    uploadsStorage.push([n, id, key]);
                    localStorage.setItem("uploads", JSON.stringify(uploadsStorage));
                }
            }catch(e){}
            colorfulIndicatorFunc(colorfulindicator_uploaded);
            vibrationFunc(vibration_uploaded);
            backgroundImageFunc("uploaded");
        }else{
            colorfulIndicatorFunc(colorfulindicator_error);
            vibrationFunc(vibration_error);
            backgroundImageFunc("error");
        }
        beforeUnloadWarning--;
    };
    ajax.onerror = function(){
        colorfulIndicatorFunc(colorfulindicator_error);
        vibrationFunc(vibration_error);
        backgroundImageFunc("error");
        beforeUnloadWarning--;
    };
    ajax.open("POST", "/");
    var formData = new FormData();
    formData.append("photovideo", file);
    ajax.send(formData);
}
window.addEventListener("beforeunload", function(e){
    if(beforeUnloadWarning || liveStreaming || !liveChunksUploaded()){
        e.preventDefault();
        e.returnValue = '';
    }
});
function onclickIndicator(){
    colorfulIndicatorFunc(colorfulindicator_uploading);
    vibrationFunc(vibration_uploading);
    backgroundImageFunc("uploading");
}
if(enabled){
    screenDiv.onclick = function(){
        if(!cameraReady){
            return;
        }
        if(mode == "takephoto"){
            takePhoto();
        }else if(mode == "recordvideo"){
            recordVideo();
        }else if(mode == "livestream"){
            liveStream();
        }
        if(localStorage.getItem("hiddencameraopenfullscreenonclick") == "true"){
            document.documentElement.requestFullscreen();
        }
        onclickIndicator();
    };
    if(localStorage.getItem("hiddencameradirectrecordvideo") == "true" && mode == "recordvideo"){
        recordVideo();
        onclickIndicator();
    }else if(localStorage.getItem("hiddencameradirectlivestream") == "true" && mode == "livestream"){
        liveStream();
        onclickIndicator();
    }else{
        cameraStart();
    }
}else{
    var cameraNotWorkingColor = localStorage.getItem("hiddencameracameranotworkcolor");
    if(!cameraNotWorkingColor){
        cameraNotWorkingColor = "#ff0000";
    }
    screenDiv.style.backgroundColor = cameraNotWorkingColor;
    backgroundImageFunc("cameranotwork");
}
try{
    var webpagetitle;
    if(mode == "takephoto"){
        webpagetitle = localStorage.getItem("hiddencameratitletakephoto");
    }else if(mode == "recordvideo"){
        webpagetitle = localStorage.getItem("hiddencameratitlerecordvideo");
    }else if(mode == "livestream"){
        webpagetitle = localStorage.getItem("hiddencameratitlelivestream");
    }
    if(webpagetitle){
        document.title = webpagetitle;
    }
}catch(e){}
try{
    var webpageicon;
    if(mode == "takephoto"){
        webpageicon = localStorage.getItem("hiddencameraicontakephoto");
    }else if(mode == "recordvideo"){
        webpageicon = localStorage.getItem("hiddencameraiconrecordvideo");
    }else if(mode == "livestream"){
        webpageicon = localStorage.getItem("hiddencameraiconlivestream");
    }
    if(webpageicon){
        document.getElementById("icon").href = webpageicon;
    }
}catch(e){}
try{
    if(localStorage.getItem("mobilewebappmodehiddencamera") == "true"){
        var metaApp = document.createElement("meta");
        metaApp.name = "mobile-web-app-capable";
        metaApp.content = "yes";
        document.head.appendChild(metaApp);
    }
}catch(e){}