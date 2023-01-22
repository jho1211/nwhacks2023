function auth_user(){
    uname = getCookie("username");
    profile = getCookie("hasProfile");
    userType = getCookie("userType");

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
        if (userType == "pi"){
            alert("You don't belong here sir, please go back to your profile");
            location.replace("profile.html");
        }
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

    if (Object.keys(piProfiles).length == 0){
        alert("There were no PIs that match your research interests.")
    }

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
        expand_card(profile, myTopics);
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

function generate_mega_topic_cards(tc, piTopics, myTopics){
    for (var i in piTopics){
        newTopicDiv = document.createElement("div")
        newTopicDiv.classList.add("mega-topic");

        if (myTopics.includes(piTopics[i])){
            newTopicDiv.classList.add("topic-match");
            newTopicDiv.innerHTML = `<div class="mega-topic-text">${piTopics[i]}</div></div>`
        }
        else{
            newTopicDiv.classList.add("topic-nomatch");
            newTopicDiv.innerHTML = `<div class="topic-text-nomatch">${piTopics[i]}</div></div>`
        }

        tc.appendChild(newTopicDiv);
    }
    return tc;
}

function expand_card(profile, myTopics){
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
    firstRow.classList.add("mega-card-to-div");

    firstRow.innerHTML = `
    <div class="mega-card-bio-div"><div class="mega-card-bio-name">${profile["name"]}</div>
    <div class="mega-card-bio-dept">Department: ${profile["department"]}</div></div>
    <div class="profilePicDiv"></div>

    <button class="close-mega-btn" onclick="deflate_card()">X</button>`

    if ("pfp" in Object.keys(profile) && profile["pfp"] !== ""){
        var image = new Image();
        image.src = `${profile["pfp"]}`;
        document.getElementById("profilePicDiv").appendChild(image);
    }

    var topicRow = document.createElement("div");
    topicRow.classList.add("mega-card-topic-div");
    topicRow = generate_mega_topic_cards(topicRow, profile["topics"], myTopics)

    var btmRight = document.createElement("div");
    btmRight.classList.add("mega-btm-right-div");
    btmRight.innerHTML = `<div class="mega-card-link-div">
    <a class="mega-card-link" href=${profile["website"]}>Website</a>
    <a class="mega-card-link" href="mailto:${profile["email"]}">Email</a></div>`

    var additionalDiv = document.createElement("div");
    additionalDiv.classList.add("mega-info-div")
    additionalDiv.innerHTML = `<h1 class="additional-title">Additional Information:</h1><div class="additional-text">${profile["extra"]}</div>`

    megaCard.appendChild(firstRow);
    topicRow.appendChild(btmRight);
    megaCard.appendChild(topicRow);
    megaCard.appendChild(additionalDiv);
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

/*
document.getElementById("searchNavBtn").onclick = function () {
    location.href = "filter.html";
}
*/

document.getElementById("profileNavBtn").onclick = function () {
    location.href = "profile.html";
}

document.getElementById("logOutNavBtn").onclick = function () {
    clearCookies();
    location.href = "index.html";
}