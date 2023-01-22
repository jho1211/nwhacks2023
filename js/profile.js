async function auth_user(){
    page_title = document.getElementById("profileTitle")
    uname = getCookie("username");
    profile = getCookie("hasProfile");
    type = getCookie("userType");

    if (uname == ""){
        alert("You need to create a new account or sign-in before visiting this page.")
        location.replace("index.html")
        return;
    }
    else{
        if (profile !== ""){
            page_title.innerHTML = "Edit Profile";
            // fetch all of the user's profile
            data = {"username": uname, "userType": type}
            const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/get/", {
                method: "POST",
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)})
            
            const myProfile = await response.json();
            console.log(myProfile);

            inputs = document.querySelectorAll("input");
            inputs[0].value = myProfile["name"]
            inputs[1].value = myProfile["website"]
            inputs[2].value = myProfile["email"]
            inputs[3].value = myProfile["extra"]

            deptSelect = $("#department")
            deptSelect[0].value = myProfile["department"];
            await add_topic_options(myProfile["department"])
            $("#topics").val(myProfile["topics"])

            $('#topics').select2()

            topicSelect = $("#topics")
            console.log(topicSelect[0]);

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
    type = document.getElementById("userType").value;

    inputs = document.querySelectorAll("input");

    data = {"username": uname, "userType": type, "name": inputs[0].value, "website": inputs[1].value, department: $('#department').val(), "email": inputs[2].value, "topics": $('#topics').val(), "extra": inputs[3].value}

    if (uname !== "" && profile !== ""){
        // If the user exists already and has created a profile, then edit their entry in data.json
        const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/edit/", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)})

        // if response status is good, then set the cookie and redirect them to the search
        if (response.ok){
            setCookie(uname, "true", type)
            location.replace("cardpage.html");
        }
        else{
            alert("There was an error editing your profile, please try again later.")
        }
    }
    else if (type !== ""){
        const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/add/", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)})

        // if response status is good, then set the cookie and redirect them to the search
        if (response.ok){
            setCookie(uname, "true", type)
            location.replace("cardpage.html");
        }
        else{
            alert("There was an error adding your profile, please try again later.")
        }
    }
    else{
        alert("An unknown error occurred, please try again later.");
        return false;
    }
}

async function populate_depts(){
    var response = await fetch("data/departments.json");
    const resp_json = await response.json();
    departments = Object.keys(resp_json);

    deptSelect = document.getElementById("department");

    for (var i in departments){
        var newOption = document.createElement("option");
        dept = departments[i];

        newOption.value = dept;
        newOption.innerHTML = dept;

        deptSelect.add(newOption);
    }
}

async function populate_select(dept){
    $('#topics').select2('destroy');
    clear_options();

    await add_topic_options(dept)
    
    const converted = $('#topics').select2();

    return;
}

async function add_topic_options(dept){
    const response = await fetch("data/departments.json");
    topics = await response.json();
    topicSelect = $("#topics")[0];

    arr = []

    if (topics.hasOwnProperty(dept)){
        for (var i in topics[dept]){
            var newOption = document.createElement("option")
            newOption.value = topics[dept][i]
            newOption.innerHTML = topics[dept][i]

            topicSelect.add(newOption);
        }
    }
    else{
        console.log("There are no topics for this department.");
    }

    return;
}

function clear_options(){
    const topicSelect = $('#topics')[0];
    var len = topicSelect.options.length - 1;
    
    for (var i = len; i >= 0; i--){
        topicSelect.remove(i);
    }
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