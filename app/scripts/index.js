const uploadStatuses = document.getElementById("uploadstatuses");
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
var locationTop = document.createElement("div");
locationTop.id = "locationtop";
locationDiv.appendChild(locationTop);
var locationImage = document.createElement("img");
locationImage.src = "images/location.svg";
locationImage.width = "32";
locationImage.height = "32";
locationTop.appendChild(locationImage);
var locationTitle = document.createElement("span");
locationTitle.innerText = "current location";
locationTitle.style.fontSize = "20px";
locationTop.appendChild(locationTitle);
function addLocationElements(text)  {
    var div = document.createElement("div");
    locationDiv.appendChild(div);
    var title = document.createElement("span");
    title.innerText = text + ": ";
    div.appendChild(title);
    var data = document.createElement("span");
    div.appendChild(data);
    return data;
}
function showLocation(element, data)    {
    if(data == null)    {
        data = "no data";
        element.style.backgroundColor = "#ff000080";
    }
    else    {
        element.style.backgroundColor = "";
    }
    element.innerText = data;
}
const latitudeLongitudeData = addLocationElements("latitude, longitude");
const altitudeData = addLocationElements("altitude");
const accuracyData = addLocationElements("accuracy");
locationDiv.style.display = "block";
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
    showLocation(latitudeLongitudeData, latitude + ", " + longitude);
    showLocation(altitudeData, altitude);
    showLocation(accuracyData, accuracy);
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
    element.innerText += text + "ing...\n(" + value + ")";
    element.innerHTML += "<br><br>";
    ajax.onload = function(){
        if(this.responseText === "1")    {
            element.innerText += text + "ed";
        }
        else    {
            element.innerText += text + " failed (" + this.responseText + ")";
            if(!location)    {
                document.getElementById("b"+n).disabled = 0;
            }
        }
        element.innerHTML += "<br><br>";
    };
    ajax.onerror = function(){
        element.innerText += text + " error (" + this.Error + ")";
        element.innerHTML += "<br><br>";
        if(!location)    {
            document.getElementById("b"+n).disabled = 0;
        }
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
var uploadstatusesdisplayed = 0;
const maxFileSize = 25000000;
const allowedFileExtensions = ["bmp", "gif", "x-icon", "jpeg", "png", "tiff", "webp", "x-msvideo", "mpeg", "ogg", "mp2t", "webm", "3gpp", "3gpp2", "mp4"];
function fileUpload(file, fileInput){
    if(file === null)  {
        file = fileInput.files[0];
    }
    if(file.size > maxFileSize)    {
        alert("maximum file size is " + (maxFileSize / 1000000) + "MB.");
        return;
    }
    var fileTypeArray = file.type.split('/');
    var fileType = fileTypeArray[0];
    var fileExtension = fileTypeArray[1];
    if(fileType != "image" && fileType != "video")    {
        alert("only images and videos are allowed.");
        return;
    }
    if(!allowedFileExtensions.includes(fileExtension))    {
        alert("allowed file extensions are: ." + allowedFileExtensions.join(", .") + ".");
        return;
    }
    unloadWarning = 1;
    const subbox = document.createElement("div");
    subbox.className = "boxs";
    uploadStatuses.insertBefore(subbox, uploadStatuses.childNodes[0]);
    const status = document.createElement("div");
    const after = document.createElement("div");
    subbox.appendChild(status);
    subbox.appendChild(after);
    var statusText = document.createElement("div");
    statusText.innerText = "uploading...";
    status.appendChild(statusText);
    const progress = document.createElement("div");
    status.appendChild(progress);
    const progressBar0 = document.createElement("div");
    progressBar0.className = "progressbar0";
    status.appendChild(progressBar0);
    const progressBar = document.createElement("div");
    progressBar.className = "progressbar";
    progressBar0.appendChild(progressBar);
    status.appendChild(document.createElement("br"));
    if(!uploadstatusesdisplayed) {
        uploadStatuses.style.display = "block";
        uploadstatusesdisplayed = 1;
    }
    statusText = document.createElement("div");
    var formData = new FormData();
    formData.append("file", file);
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        if(this.responseText.includes('|'))    {
            var responseArray = this.responseText.split('|');
            var n = responseArray[0];
            var key = responseArray[1];
            var html = "<div class=\"boxs\">";
            html += "<a href=\"php/view.php?n=" + n + "\" target=\"_blank\">#" + n + "</a>";
            html += "<br><br><div class=\"descriptioninput\"><textarea id=\""+n+"\" class=\"texts\" rows=\"2\" cols=\"10\"";
            if(darkModeEnabled)    {
                html += " style=\"color:#ffffff;\"";
            }
            html += "></textarea></div><br><button id=\"b"+n+"\" disabled><img width=\"32\" height=\"32\" src=\"images/description.svg\">&nbsp;upload description</button>";
            html += "<br><br><input type=\"file\" accept=\"audio/*\" id=\"v"+n+"\" oninput=uploadVoice(\""+n+"\",\""+key+"\") hidden><button><label for=\"v"+n+"\">upload voice</label></button>";
            html += "<div id=\"q"+n+"\" class=\"uploadstatuses2\"></div>";
            html += "</div>";
            after.innerHTML = html;
            var button = document.getElementById("b"+n);
            button.addEventListener("click", function(){
                button.disabled = 1;
                uploadDescription(n,key);
            });
            var textarea = document.getElementById(n);
            textarea.addEventListener("input", function(){
                button.disabled = textarea.value == '';
            });
            statusText.innerText += "upload completed (#" + n + ")";
            if(latitude != null && longitude != null)    {
                uploadLocation(n, key);
            }
        }
        else    {
            statusText.innerText += "upload failed\n(" + this.responseText + ")";
        }
        if(fileInput !== undefined)fileInput.value = null;
        status.appendChild(statusText);
    };
    ajax.onerror = function(){
        statusText.innerText += "upload error\n(" + this.Error + ")";
        status.appendChild(statusText);
    };
    var progressPercent;
    ajax.upload.onprogress = function(e){
        progressPercent = ((e.loaded / e.total) * 100).toFixed(2) + '%';
        progress.innerText = progressPercent + " (" + e.loaded + " / " + e.total + ")";
        progressBar.style.width = progressPercent;
    };
    ajax.open("POST", "php/uploadphotovideo.php");
    ajax.send(formData);
}
const takePhoto = document.getElementById("takephoto");
const recordVideo = document.getElementById("recordvideo");
const choosePhoto = document.getElementById("choosephoto");
const chooseVideo = document.getElementById("choosevideo");
takePhoto.oninput = function(){fileUpload(null,takePhoto);};
recordVideo.oninput = function(){fileUpload(null,recordVideo);};
choosePhoto.oninput = function(){fileUpload(null,choosePhoto);};
chooseVideo.oninput = function(){fileUpload(null,chooseVideo);};
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
darkmodediv.innerHTML = "<div><label class=\"switch\"><input type=\"checkbox\" id=\"darkmode\"><span class=\"slider round\"><img width=\"26\" height=\"26\" src=\"images/darkmode0.png\"></span></label></div><span class=\"texts\">dark mode</span><br>";
darkmodediv.style.display = "block";
const darkmodecheckbox = document.getElementById("darkmode");
function changeDarkMode()   {
    setDarkMode(!darkModeEnabled);
}
darkmodecheckbox.addEventListener("click", function(){changeDarkMode();});
darkmodediv.addEventListener("click", function(){darkmodecheckbox.checked = !darkmodecheckbox.checked;changeDarkMode();});
function darkmodeifelse(condition)   {
    if(condition)    {
        setDarkMode(true);
    }
    else    {
        setDarkMode(false);
    }
    darkmodecheckbox.checked = darkModeEnabled;
}
function defaultdarkmode()  {
    var matchmedia = window.matchMedia("(prefers-color-scheme: dark)");
    darkmodeifelse(matchmedia.matches);
    matchmedia.onchange = function(e){darkmodeifelse(e.matches)};
}
if(getCookie("darkmode") == "")    {
    defaultdarkmode();
}
else    {
    darkmodeifelse(getCookie("darkmode") == "true");
}
var unloadWarning = 0;
window.addEventListener("beforeunload", function(e){
    if(unloadWarning)    {
        e.preventDefault();
        e.returnValue = '';
    }
});
const dragOverlay = document.getElementById("dragoverlay");
dragOverlay.addEventListener("dragover", function(e){
    e.preventDefault();
});
dragOverlay.addEventListener("drop", function(e){
    e.preventDefault();
    fileUpload(e.dataTransfer.items[0].getAsFile());
    dragOverlay.style.display = "none";
});
mainDiv.addEventListener("dragenter", function(e){
    if(e.dataTransfer.items[0].kind == "file")    {
        dragOverlay.style.display = "block";
    }
});
dragOverlay.addEventListener("dragleave", function(){
    dragOverlay.style.display = "none";
});