async function login(){
    email = document.getElementById("email").value;
    pw = document.getElementById("password").value;
    data = {"email": email, "password": pw}

    const response = await fetch(url, {
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
}