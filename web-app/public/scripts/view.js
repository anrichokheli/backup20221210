try{
    var mainDiv = document.getElementById("main");
    var matchmedia = window.matchMedia("(prefers-color-scheme: dark)");
    function setDarkMode(enabled){
        if(enabled){
            document.documentElement.style.colorScheme = "dark";
            mainDiv.style.backgroundColor = "#000000";
        }else{
            document.documentElement.style.colorScheme = "light";
            mainDiv.style.backgroundColor = "#ffffff";
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
var strings = null;
function getString(key)  {
    if(strings!=null)return strings[key];
    return "";
}
try{
    var lang;
    function setLanguage(){
        lang = localStorage.getItem("lang");
        if(lang == null){
            lang = navigator.language.substring(0, 2);
            window.onlanguagechange = function(){
                lang = navigator.language.substring(0, 2);
                setLanguage(lang);
            };
        }
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "json/languages/" + lang + ".json");
        ajax.onload = function()    {
            if(this.status == 200){
                document.documentElement.lang = lang;
                var json = JSON.parse(this.responseText);
                strings = json;
                var element;
                for(var key in json) {
                    var elements = document.getElementsByClassName(key);
                    if(elements!=null){
                        for(var element in elements){
                            if(elements[element]!=null)elements[element].innerText = json[key];
                        }
                    }
                }
                document.title = strings["title"];
            }
            else{
                var getlang = (new URL(window.location.href)).searchParams.get("lang");
                if(getlang != null && get != 1){
                    lang = getlang;
                    setLanguage(lang,1);
                }else{
                    lang = "en";
                    setLanguage(lang);
                }
            }
        };
        ajax.send();
    }
    setLanguage();
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
function addShareButton(n, element){
    var shareButton = document.createElement("button");
    shareButton.innerHTML = "<img width=\"32\" height=\"32\" src=\"images/share.svg\"> <span class=\"share\">"+getString("share")+"</span>";
    shareButton.classList.add("buttons", "afteruploadbuttons");
    shareButton.addEventListener("click", function(){
        try{
            var URL = window.location.href;
            if(URL.indexOf("?view") != -1){
                URL = URL.substring(0, URL.lastIndexOf("/")+2)+n;
            }
            navigator.share({url: URL});
        }catch(e){
            try{
                shareButton.style.color = "#ff0000";
                shareButton.innerText = "SHARE ERROR!";
            }catch(e){}
        }
    });
    element.appendChild(shareButton);
}
try{
    var buttonsDivs = document.querySelectorAll(".one > .buttonsdivs");
    for(var key in buttonsDivs){
        addShareButton(buttonsDivs[key].parentNode.id, buttonsDivs[key]);
    }
}catch(e){}
try{
    var contentDiv = document.getElementById("content");
}catch(e){}
try{
    var loaderStyle = document.createElement("link");
    loaderStyle.rel = "stylesheet";
    loaderStyle.href = "styles/loader.css";
    document.head.appendChild(loaderStyle);
}catch(e){}
function loaderSetup(loader, loadError){
    loader.style.display = "none";
    loadError.style.display = "none";
    loadError.innerText = "LOAD ERROR!";
    loadError.style.fontSize = "20px";
    loadError.style.fontWeight = "bold";
    loadError.style.color = "#ff0000";
}
try{
    var loader = document.getElementById("loader");
    var loadError = document.getElementById("loaderror");
    var loaderTop = document.createElement("div");
    loaderTop.className = "loader";
    var loadErrorTop = document.createElement("div");
    mainDiv.insertBefore(loaderTop, contentDiv);
    mainDiv.insertBefore(loadErrorTop, contentDiv);
    loaderSetup(loader, loadError);
    loaderSetup(loaderTop, loadErrorTop);
}catch(e){}
function reloadNewContent(){
    if(loadErrorTop.style.display != "none"){
        loadErrorTop.style.display = "none";
    }
    loaderTop.style.display = "inline-block";
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "?view&ajax=1");
    ajax.onload = function(){
        contentDiv.innerHTML = this.responseText;
        loaderTop.style.display = "none";
    };
    ajax.onerror = function(){
        loaderTop.style.display = "none";
        loadErrorTop.style.display = "block";
    };
    ajax.send();
}
try{
    var topDiv = document.getElementById("top");
    var topSpaceDiv = document.createElement("div");
    topSpaceDiv.style.marginBottom = topDiv.clientHeight + 10 + "px";
    mainDiv.insertBefore(topSpaceDiv, mainDiv.childNodes[0]);
    topDiv.style.position = "fixed";
    window.onscroll = function(){
        if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0){
            topDiv.childNodes[0].childNodes[0].width = "32";
            topDiv.childNodes[0].childNodes[0].height = "32";
            topDiv.childNodes[0].childNodes[2].style.fontSize = "1em";
            topDiv.childNodes[0].onclick = function(e){
                e.preventDefault();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                reloadNewContent();
            };
        }else{
            topDiv.childNodes[0].childNodes[0].width = "64";
            topDiv.childNodes[0].childNodes[0].height = "64";
            topDiv.childNodes[0].childNodes[2].style.fontSize = "2em";
            topDiv.childNodes[0].onclick = function(){};
        }
    };
}catch(e){}
function addDescriptionSeeMore(descriptionDivs){
    for(var i = 0; i < descriptionDivs.length; i++){
        if(descriptionDivs[i].childNodes.length > 1){
            var seeMore = document.getElementById("seemore"+descriptionDivs[i].parentNode.parentNode.id);
            seeMore.style.display = "inline";
            document.getElementById("moretext"+descriptionDivs[i].parentNode.parentNode.id).style.display = "none";
            seeMore.onclick = function(){
                var moreText = document.getElementById("moretext"+this.parentNode.parentNode.parentNode.id);
                if(this.innerText == "...>>"){
                    moreText.style.display = "inline";
                    this.innerText = "<<";
                }else{
                    moreText.style.display = "none";
                    this.innerText = "...>>";
                }
            };
        }
    }
}
try{
    addDescriptionSeeMore(document.getElementsByClassName("descriptiondiv"));
}catch(e){}
try{
    var newContentDiv = document.getElementById("newcontent");
}catch(e){}
function onContentLoad(ajax, nextPage){
    var div = document.createElement("div");
    div.id = "newdiv"+nextPage;
    div.innerHTML = ajax.responseText;
    newContentDiv.appendChild(div);
    addDescriptionSeeMore(document.querySelectorAll('#newdiv'+nextPage+' .descriptiondiv'));
    var buttonsDivs = document.querySelectorAll("#newdiv"+nextPage+" .one > .buttonsdivs");
    try{
        for(var key in buttonsDivs){
            addShareButton(buttonsDivs[key].parentNode.id, buttonsDivs[key]);
        }
    }catch(e){}
}
function scrollLoad(){
    loadContentHeight = mainDiv.clientHeight * 3 / 4;
    if(document.body.scrollTop > loadContentHeight || document.documentElement.scrollTop > loadContentHeight){
        window.removeEventListener("scroll", scrollLoad);
        viewMore(viewMoreButton);
    }
}
function loadScrollEventSetup(){
    try{
        if(localStorage.getItem("loadonscroll") == "false"){
            return;
        }
    }catch(e){}
    viewMoreButton = document.getElementById("viewmore");
    if(viewMoreButton){
        window.addEventListener("scroll", scrollLoad);
    }
}
function viewMore(element){
    element.disabled = 1;
    if(loadError.style.display != "none"){
        loadError.style.display = "none";
    }
    loader.style.display = "inline-block";
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "?view&ajax=1&p=" + element.getAttribute("page") + "&t=" + element.getAttribute("topn"));
    ajax.onload = function(){
        onContentLoad(this, element.getAttribute("page"));
        element.previousElementSibling.remove();
        element.nextElementSibling.remove();
        element.remove();
        loader.style.display = "none";
        loadScrollEventSetup();
    };
    ajax.onerror = function(){
        element.disabled = 0;
        loader.style.display = "none";
        loadError.style.display = "block";
    };
    ajax.send();
}
try{
    var loadContentHeight;
    var viewMoreButton;
    loadScrollEventSetup();
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
        try{
            if(localStorage.getItem("loadonscroll") == "false"){
                window.removeEventListener("scroll", scrollLoad);
            }else{
                loadScrollEventSetup();
            }
        }catch(e){}
    };
}catch(e){}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
setCookie("timezone", (new Date()).getTimezoneOffset(), 1000);