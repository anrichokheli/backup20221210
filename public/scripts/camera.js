var video = document.getElementById("video");
var flash = document.getElementById("flash");
var flashState = false;
var cameraFacing = "environment";
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
// var canvas = document.getElementById("canvas");
// document.getElementById("takephoto").addEventListener("click", function(){
//     canvas.getContext("2d").drawImage(video, 0, 0);
//     var ajax = new XMLHttpRequest();
//     ajax.open("POST", "../");
//     var formData = new FormData();
//     formData.append("photovideo", canvas.toDataURL("image/png"));
//     ajax.send(formData);
// });