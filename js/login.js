async function login(){
    email = document.getElementById("email").value;
    pw = document.getElementById("password").value;
    data = {"username": email, "password": pw}
    const url = "https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/login"

    const response = await fetch(url, {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    if (response.ok){
        // the user exists and password is correct
        d = await response.json();
        alert("You have been authenticated, welcome!");
        
        setCookie(email, d["hasProfile"], d["userType"])
        

        if (d["hasProfile"] !== ""){
            //location.replace("card.html");
        }
        else{
            //location.replace("profile.html");
        }
    }
    else if (response.status == 420){
        // the password is incorrect
        alert("Password is incorrect.");
    }
    else if (response.status == 666){
        // the user doesn't exist
        alert("The email doesn't exist.");
    }
    else{
        alert("An error occurred, please try logging in again later.");
    }
}

document.getElementById("login-btn").onclick = async () => {
    await login();
}

function autoLogin(){
    if (getCookie("username") !== "" && getCookie("hasProfile") !== ""){
        location.replace("card.html");
    }
    else if (getCookie("username") !== "" && getCookie("hasProfile") == ""){
        location.replace("profile.html");
    }
    
    return;
}

autoLogin();