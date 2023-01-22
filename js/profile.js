$(function () { $('#topics').select2({theme: "classic"}) });

function auth_user(){
    page_title = document.getElementById("profileTitle")
    uname = getCookie("username");
    profile = getCookie("hasProfile");

    if (uname == ""){
        alert("You need to create a new account or sign-in before visiting this page.")
        location.replace("index.html")
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
    type = getCookie("userType");

    data = {"username": uname, "name": inputs[0].value, "website": inputs[1].value, department: $('#department').val(), "email": inputs[3].value, "topics": $('#topics').val(), "extra": inputs[4].value}
    console.log(data);

    if (uname !== "" && profile !== "" && type != ""){
        // If the user exists already and has created a profile, then edit their entry in data.json
        const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/edit/" + type, {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)})

        // if response status is good, then set the cookie and redirect them to the search
        if (response.ok){
            setCookie(uname, "true", type)
        }

        // if response status is bad, then alert
    }
    else if (type !== ""){
        const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/add/" + uname)

        // if response status is good, then set the cookie and redirect them to the search

        setCookie(uname, "true")

        // if response status is bad, then alert
    }
    else{
        alert("An unknown error occurred, please try again later.");
        return false;
    }
}

function populate_depts(){
    departments = Object.keys(fetch("data/departments.json"));
    departments.sort();

    deptSelect = document.getElementById("department");

    for (var i in departments){
        var newOption = document.createElement("option");
        dept = departments[i];

        newOption.value = dept;
        newOption.innerHTML = dept;

        deptSelect.add(newOption);
    }
}

function populate_select(dept){
    topics = fetch("data/departments.json")[dept];

    for (var i in topics){
        var newOption = document.createElement("option");
        topic = topics[i]

        newOption.value = topic;
        newOption.innerHTML = topic;
        
        topicSelect.add(newOption);
    }

    return;
}

function clear_options(){
    topicSelect = $('topics').selectize
    topicSelect.removeOption("test1");
}

auth_user();
populate_depts();

document.getElementById("profile-form").onsubmit = async (e) => {
    e.preventDefault();
    return await submit_user();
} 

document.getElementById("department").onchange = function (e) {
    populate_select(e.target.value);
}