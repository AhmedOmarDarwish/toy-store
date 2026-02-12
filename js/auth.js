// Auth State
let currentUser = JSON.parse(localStorage.getItem("toyland_user")) || null;

document.addEventListener("DOMContentLoaded", () => {
  if (
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

// Handle Login
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  // Validation
  if (!validateEmail(email)) {
    showError("emailError");
    return;
  }
  if (password.length < 6) {
    showError("passwordError");
    return;
  }

  // Check credentials (from stored users or demo)
  const users = JSON.parse(localStorage.getItem("toyland_users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  let loggedInUser;

  if (user || (email === "demo@toyland.com" && password === "password123")) {
    if (user) {
      const sessionUser = { ...user };
      delete sessionUser.password;
      loggedInUser = sessionUser;
    } else {
      // Demo User
      loggedInUser = {
        id: "demo",
        name: "Demo User",
        email: email,
        joinDate: new Date().toISOString(),
      };
    }

    // Save session
    if (rememberMe) {
      localStorage.setItem("toyland_user", JSON.stringify(loggedInUser));
    } else {
      sessionStorage.setItem("toyland_user", JSON.stringify(loggedInUser));
    }

    currentUser = loggedInUser;

    // Redirect
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect") || "index.html";
    window.location.replace(redirect); // replace أفضل لتجنب الرجوع للصفحة السابقة
  } else {
    alert("Invalid email or password. Try demo@toyland.com / password123");
  }
}

// Handle Register
function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validation
  let valid = true;

  if (name.length < 2) {
    showError("nameError");
    valid = false;
  }
  if (!validateEmail(email)) {
    showError("emailError");
    valid = false;
  }
  if (password.length < 6) {
    showError("passwordError");
    valid = false;
  }
  if (password !== confirmPassword) {
    showError("confirmError");
    valid = false;
  }

  if (!valid) return;

  // Check if user exists
  const users = JSON.parse(localStorage.getItem("toyland_users")) || [];
  if (users.find((u) => u.email === email)) {
    alert("Email already registered!");
    return;
  }

  // Create user
  const newUser = {
    id:
      "user_" +
      Date.now().toString(36) +
      Math.random().toString(36).substr(2, 5).toUpperCase(),
    name: name,
    email: email,
    password: password,
    joinDate: new Date().toISOString(),
    isActive: true,
  };

  users.push(newUser);
  localStorage.setItem("toyland_users", JSON.stringify(users));

  // Create session (without password)
  const sessionUser = { ...newUser };
  delete sessionUser.password;
  localStorage.setItem("toyland_user", JSON.stringify(sessionUser));

  currentUser = sessionUser;

  alert("Account created successfully! Welcome to ToyLand! 🎉");
  window.location.href = "index.html";
}

// Logout
function logout() {
  localStorage.removeItem("toyland_user");
  sessionStorage.removeItem("toyland_user");
  currentUser = null;
  window.location.replace("index.html");
}

// Check Auth Status
function checkAuthStatus() {
  const user =
    JSON.parse(localStorage.getItem("toyland_user")) ||
    JSON.parse(sessionStorage.getItem("toyland_user"));

  if (user) {
    currentUser = user;
    updateUIForLoggedInUser();
  }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
  // Hide auth buttons, show user menu
  const authButtons = document.getElementById("authButtons");
  const userMenu = document.getElementById("userMenu");
  const mobileAuth = document.getElementById("mobileAuthButtons");
  const mobileUser = document.getElementById("mobileUserMenu");

  if (authButtons) authButtons.classList.add("hidden");
  if (userMenu) {
    userMenu.classList.remove("hidden");
    const avatar = document.getElementById("userAvatar");
    const name = document.getElementById("userName");
    if (avatar) avatar.textContent = currentUser.name
      ? currentUser.name.charAt(0) === " "
        ? currentUser.name.charAt(1).toUpperCase()
        : currentUser.name.charAt(0).toUpperCase()
      : "U";
    if (name) name.textContent = currentUser.name.split(" ")[0];
  }

  if (mobileAuth) mobileAuth.classList.add("hidden");
  if (mobileUser) mobileUser.classList.remove("hidden");
}

// Toggle Password Visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
}

// Validation Helpers
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 3000);
  }
}
