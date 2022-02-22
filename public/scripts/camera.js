var video = document.getElementById("video");
var flash = document.getElementById("flash");
var cameraFacing = "environment";
var flashState = false;
function cameraStart(){
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {facingMode: cameraFacing}
    })
    .then(function(stream){
        video.srcObject = stream;
        video.play();
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
    });
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
document.getElementById("rotate").onclick = function(){
    if(cameraFacing == "environment"){
        cameraFacing = "user";
    }else{
        cameraFacing = "environment";
    }
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
document.getElementById("takephoto").addEventListener("click", function(){
    statusBox.style.display = "flex";
    status2.style.backgroundColor = "#ffff00";
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "../");
    ajax.onload = function(){
        if(this.responseText.charAt(0) == '#'){
            status2.style.backgroundColor = "#00ff00";
        }else{
            status2.style.backgroundColor = "#ff0000";
        }
        setTimeout(function(){
            statusBox.style.display = "none";
        }, 3000);
    };
    var formData = new FormData();
    formData.append("photovideo", dataURItoBlob(canvas.toDataURL("image/png")));
    ajax.send(formData);
});