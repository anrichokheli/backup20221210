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
    window.onstorage = function(){
        darkMode();
        setLanguage();
    };
}catch(e){}
try{
    var buttonsDivs = document.getElementsByClassName("buttonsdivs");
    var shareButton;
    function addShareButton(n, element){
        shareButton = document.createElement("button");
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
    for(var key in buttonsDivs){
        if(buttonsDivs[key].parentNode.classList.contains("one")){
            addShareButton(buttonsDivs[key].parentNode.id, buttonsDivs[key]);
        }
    }
}catch(e){}
try{
    var topDiv = document.getElementById("top");
    document.getElementsByClassName("one")[0].style.marginTop = topDiv.clientHeight + 10 + "px";
    topDiv.style.position = "fixed";
    window.onscroll = function(){
        if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0){
            topDiv.childNodes[0].childNodes[0].width = "32";
            topDiv.childNodes[0].childNodes[0].height = "32";
            topDiv.childNodes[0].childNodes[2].style.fontSize = "1em";
        }else{
            topDiv.childNodes[0].childNodes[0].width = "64";
            topDiv.childNodes[0].childNodes[0].height = "64";
            topDiv.childNodes[0].childNodes[2].style.fontSize = "2em";
        }
    };
}catch(e){}
try{
    var descriptionDivs = document.getElementsByClassName("descriptiondiv");
    for(var i = 0; i < descriptionDivs.length; i++){
        if(descriptionDivs[i].childNodes.length > 1){
            var seeMore = document.getElementById("seemore"+descriptionDivs[i].parentNode.parentNode.id);
            seeMore.style.display = "inline";
            document.getElementById("moretext"+descriptionDivs[i].parentNode.parentNode.id).style.display = "none";
            seeMore.onclick = function(){
                var moreText = document.getElementById("moretext"+this.parentNode.parentNode.parentNode.id);
                if(this.innerText == "...>>"){
                    moreText.style.display = "inline";
                    this.innerText = "...<<";
                }else{
                    moreText.style.display = "none";
                    this.innerText = "...>>";
                }
            };
        }
    }
}catch(e){}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
setCookie("timezone", (new Date()).getTimezoneOffset(), 1000);