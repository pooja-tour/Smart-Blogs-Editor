function login() {

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.message === "Login Successful") {
            alert("Welcome back!");
            window.location.href = "editor.html";
        }
        else if (data.message === "Invalid Credentials") {
            alert("Wrong password!");
        }
        else if (data.message === "User not found") {
            alert("Account not found. Please create account first.");
        }
        else {
            alert(data.message);
        }

    });
}