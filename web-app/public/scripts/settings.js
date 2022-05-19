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
        setCookie("lang", "");
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
try{
    var timeZoneValueDiv = document.getElementById("timezonevalue");
    var timezoneSelect = document.getElementById("settimezone");
    var defaultTimezone = document.getElementById("defaulttimezone");
    function setTimeZoneHTML(value){
        if(value > 0){
            value = '+' + value;
        }
        timeZoneValueDiv.innerText = value;
    }
    if(localStorage.getItem("timezone") == null){
        defaultTimezone.checked = 1;
        setTimeZoneHTML(getCookie("timezone") / -60);
    }else{
        setTimeZoneHTML(localStorage.getItem("timezone"));
    }
    timezoneSelect.value = Math.round(timeZoneValueDiv.innerText);
    defaultTimezone.onchange = function(){
        if(this.checked){
            localStorage.removeItem("timezone");
            setCookie("settingstimezone", "");
            setTimeZoneHTML((new Date()).getTimezoneOffset() / -60);
            timezoneSelect.value = Math.round((new Date()).getTimezoneOffset() / -60);
        }
    };
    timezoneSelect.onchange = function(){
        localStorage.setItem("timezone", this.value);
        setCookie("settingstimezone", this.value, 1000);
        setTimeZoneHTML(this.value);
        defaultTimezone.checked = 0;
    };
    
}catch(e){}
try{
    var saveUploads = document.getElementById("saveuploads");
    if(localStorage.getItem("saveuploads") == "true"){
        saveUploads.checked = 1;
    }
    saveUploads.onchange = function(){
        localStorage.setItem("saveuploads", this.checked);
    };
}catch(e){}
/*try{
    var colorFilterCheckbox = document.getElementById("colorfiltercheckbox");
    var colorFilterRange = document.getElementById("colorfilterrange");
    var colorFilterNumber = document.getElementById("colorfilternumber");
    function setColorFilterSettings(){
        if(localStorage.getItem("colorfilterenabled") == "true"){
            colorFilterCheckbox.checked = 1;
        }else{
            colorFilterCheckbox.checked = 0;
        }
        colorFilterRange.value = localStorage.getItem("colorfiltervalue");
        colorFilterNumber.value = localStorage.getItem("colorfiltervalue");
    }
    setColorFilterSettings();
    colorFilterCheckbox.onchange = function(){
        if(this.checked){
            lightFilter.style.display = "block";
        }else{
            lightFilter.style.display = "none";
        }
        localStorage.setItem("colorfilterenabled", this.checked);
    };
    colorFilterRange.oninput = function(){
        setFilterValue(this.value);
        colorFilterNumber.value = this.value;
    };
    colorFilterNumber.oninput = function(){
        setFilterValue(this.value);
        colorFilterRange.value = this.value;
    };
}catch(e){}*/
function setLoadOnScroll(){
    if(localStorage.getItem("loadonscroll") != "false"){
        loadOnScroll.checked = 1;
    }else{
        loadOnScroll.checked = 0;
    }
}
try{
    var loadOnScroll = document.getElementById("loadonscroll");
    setLoadOnScroll();
    loadOnScroll.onchange = function(){
        localStorage.setItem("loadonscroll", this.checked);
    };
}catch(e){}
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
        /*try{
            setColorFilterSettings();
        }catch(e){}*/
        try{
            setLoadOnScroll();
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
            localStorage.removeItem("timezone");
            setCookie("lang", "");
            setCookie("settingstimezone", "");
            localStorage.setItem("saveuploads", true);
            //localStorage.removeItem("colorfilterenabled");
            //localStorage.setItem("colorfiltervalue", colorFilterDefaultValue);
            localStorage.removeItem("lightcolor");
            localStorage.removeItem("lightbackgroundcolor");
            localStorage.removeItem("darkcolor");
            localStorage.removeItem("darkbackgroundcolor");
            localStorage.removeItem("loadonscroll");
            darkmode();
            language();
            //colorfilter();
            setSettingsWindow(true);
        }
    };
}catch(e){}