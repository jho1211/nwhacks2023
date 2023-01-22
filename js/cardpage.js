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

    for (var pip in piProfiles["pis"]){
        generate_profile_card(piProfiles["pis"][pip], piProfiles["myTopics"]);
    }

    return;
}

// Generate a card based on the profile given and adds it to the cards container
function generate_profile_card(profile, myTopics){
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
    topicContainer = generate_topic_cards(topicContainer, profile["topics"], myTopics);
    
    newDiv.appendChild(topHalf);
    newDiv.appendChild(topicContainer);

    // Implement the card expansion
    newDiv.onclick = function (e) {
        e.stopPropagation();
        expand_card(profile);
    }

    document.getElementById("cards").appendChild(newDiv);
}

function generate_topic_cards(tc, piTopics, myTopics){
    for (var i in piTopics){
        newTopicDiv = document.createElement("div")
        newTopicDiv.classList.add("topic");

        if (myTopics.includes(piTopics[i])){
            newTopicDiv.classList.add("topic-match");
            newTopicDiv.innerHTML = `<div class="topic-text">${piTopics[i]}</div></div>`
        }
        else{
            newTopicDiv.classList.add("topic-nomatch");
            newTopicDiv.innerHTML = `<div class="topic-text-nomatch">${piTopics[i]}</div></div>`
        }

        tc.appendChild(newTopicDiv);
    }
    return tc;
}

function expand_card(profile){
    console.log("Showing mega card");
    // Hide all the cards
    var cards = document.getElementById("cards")
    cards.style.display = "none";

    // Create a new div that takes up the page
    var megaCardDiv = document.createElement("div");
    megaCardDiv.classList.add("mega-cards-container");
    megaCardDiv.id = "megaCardDiv"

    var megaCard = document.createElement("div");
    megaCard.classList.add("mega-card");

    // generate megacard topics div and 
    var firstRow = document.createElement("div");
    firstRow.classList.add("mega-card-top-div");

    firstRow.innerHTML = `
    <div class="mega-card-bio-div"><div class="mega-card-bio-name">${profile["name"]}</div>
    <div class="mega-card-bio-dept">Department: ${profile["department"]}</div></div>
    
    <div class="mega-card-link-div"><a class="mega-card-link" href=${profile["website"]}>Website</a>
    <a class="mega-card-link" href="mailto:${profile["email"]}">Email</a></div>`

    megaCard.appendChild(firstRow);
    megaCardDiv.appendChild(megaCard);

    document.body.appendChild(megaCardDiv);
}

function deflate_card(){
    console.log("Deflating mega card");
    var mcd = document.getElementById("megaCardDiv");

    if (mcd !== null){
        mcd.remove();
    
        var cards = document.getElementById("cards")
        cards.style.display = "flex";

        return;
    }
    
    return;
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