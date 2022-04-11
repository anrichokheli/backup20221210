document.getElementById("settingscontent").style.maxHeight = "calc(90vh - 9px - "+document.getElementById("settingstop").clientHeight+"px)";
var darkmodediv = document.getElementById("darkmodediv");
var darkmodecheckbox = document.getElementById("darkmodecheckbox");
var defaultTheme = document.getElementById("defaulttheme");
function changeDarkMode()   {
    if(defaultTheme.checked)defaultTheme.checked=0;
    matchmedia.onchange=function(){};
    setDarkMode(!darkModeEnabled);
    localStorage.setItem("darkmode", darkModeEnabled);
    setWindowDarkMode(settingsWindowOverlay, settingsWindow);
}
darkmodecheckbox.addEventListener("click", function(){changeDarkMode();});
darkmodediv.addEventListener("click", function(){darkmodecheckbox.checked = !darkmodecheckbox.checked;changeDarkMode();});
defaultTheme.onchange = function(){
    if(this.checked){
        defaultdarkmode();
        setWindowDarkMode(settingsWindowOverlay, settingsWindow);
        localStorage.removeItem("darkmode");
    }else {
        matchmedia.onchange=function(){};
        localStorage.setItem("darkmode",darkModeEnabled);
    }
    darkmodecheckbox.checked=darkModeEnabled;
};
darkmodecheckbox.checked=darkModeEnabled;
if(localStorage.getItem("darkmode")==null)defaultTheme.checked=1;
var defaultLang = document.getElementById("defaultlang");
if(localStorage.getItem("lang") == null){
    defaultLang.checked = 1;
}
var languageSelect = document.getElementById("setlang");
defaultLang.onchange = function(){
    if(this.checked){
        localStorage.removeItem("lang");
        lang = navigator.language.substring(0, 2);
        setLanguage(lang);
        languageSelect.value = lang;
        window.onlanguagechange = function(){onLanguageChange();};
    }else{
        localStorage.setItem("lang", lang);
        window.onlanguagechange = function(){};
    }
};
languageSelect.value = lang;
languageSelect.onchange = function(){
    lang = this.value;
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    defaultLang.checked = 0;
    window.onlanguagechange = function(){};
};
var saveUploads = document.getElementById("saveuploads");
if(localStorage.getItem("saveuploads") == "true"){
    saveUploads.checked = 1;
}
saveUploads.onchange = function(){
    localStorage.setItem("saveuploads", this.checked);
};
try{
    window.addEventListener("storage", function(){
        try{
            if(this.localStorage.getItem("darkmode")=="true"){
                onDarkModeChange(1);
            }else{
                onDarkModeChange(0);
                if(this.localStorage.getItem("darkmode")==null){
                    defaultTheme.checked=1;
                }else{
                    defaultTheme.checked=0;
                }
            }
        }catch(e){}
        try{
            languageSelect.value = lang;
            if(this.localStorage.getItem("lang")==null){
                defaultLang.checked=1;
            }else{
                defaultLang.checked=0;
            }
        }catch(e){}
        try{
            if(localStorage.getItem("saveuploads") == "true"){
                saveUploads.checked = 1;
            }else{
                saveUploads.checked = 0;
            }
        }catch(e){}
    });
}catch(e){}
try{
    function colorInputSetup(name, defaultColor){
        var input = document.getElementById(name);
        var storage = localStorage.getItem(name);
        if(storage){
            input.value = storage;
        }else{
            input.value = defaultColor;
        }
        input.onchange = function(){
            localStorage.setItem(name, this.value);
            setDarkMode(darkModeEnabled);
        }
    }
    colorInputSetup("lightcolor", "#000000");
    colorInputSetup("lightbackgroundcolor", "#ffffff");
    colorInputSetup("darkcolor", "#ffffff");
    colorInputSetup("darkbackgroundcolor", "#000000");
}catch(e){}
try{
    var resetSettings = document.getElementById("resetsettings");
    resetSettings.onclick = function(){
        if(confirm(getString("resetsettings")+"?")){
            localStorage.removeItem("darkmode");
            localStorage.removeItem("lang");
            localStorage.setItem("saveuploads", true);
            localStorage.removeItem("lightcolor");
            localStorage.removeItem("lightbackgroundcolor");
            localStorage.removeItem("darkcolor");
            localStorage.removeItem("darkbackgroundcolor");
            darkmode();
            language();
            setSettingsWindow();
        }
    };
}catch(e){}