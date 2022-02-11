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
    }else{
        localStorage.setItem("lang", lang);
        window.onlanguagechange = function(){};
    }
};
languageSelect.value = lang;
var settingsTitle = document.getElementById("settingstitle");
var langLabel = document.getElementById("langlabel");
languageSelect.onchange = function(){
    lang = this.value;
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    defaultLang.checked = 0;
};
window.onlanguagechange = function(){
    lang = navigator.language.substring(0, 2);
    setLanguage(lang);
    languageSelect.value = lang;
};