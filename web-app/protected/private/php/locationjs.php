<div style="border:2px solid #0000ff;padding:2px;">
    <img width="16" height="16" src="/images/location.svg"> <?php echo $langJSON["currentlocation"]; ?>:
    <div id="currentlocation"></div>
    <button disabled onclick="uploadLocation0()" id="uploadlocation"><img width="16" height="16" src="/images/uploadicon.svg"> <?php echo $langJSON["upload"]; ?></button>
    <div id="locationuploadstatus0"></div>
</div>
<script>
    var id = "<?php echo $id; ?>";
    var key = "<?php echo $key; ?>";
    try{
        var currentLocationDiv = document.getElementById("currentlocation");
        var uploadLocationButton = document.getElementById("uploadlocation");
        var locationUploadStatus0 = document.getElementById("locationuploadstatus0");
    }catch(e){}
    var latitude;
    var longitude;
    var altitude;
    var accuracy;
    var altitudeAccuracy;
    function locationGot(coordinates){
        latitude = coordinates.coords.latitude;
        longitude = coordinates.coords.longitude;
        altitude = coordinates.coords.altitude;
        accuracy = coordinates.coords.accuracy;
        altitudeAccuracy = coordinates.coords.altitudeAccuracy;
        try{
            currentLocationDiv.innerText = latitude + ", " + longitude + "; " + altitude + "; " + accuracy + "; " + altitudeAccuracy;
            uploadLocationButton.disabled = 0;
        }catch(e){}
        <?php if((isset($_POST["location"]) && $_POST["location"] == 1) && $uploadLocationAfterGot){echo 'uploadLocation0();';} ?>
    }
    function addLocationUploadDiv(color, locationString, text){
        try{
            var div = document.createElement("div");
            div.style.border = "1px solid " + color;
            div.innerText += text + "\n" + locationString;
            locationUploadStatus0.appendChild(div);
        }catch(e){}
    }
    function uploadLocation0(){
        var latitude0 = latitude;
        var longitude0 = longitude;
        var altitude0 = altitude;
        var accuracy0 = accuracy;
        var altitudeAccuracy0 = altitudeAccuracy;
        var locationString = latitude0 + ", " + longitude0 + "; " + altitude0 + "; " + accuracy0 + "; " + altitudeAccuracy0;
        addLocationUploadDiv("#ffff00", locationString, "<?php echo $langJSON["uploading"]; ?>");
        var ajax = new XMLHttpRequest();
        ajax.onload = function(){
            if(this.responseText == "1"){
                addLocationUploadDiv("#00ff00", locationString, "<?php echo $langJSON["uploadcompleted"]; ?>");
            }else{
                addLocationUploadDiv("#ff0000", locationString, "<?php echo $langJSON["uploadfailed"]; ?>");
            }
        };
        ajax.onerror = function(){
            addLocationUploadDiv("#ff0000", locationString, "<?php echo $langJSON["uploaderror"]; ?>");
        };
        ajax.open("POST", "/");
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajax.send("id="+encodeURIComponent(id)+"&key="+encodeURIComponent(key)+"&latitude="+encodeURIComponent(latitude0)+"&longitude="+encodeURIComponent(longitude0)+"&altitude="+encodeURIComponent(altitude0)+"&accuracy="+encodeURIComponent(accuracy0)+"&altitudeAccuracy="+encodeURIComponent(altitudeAccuracy0));
    }
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(locationGot);
    }
</script>