const submitUpload = document.getElementById("upload");
const fileInput = document.getElementById("photovideo");
fileInput.value = null;
photovideo.style = "display:none;";
document.getElementById("filelabel").style = "display:none;";
document.getElementById("notice").innerHTML = "file upload will be started directly as soon as file will be chosen";
fileInput.oninput = function(){submitUpload.click();};