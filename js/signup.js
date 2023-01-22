async function signup(){
    email_input = document.getElementById("email");
    pw_input = document.getElementById("password");
    confirm_pw_input = document.getElementById("confirm-password");
    data = {"email": email_input.value, "password": pw_input.value}

    console.log(pw_input.value);
    console.log(confirm_pw_input.value);

    // Add some validation here
    if (pw_input.value !== confirm_pw_input.value) {
        console.log("Wrong");
        pw_input.setCustomValidity("Passwords do not match.")
        pw_input.reportValidity();
        return false;
    }


    const response = await fetch("https://Undergrad-to-PI-Match-Service.jeffreyho3.repl.co/signup", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    if (response.status == 420){
        // the password is incorrect
        alert("Password is incorrect.");
    }
    else if (response.status == 666){
        // the user doesn't exist
        alert("The email doesn't exist.");
    }
    else if (response.status == 1337){
        // the user exists and password is correct
        alert("You have been authenticated, welcome!")
    }
}

document.getElementById("signup-form").onsubmit = async (e) => {
    e.preventDefault();
    return await signup();
}