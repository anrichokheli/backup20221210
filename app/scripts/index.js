const afterUpload = document.getElementById("afterupload");
const locationDiv = document.getElementById("location");
const notice = document.getElementById("notice");
const uploadStatus = document.getElementById("uploadstatus");
const uploadForms = document.getElementsByClassName("uploadforms");
function label2button(id) {
    var divHTML = document.getElementById(id + "div").innerHTML;
    divHTML = divHTML.replace("<label", "<button onclick=document.getElementById(\"" + id + "\").click();");
    divHTML = divHTML.replace("</label>", "</button>");
    divHTML = divHTML.replace("for=\"" + id + "\"", "");
    divHTML = divHTML.replace("required", "required hidden");
    document.getElementById(id + "div2").innerHTML = divHTML;
}
label2button("takephoto");
label2button("recordvideo");
label2button("choosephoto");
label2button("choosevideo");
for(var key in uploadForms)   {
    uploadForms[key].innerHTML = '';
}
notice.innerText = "file upload will be started directly as soon as file will be chosen";
var latitude;
var longitude;
var altitude;
var accuracy;
function getLocation()  {
    if(navigator.geolocation)    {
        navigator.geolocation.getCurrentPosition(afterLocation);
        notice.innerHTML += "<br><br>if location coordinates detected,<br>it will be attached automatically as soon as file will be uploaded";
    }
}
function afterLocation(position)  {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    altitude = position.coords.altitude;
    accuracy = position.coords.accuracy;
    if(latitude === null)latitude='-';
    if(longitude === null)longitude='-';
    if(altitude === null)altitude='-';
    if(accuracy === null)accuracy='-';
    locationDiv.innerText = "current location:\n" + latitude + ", " + longitude + ";\n" + altitude + ";\n" + accuracy;
    locationDiv.style.display = "block";
}
getLocation();
function uploadString(n, key, post, location, value) {
    var ajax = new XMLHttpRequest();
    var text;
    if(location == true)    {
        text = "location";
    }
    else    {
        text = "description";
    }
    text += " upload";
    const element = document.getElementById('q'+n);
    element.innerText += text + "ing... (" + value + ")";
    element.innerHTML += "<br>";
    ajax.onload = function(){
        if(this.responseText === "1")    {
            element.innerText += text + "ed";
        }
        else    {
            element.innerText += text + " failed (" + this.responseText + ")";
        }
        element.innerHTML += "<br>";
    };
    ajax.onerror = function(){
        element.innerText += text + " error (" + this.Error + ")";
        element.innerHTML += "<br>";
    };
    ajax.open("POST", "php/uploadstring.php");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("n="+n+"&key="+key+post);
}
function uploadLocation(n, key)   {
    uploadString(n, key, "&latitude="+latitude+"&longitude="+longitude+"&altitude="+altitude+"&accuracy="+accuracy, true, latitude + ", " + longitude + "; " + altitude + "; " + accuracy);
}
function uploadDescription(n, key)    {
    var descriptionValue = document.getElementById(n).value;
    uploadString(n, key, "&description="+descriptionValue, false, descriptionValue);
}
function uploadVoice(n, key)  {
    const statusElement = document.getElementById('q'+n);
    const voiceinput = document.getElementById('v'+n);
    statusElement.innerText += "voice uploading...";
    statusElement.innerHTML += "<br>";
    var formData = new FormData();
    formData.append("file", voiceinput.files[0]);
    formData.append("n", n);
    formData.append("key", key);
    fetch("php/uploadvoice.php", {method: "POST", body: formData})
    .then(Response => Response.text())
    .then(Response => {
        if(Response === "1")    {
            statusElement.innerText += "voice uploaded";
        }
        else    {
            statusElement.innerText += "voice upload failed (" + Response + ")";
        }
        statusElement.innerHTML += "<br>";
    })
    .catch(Error => {
        statusElement.innerText += "voice upload error (" + Error + ")";
        statusElement.innerHTML += "<br>";
    });
}
var uploadstatusdisplayed = 0;
var afteruploaddisplayed = 0;
function fileUpload(fileInput){
    uploadStatus.innerText = "uploading...";
    uploadStatus.style.borderColor = "#ffff00";
    if(!uploadstatusdisplayed) {
        uploadStatus.style.display = "block";
        uploadstatusdisplayed = 1;
    }
    var formData = new FormData();
    formData.append("file", fileInput.files[0]);
    fetch("php/uploadphotovideo.php", {method: "POST", body: formData})
    .then(Response => Response.text())
    .then(Response => {
        if(Response.includes('|'))    {
            var responseArray = Response.split('|');
            var n = responseArray[0];
            var key = responseArray[1];
            var html = "<div class=\"boxs\">";
            html += "<a href=\"php/view.php?n=" + n + "\" target=\"_blank\">#" + n + "</a>";
            html += "<br><textarea id=\""+n+"\" rows=\"2\" cols=\"10\"></textarea><button onclick=uploadDescription(\""+n+"\",\""+key+"\")>upload description</button>";
            html += "<br><input type=\"file\" accept=\"audio/*\" id=\"v"+n+"\" oninput=uploadVoice(\""+n+"\",\""+key+"\") hidden><button><label for=\"v"+n+"\">upload voice</label></button>";
            html += "<div id=\"q"+n+"\"></div>";
            html += "</div>";
            html += afterUpload.innerHTML;
            afterUpload.innerHTML = html;
            if(!afteruploaddisplayed) {
                afterUpload.style.display = "block";
                afteruploaddisplayed = 1;
            }
            uploadStatus.innerText = "upload completed (#" + n + ")";
            uploadStatus.style.borderColor = "#00ff00";
            uploadLocation(n, key);
        }
        else    {
            uploadStatus.innerText = "upload failed (" + Response + ")";
            uploadStatus.style.borderColor = "#ff0000";
        }
        fileInput.value = null;
    })
    .catch(Error => {
        uploadStatus.innerText = "upload error (" + Error + ")";
        uploadStatus.style.borderColor = "#ff0000";
    });
}
const takePhoto = document.getElementById("takephoto");
const recordVideo = document.getElementById("recordvideo");
const choosePhoto = document.getElementById("choosephoto");
const chooseVideo = document.getElementById("choosevideo");
takePhoto.oninput = function(){fileUpload(takePhoto);};
recordVideo.oninput = function(){fileUpload(recordVideo);};
choosePhoto.oninput = function(){fileUpload(choosePhoto);};
chooseVideo.oninput = function(){fileUpload(chooseVideo);};
const mainDiv = document.getElementById("main");
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
var darkModeEnabled;
function setDarkMode(enabled) {
    var color = "#000000";
    var backgroundColor = "#ffffff";
    if(enabled)    {
        var temp = color;
        color = backgroundColor;
        backgroundColor = temp;
    }
    mainDiv.style.backgroundColor = backgroundColor;
    var elements = document.getElementsByClassName("texts");
    for(var i = 0; i < elements.length; i++)   {
        elements[i].style.color = color;
    }
    darkModeEnabled = enabled;
    setCookie("darkmode", darkModeEnabled, 1000);
}
const darkmodediv = document.getElementById("darkmodediv");
darkmodediv.innerHTML = "<br><input type=\"checkbox\" id=\"darkmode\" checked><label for=\"darkmode\" class=\"texts\">dark mode</label><br>";
darkmodediv.style.display = "block";
const darkmodecheckbox = document.getElementById("darkmode");
darkmodecheckbox.addEventListener("click", function(){setDarkMode(!darkModeEnabled);});
if(getCookie("darkmode") == "")    {
    setDarkMode(true);
}
else    {
    if(getCookie("darkmode") == "true")    {
        setDarkMode(true);
    }
    else    {
        setDarkMode(false);
    }
    darkmodecheckbox.checked = darkModeEnabled;
}