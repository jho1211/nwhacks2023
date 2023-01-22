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

async function fetch_pis(){
    // Assume that user already has profile
    uname = getCookie("username");
    userType = getCookie("userType");

    data = {"username": uname, "userType": userType}

    const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/fetch/", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)})
    const piProfiles = await response.json();

    console.log(piProfiles);
}

auth_user();
fetch_pis();

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