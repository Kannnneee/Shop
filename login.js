document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginbutton");
    const signupButton = document.getElementById("signupbutton");

    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    const switchToSignup = document.getElementById("switchtosignup");
    const switchToLogin = document.getElementById("switchtologin");

    const loginMessage = document.getElementById("loginMessage");
    const signupMessage = document.getElementById("signupMessage");

    // Open Modals
    loginButton.addEventListener("click", () => loginModal.style.display = "block");
    signupButton.addEventListener("click", () => signupModal.style.display = "block");

    // Close Modals
    document.querySelectorAll(".close").forEach(btn => {
        btn.addEventListener("click", function () {
            document.getElementById(this.getAttribute("data-modal")).style.display = "none";
        });
    });

    // Switch Between Login & Signup Modals
    switchToSignup.addEventListener("click", () => {
        loginModal.style.display = "none";
        signupModal.style.display = "block";
    });

    switchToLogin.addEventListener("click", () => {
        signupModal.style.display = "none";
        loginModal.style.display = "block";
    });

    // Signup Functionality
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let email = document.getElementById("signupEmail").value;
        let password = document.getElementById("signupPassword").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            signupMessage.innerText = "Passwords do not match!";
            signupMessage.style.color = "red";
            return;
        }

        if (localStorage.getItem(email)) {
            signupMessage.innerText = "User already exists!";
            signupMessage.style.color = "red";
            return;
        }

        let userData = { firstName, lastName, email, password };
        localStorage.setItem(email, JSON.stringify(userData));

        signupMessage.innerText = "Signup successful! Please login.";
        signupMessage.style.color = "green";
        signupForm.reset();
        setTimeout(() => {
            signupModal.style.display = "none";
            loginModal.style.display = "block";
        }, 1500);
    });

    // Login Functionality
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;

        let userData = localStorage.getItem(email);
        if (!userData) {
            loginMessage.innerText = "User not found!";
            loginMessage.style.color = "red";
            return;
        }

        let user = JSON.parse(userData);
        if (user.password !== password) {
            loginMessage.innerText = "Incorrect password!";
            loginMessage.style.color = "red";
            return;
        }

        // Save current user session
        localStorage.setItem("currentUser", email);
        updateUI();
        loginMessage.innerText = "Login successful!";
        loginMessage.style.color = "green";

        setTimeout(() => {
            loginModal.style.display = "none";
        }, 1000);
    });

    // Logout Functionality
    signupButton.addEventListener("click", function () {
        if (localStorage.getItem("currentUser")) {
            localStorage.removeItem("currentUser");
            updateUI();
        }
    });

    // Update UI Based on Login Status
    function updateUI() {
        let currentUser = localStorage.getItem("currentUser");

        if (currentUser) {
            let user = JSON.parse(localStorage.getItem(currentUser));
            loginButton.innerText = user.firstName;
            signupButton.innerText = "Logout";
        } else {
            loginButton.innerText = "Login";
            signupButton.innerText = "Signup";
        }
    }

    // Initialize UI on page load
    updateUI();
});
