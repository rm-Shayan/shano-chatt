function firstPage() {
    var firstP = document.getElementById("firstpage");

    // Set background color for both html and body immediately
    var pg_1= document.getElementById("pg1")

    // Hide the content after 5 seconds
    setTimeout(function() {
        firstP.style.display = "none";
        document.documentElement.style.backgroundColor = "#fff";
        document.body.style.backgroundColor = "#fff";
      pg_1.style.display="block"
    }, 2000); // 5000 milliseconds = 5 seconds
}

// Add event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    firstPage();
});

function nextPage(){
    document.getElementById("text").innerHTML="<h4>"+  "if you are confused aboutwhat <br/> to do just open chat"+ "</h4> "; 
var buttonSwap=document.getElementById("nextPage")
buttonSwap.style.display="none"
var buttonSwap2=document.getElementById("frontPage")
buttonSwap2.style.display="block"
    

}

function registerPage(){
  var a=document.getElementById("nextPage")
a.href="register.html"
}