var ajax = new XMLHttpRequest();
ajax.open("GET", "html/index1.html");
ajax.onload = function(){
    var style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "styles/index1.css";
    document.head.appendChild(style);
    document.getElementById("main").innerHTML = this.responseText;
    var script = document.createElement("script");
    script.src = "scripts/index1.js";
    document.body.appendChild(script);
};
ajax.send();