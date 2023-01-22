$(function () { $('#topics').selectize({sortField: "text"}) });

function auth_user(){
    page_title = document.getElementById("profileTitle")
    uname = getCookie("username");
    profile = getCookie("hasProfile");

    if (uname == ""){
        alert("You need to create an account before visiting this page.")
        //location.replace("index.html")
        return;
    }
    else{
        if (profile == ""){
            page_title.innerHTML = "Edit Profile";
            return;
        }
        else{
            // If the user exists already and hasn't created a profile yet, then add them to data.json
            page_title.innerHTML = "Create Profile";
            return;
        }
    }
}

async function submit_user(){
    uname = getCookie("username");
    profile = getCookie("hasProfile");

    if (uname !== "" && profile !== ""){
        // If the user exists already and has created a profile, then edit their entry in data.json
        const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/edit_" + uname)

        // if response status is good, then set the cookie and redirect them to the search

        document.cookie = "username=" + uname + ";" + "hasProfile=true;"

        // if response status is bad, then alert
    }
    else{
        const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/add_" + uname)

        // if response status is good, then set the cookie and redirect them to the search

        document.cookie = "username=" + uname + ";" + "hasProfile=true;"

        // if response status is bad, then alert
    }
}

auth_user();

document.getElementById("saveBtn").onsubmit = async (e) => {
    e.preventDefault();
    return await submit_user();
} 