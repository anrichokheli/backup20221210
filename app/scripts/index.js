const submitUpload = document.getElementById("upload");
const fileInput = document.getElementById("photovideo");
const afterUpload = document.getElementById("afterupload");
const locationDiv = document.getElementById("location");
const notice = document.getElementById("notice");
fileInput.value = null;
photovideo.style = "display:none;";
document.getElementById("filelabel").style = "display:none;";
notice.innerText = "file upload will be started directly as soon as file will be chosen";
var latitude;
var longitude;
function getLocation()  {
    if(navigator.geolocation)    {
        navigator.geolocation.getCurrentPosition(afterLocation);
        notice.innerHTML += "<br><br>if location coordinates detected,<br>it will be attached automatically as soon as file will be uploaded";
    }
}
function afterLocation(position)  {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    locationDiv.innerText = "current location: " + latitude + ", " + longitude;
}
getLocation();
function uploadString(n, key, post, location) {
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        if(this.responseText === "1")    {
            var text;
            if(location == true)    {
                text = "location";
            }
            else    {
                text = "description";
            }
            text += " uploaded";
            const element = document.getElementById('q'+n);
            element.innerText += text;
            element.innerHTML += "<br>";
        }
    };
    ajax.open("POST", "php/uploadstring.php");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("n="+n+"&key="+key+post);
}
function uploadLocation(n, key)   {
    uploadString(n, key, "&latitude="+latitude+"&longitude="+longitude, true);
}
function uploadDescription(n, key)    {
    uploadString(n, key, "&description="+document.getElementById(n).value);
}
fileInput.oninput = function(){
    var formData = new FormData();
    formData.append("file", fileInput.files[0]);
    fetch("php/uploadphotovideo.php", {method: "POST", body: formData})
    .then(Response => Response.text())
    .then(Response => {
        if(Response.includes('|'))    {
            var responseArray = Response.split('|');
            var n = responseArray[0];
            var key = responseArray[1];
            afterUpload.innerHTML += "<a href=\"php/view.php?n=" + n + "\" target=\"_blank\">#" + n + "</a>";
            uploadLocation(n, key);
            afterUpload.innerHTML += "<br><input type=\"text\" id=\""+n+"\"><button onclick=uploadDescription(\""+n+"\",\""+key+"\")>upload description</button><div id=\"q"+n+"\"></div>";
        }
    });
};