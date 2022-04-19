var mainDiv = document.getElementById("main");
var topDiv = document.getElementById("top");
try{
    var mainDiv = document.getElementById("main");
    var matchmedia = window.matchMedia("(prefers-color-scheme: dark)");
    function setDarkMode(enabled){
        if(enabled){
            document.documentElement.style.colorScheme = "dark";
            mainDiv.style.backgroundColor = "#000000";
            topDiv.style.backgroundColor = "#101010";
        }else{
            document.documentElement.style.colorScheme = "light";
            mainDiv.style.backgroundColor = "#efefef";
            topDiv.style.backgroundColor = "#ffffff";
        }
    }
    function defaultdarkmode()  {
        setDarkMode(matchmedia.matches);
        matchmedia.onchange = function(e){setDarkMode(e.matches);};
    }
    function darkMode(){
        if(localStorage.getItem("darkmode") != null){
            matchmedia.onchange = function(){};
            setDarkMode(localStorage.getItem("darkmode") == "true");
        }else{
            defaultdarkmode();
        }
    }
    darkMode();
}catch(e){}
try{
    var colorFilterDefaultValue = 90;
    var lightFilter = document.createElement("div");
    lightFilter.className = "overlay";
    mainDiv.style.position = "relative";
    lightFilter.style.position = "absolute";
    lightFilter.style.pointerEvents = "none";
    lightFilter.style.mixBlendMode = "multiply";
    lightFilter.style.zIndex = "1";
    lightFilter.style.display = "none";
    mainDiv.appendChild(lightFilter);
    var r = 255;
    var g;
    var b;
    function setFilterValue(value0){
        var value = (value0 / 100.0) * 510;
        if(value < 0){
            value = 0;
        }else if(value > 510){
            value = 510;
        }
        if(value < 256){
            g = value;
            b = 0;
        }else{
            g = 255;
            b = value - 255;
        }
        lightFilter.style.backgroundColor = "rgb("+r+", "+g+", "+b+")";
        localStorage.setItem("colorfiltervalue", value0);
    }
    function colorfilter(){
        if(localStorage.getItem("colorfiltervalue")){
            setFilterValue(localStorage.getItem("colorfiltervalue"));
        }else{
            setFilterValue(colorFilterDefaultValue);
        }
        if(localStorage.getItem("colorfilterenabled") == "true"){
            lightFilter.style.display = "block";
        }else{
            lightFilter.style.display = "none";
        }
    }
    colorfilter();
}catch(e){}
try{
    window.onstorage = function(){
        try{
            darkMode();
        }catch(e){}
        try{
            setLanguage();
        }catch(e){}
        try{
            colorfilter();
        }catch(e){}
    };
}catch(e){}
var contentDiv = document.getElementById("content");
var page = 0;
var topN = "";
var jsons;
var jsonArray;
function loadContent(){
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "../?view&raw=1&p=" + page + "&t=" + topN);
    ajax.onload = function(){
        loader.style.display = "none";
        if(this.responseText != ""){
            jsons = this.responseText.split(">");
            for(var i = 0; i < jsons.length; i++){
                jsonArray = JSON.parse(jsons[i]);
                if(i == 0){
                    topN = jsonArray[0];
                }
                addContent(jsonArray);
            }
            page++;
            window.addEventListener("scroll", scrollLoad);
        }
    };
    ajax.onerror = function(){
        loader.style.display = "none";
        loadError.style.display = "block";
    };
    ajax.send();
}
function addContent(array){
    console.log(array)
    var oneDiv = document.createElement("div");
    oneDiv.classList.add("one");
    if(array[3][0] == "image"){
        oneDiv.innerHTML = '<img src="../' + array[1][0] + '">';
    }else{
        oneDiv.innerHTML = '<video controls src="../' + array[1][0] + '"></video>';
    }
    contentDiv.appendChild(oneDiv);
}
try{
    var loaderStyle = document.createElement("link");
    loaderStyle.rel = "stylesheet";
    loaderStyle.href = "../styles/loader.css";
    document.head.appendChild(loaderStyle);
}catch(e){}
function loaderSetup(loader, loadError){
    loader.style.display = "none";
    loadError.style.display = "none";
    loadError.innerText = "LOAD ERROR!";
    var reloadButton = document.createElement("button");
    reloadButton.innerHTML = 'RELOAD';
    reloadButton.addEventListener("click", function(){
        loadError.style.display = "none";
        loader.style.display = "inline-block";
        loadContent();
    });
    loadError.appendChild(reloadButton);
    loadError.style.fontSize = "20px";
    loadError.style.fontWeight = "bold";
    loadError.style.color = "#ff0000";
}
function scrollLoad(){
    loadContentHeight = mainDiv.clientHeight * 3 / 4 - mainDiv.clientHeight;
    if(document.body.scrollTop > loadContentHeight || document.documentElement.scrollTop > loadContentHeight){
        window.removeEventListener("scroll", scrollLoad);
        loader.style.display = "inline-block";
        loadContent();
    }
}
try{
    var loader = document.getElementById("loader");
    var loadError = document.getElementById("loaderror");
    loaderSetup(loader, loadError);
    var loadContentHeight;
    window.addEventListener("scroll", scrollLoad);
}catch(e){}
loadContent();