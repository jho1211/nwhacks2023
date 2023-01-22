function auth_user(){
    uname = getCookie("username");
    profile = getCookie("hasProfile");

    if (uname == ""){
        alert("You need to create a new account or sign-in before visiting this page.")
        location.replace("index.html")
        return;
    }
    else if (profile == ""){
        alert("You will need to create a profile first.")
        location.replace("profile.html");
    }
    else{
        console.log("Welcome " + uname);
        return;
    }
}

auth_user();

document.getElementById("searchNavBtn").onclick = function () {
    location.href = "filter.html";
}

document.getElementById("profileNavBtn").onclick = function () {
    location.href = "profile.html";
}

document.getElementById("logOutNavBtn").onclick = function () {
    clearCookies();
    location.href = "index.html";
}