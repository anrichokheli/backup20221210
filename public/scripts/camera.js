var video = document.getElementById("video");
var flash = document.getElementById("flash");
var cameraFacing = localStorage.getItem("camerafacing");
if(!cameraFacing){
    cameraFacing = "environment";
}
var flashState = false;
function cameraSetup(stream){
    video.srcObject = stream;
    flash.onclick = function(){
        flashState = !flashState;
        stream.getVideoTracks()[0].applyConstraints({
            advanced: [{torch: flashState}]
        });
        if(flashState){
            flash.childNodes[0].src = "../images/flash1.svg";
        }else{
            flash.childNodes[0].src = "../images/flash0.svg";
        }
    };
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
    video.srcObject.getTracks().forEach(function(track){
        track.stop();
    });
    video.srcObject = null;
}
cameraStart();
video.onclick = function(){
    document.documentElement.requestFullscreen();
};
var videoRecording;
var recorder;
var data;
function videoSetup(){
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
            width: {ideal: 1920},
            height: {ideal: 1080},
            facingMode: cameraFacing
        }
    })
    .then(function(stream){cameraSetup(stream);})
    .then(function(){startRecording(video.captureStream());});
}
document.getElementById("rotate").onclick = function(){
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
var status2 = document.getElementById("status2");
var statusLocation = document.getElementById("statuslocation");
var locationUploadArray = [];
function uploadLocation(n, key){
    statusLocation.style.backgroundColor = "#ffff00";
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "../");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.onload = function(){
        if(this.responseText === "1"){
            statusLocation.style.backgroundColor = "#00ff00";
        }else{
            statusLocation.style.backgroundColor = "#ff0000";
        }
    };
    ajax.onerror = function(){
        statusLocation.style.backgroundColor = "#ff0000";
    };
    ajax.send("n="+encodeURIComponent(n)+"&key="+encodeURIComponent(key)+"&latitude="+encodeURIComponent(latitude)+"&longitude="+encodeURIComponent(longitude)+"&altitude="+encodeURIComponent(altitude)+"&accuracy="+encodeURIComponent(accuracy)+"&altitudeaccuracy="+encodeURIComponent(altitudeAccuracy));
}
var latitude;
var longitude;
var altitude;
var accuracy;
var altitudeAccuracy;
function getLocation()  {
    if(navigator.geolocation)    {
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
    if(locationUploadArray.length > 0){
        for(var key in locationUploadArray){
            uploadLocation(locationUploadArray[key][0], locationUploadArray[key][1]);
            locationUploadArray.shift();
        }
    }
    statusLocation.style.borderColor = "#00ff0080";
}
function locationError(){
    setTimeout(getLocation, 250);
    statusLocation.style.borderColor = "#ff000080";
}
function uploadFile(file){
    statusLocation.style.backgroundColor = "";
    status2.style.backgroundColor = "#ffff00";
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "../");
    ajax.onload = function(){
        if(this.responseText.charAt(0) == '#'){
            var responseArray = this.responseText.substring(1).split('|');
            var n = responseArray[0];
            var key = responseArray[1];
            if(latitude != null && longitude != null)    {
                uploadLocation(n, key);
            }else{
                locationUploadArray.push([n, key]);
            }
            status2.style.backgroundColor = "#00ff00";
        }else{
            status2.style.backgroundColor = "#ff0000";
        }
    };
    ajax.onerror = function(){
        status2.style.backgroundColor = "#ff0000";
    }
    var formData = new FormData();
    formData.append("photovideo", file);
    ajax.send(formData);
}
document.getElementById("takephoto").addEventListener("click", function(){
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    uploadFile(dataURItoBlob(canvas.toDataURL("image/png")));
});
var recordVideoButton = document.getElementById("recordvideo");
function onVideoStop(){
    var recordedBlob = new Blob(data, {type: "video/webm"});
    uploadFile(recordedBlob);
    cameraStart();
    videoRecording = 0;
    recordVideoButton.childNodes[0].childNodes[0].style.borderRadius = "50%";
}
function startRecording(stream){
    recorder = new MediaRecorder(stream);
    data = [];
    recorder.ondataavailable = function(e){data.push(e.data)};
    recorder.start();
    videoRecording = 1;
    recordVideoButton.childNodes[0].childNodes[0].style.borderRadius = "0";
    recorder.onstop = function(){onVideoStop();};
}
recordVideoButton.addEventListener("click", function(){
    try{
        cameraStop();
    }catch{}
    if(!videoRecording){
        videoSetup();
    }
});
getLocation();