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

    for (var pip in piProfiles){
        generate_profile_card(piProfiles[pip]);
    }

    return;
}

// Generate a card based on the profile given and adds it to the cards container
function generate_profile_card(profile){
    var newDiv = document.createElement("div");
    newDiv.classList.add("card");
    topHalf = document.createElement("div");
    topHalf.classList.add("text-half");
    topHalf.innerHTML = `<div class="name">
    ${profile["name"]}</div>
<div class="department">
    ${profile["department"]}</div>`
    
    topicContainer = document.createElement("div");
    topicContainer.classList.add("topic-container");
    topicContainer = generate_topic_cards(topicContainer, profile["topics"]);
    
    newDiv.appendChild(topHalf);
    newDiv.appendChild(topicContainer);
    document.getElementById("cards").appendChild(newDiv);
}

function generate_topic_cards(tc, topics){
    for (var i in topics){
        newTopicDiv = document.createElement("div")
        newTopicDiv.classList.add("topic");
        newTopicDiv.classList.add("topic-match");
        newTopicDiv.innerHTML = `<div class="topic-text">${topics[i]}</div></div>`

        tc.appendChild(newTopicDiv);
    }
    return tc;
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