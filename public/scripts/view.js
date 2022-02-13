try{
    if(localStorage.getItem("darkmode") != null){
        var mainDiv = document.getElementById("main");
        window.matchMedia("(prefers-color-scheme: dark)").onchange = function(){};
        if(localStorage.getItem("darkmode") == "true"){
            document.documentElement.style.colorScheme = "dark";
            mainDiv.style.backgroundColor = "#000000";
        }else{
            document.documentElement.style.colorScheme = "light";
            mainDiv.style.backgroundColor = "#ffffff";
        }
    }
}catch{}
try{
    var lang = localStorage.getItem("lang");
    if(lang == null){
        lang = navigator.language.substring(0, 2);
    }
    var strings = null;
    function getString(key)  {
        if(strings!=null)return strings[key];
        return "";
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
}catch{}