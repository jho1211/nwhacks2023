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

            inputs = document.querySelectorAll("input");
            inputs[0].value = myProfile["name"]
            inputs[1].value = myProfile["website"]
            inputs[3].value = myProfile["email"]
            inputs[4].value = myProfile["extra"]

            deptSelect = $("#department")
            deptSelect[0].value = myProfile["department"];
            await add_topic_options(myProfile["department"])
            $("#topics").val(myProfile["topics"])

            $('#topics').select2()

            $('#userType').val(type);
            $('#userType').prop("disabled", true);
            $('#userType').trigger("change");

            return;
        }
        else{
            // If the user exists already and hasn't created a profile yet, then add them to data.json
            page_title.innerHTML = "Create Profile";

            await add_topic_options("Biochemistry");

            $('#topics').select2()

            $('#userType').val("undergrad");
            $('#userType').trigger("change");
            
            return;
        }
    }
}

async function submit_user(){
    uname = getCookie("username");
    profile = getCookie("hasProfile");
    type = document.getElementById("userType").value;

    inputs = document.querySelectorAll("input");

    var pfpLink = $('#imgBase64')

    if (pfpLink[0] !== undefined){
        data = {"pfp": pfpLink[0].innerHTML.split(',')[1], "username": uname, "userType": type, "name": inputs[0].value, "website": inputs[1].value, department: $('#department').val(), "email": inputs[3].value, "topics": $('#topics').val(), "extra": inputs[4].value}
    }
    else {
        data = {"username": uname, "userType": type, "name": inputs[0].value, "website": inputs[1].value, department: $('#department').val(), "email": inputs[3].value, "topics": $('#topics').val(), "extra": inputs[4].value}
    }

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

function imgToBase64() {

    var pfp = document.getElementById("profilePicInput").files;
    if (pfp.length == 1) {
        var img = pfp[0];

        var fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64
            var newDiv = document.createElement("div");
            newDiv.innerHTML = srcData;
            newDiv.id = 'imgBase64';
            newDiv.style.display = "none";
            document.body.appendChild(newDiv);
            return}

    fileReader.readAsDataURL(img);
    }
    else{
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
    
    $('#topics').select2();

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

function become_undergrad(){
    // If you are undergrad, then disable the website field and change topics -> interests instead
    // Disable addtl info, disable contact email
    userType = $('#userType').val();
    
    if (userType == 'undergrad'){
        $('#website').prop('disabled', true);
        $('#email').prop('disabled', true);
        $('#additional-info').prop('disabled', true);

        $('#website').prop('required', false);
        $('#email').prop('required', false);
        $('#resTopics')[0].innerHTML = "Research Interests";

        $('#profilePicDiv')[0].style.display = "none";
    }
    else {
        $('#website').prop('disabled', false);
        $('#email').prop('disabled', false);
        $('#additional-info').prop('disabled', false);

        $('#website').prop('required', true);
        $('#email').prop('required', true);
        $('#resTopics')[0].innerHTML = "Research Topics";

        $('#profilePicDiv')[0].style.display = "flex";
    }
}

populate_depts();
auth_user();

document.getElementById("profile-form").onsubmit = async (e) => {
    e.preventDefault();
    return await submit_user();
} 

document.getElementById("department").onchange = function (e) {
    populate_select(e.target.value);
}

document.getElementById("userType").onchange = function (e) {
    become_undergrad();
}

document.getElementById("profilePicInput").onchange = function (e){
    imgToBase64();
}