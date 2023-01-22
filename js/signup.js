async function signup(){
    email_input = document.getElementById("email");
    pw_input = document.getElementById("password");
    confirm_pw_input = document.getElementById("confirm-password");
    data = {"email": email_input.value, "password": pw_input.value}

    // Add some validation here
    if (pw_input.value !== confirm_pw_input.value) {
        alert("Passwords do not match.")
        return false;
    }


    const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/signup", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    if (response.status == 696){
        // the password is incorrect
        alert("The email already exists, please sign-in instead.");
    }
    else if (response.ok){
        // the email doesn't exist and the password matches
        setCookie(email_input.value, "", "");
        alert("You have successfully created an account, welcome!")
        location.replace("profile.html")
    }
    else{
        alert("Error has occurred, please try again later.")
    }
}

document.getElementById("signup-form").onsubmit = async (e) => {
    e.preventDefault();
    return await signup();
}