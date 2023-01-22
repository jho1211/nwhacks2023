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
    inputs = document.querySelectorAll("input")
    console.log()

    data = {"name": inputs[0], "website": inputs[1], department: $('#department').val(), "email": inputs[3], "topics": $('#topics').val(), "extra": inputs[5]}
    console.log(data);

    const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/edit", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    if (uname !== "" && profile !== ""){
        // If the user exists already and has created a profile, then edit their entry in data.json
        const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/edit/" + uname)

        // if response status is good, then set the cookie and redirect them to the search
        if (response.ok){

        }

        setCookie(uname, "true")

        // if response status is bad, then alert
    }
    else{
        const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/add/" + uname)

        // if response status is good, then set the cookie and redirect them to the search

        setCookie(uname, "true")

        // if response status is bad, then alert
    }
}

auth_user();

document.getElementById("profile-form").onsubmit = async (e) => {
    e.preventDefault();
    return await submit_user();
} 