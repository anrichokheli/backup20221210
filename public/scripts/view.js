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