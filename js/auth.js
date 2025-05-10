document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const loginForm = document.getElementById("login");
  const registerForm = document.getElementById("register");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const loginFormContainer = document.getElementById("login-form");
  const registerFormContainer = document.getElementById("register-form");

  // Toggle between forms
  const toggleForms = (showLoginForm) => {
    loginFormContainer.style.display = showLoginForm ? "block" : "none";
    registerFormContainer.style.display = showLoginForm ? "none" : "block";
  };

  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(false);
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(true);
  });

  // Error handling
  const showError = (id, message) => {
    const el = document.getElementById(id);
    el.textContent = message;
    el.classList.add("show");
  };

  const clearError = (id) => {
    const el = document.getElementById(id);
    el.textContent = "";
    el.classList.remove("show");
  };

  // Button loading states
  const setButtonLoading = (btn, message) => {
    btn.innerHTML = `<div class="spinner"></div> ${message}`;
    btn.disabled = true;
  };

  const resetButton = (btn, text) => {
    btn.innerHTML = text;
    btn.disabled = false;
  };

  // Password validation
  const validatePassword = (password) =>
    password.length < 8 ? "Password must be at least 8 characters long." : null;

  // Get next available ID
  const getNextId = async () => {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();
    const maxId = users.reduce((max, user) => Math.max(max, parseInt(user.id, 10)), 0);
    return String(maxId + 1);
  };

  // Login submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const submitBtn = loginForm.querySelector("button");

    clearError("login-email-error");
    clearError("login-password-error");

    if (!email || !email.includes("@")) {
      showError("login-email-error", "Please enter a valid email address.");
      return;
    }

    if (!password) {
      showError("login-password-error", "Password is required.");
      return;
    }
    setButtonLoading(submitBtn, "Logging in...");

    try {
      const res = await fetch("http://localhost:3000/users");
      const users = await res.json();
      const user = users.find((u) => u.email === email && u.password === password);

      if (!user) {
        showError("login-password-error", "Invalid email or password.");
        return;
      }

      const redirect = (url, message = "Welcome!", name = user.name) => {
        Swal.fire({ title: message, text: `Welcome, ${name}!`, icon: "success" }).then(() => {
          window.location.href = url;
        });
      };

      if (email === "mo2.prog@gmail.com") {
        Swal.fire({
          title: "Welcome, Admin!",
          text: "You are being redirected to the admin page.",
          icon: "success",
        }).then(() => window.location.href = "admin.html");
      } else if (user.role === "seller") {
        if (user.approved) {
          localStorage.setItem("currentUserId", user.id);
          redirect(`seller.html?sellerId=${user.id}`, "Welcome, Seller!");
        } else {
          Swal.fire({
            title: "Account Not Approved",
            text: "Your seller account is not yet approved.",
            icon: "warning",
          });
        }
      } else {
        localStorage.setItem("currentCustomerId", user.id);
        redirect("index.html");
      }

    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Error", text: "An error occurred. Please try again.", icon: "error" });
    } finally {
      resetButton(submitBtn, "Login");
    }
  });

  // Register submission
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("register-role").value;
    const submitBtn = registerForm.querySelector("button");

    const passwordError = validatePassword(password);
    if (passwordError) {
      showError("password-error", passwordError);
      return;
    }

    setButtonLoading(submitBtn, "Registering...");

    try {
      const res = await fetch("http://localhost:3000/users");
      const users = await res.json();

      if (users.some((u) => u.email === email)) {
        Swal.fire({
          title: "Error",
          text: "Email already registered. Please use another.",
          icon: "error",
        });
        return;
      }

      const id = await getNextId();
      const newUser = {
        id,
        name,
        email,
        password,
        role,
        order_ids: [],
        address: "",
      };

      const postRes = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!postRes.ok) throw new Error("Registration failed.");

      Swal.fire({
        title: "Success!",
        text: "Registration complete. Please login.",
        icon: "success",
      }).then(() => window.location.href = "login.html");

    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Error", text: err.message || "Something went wrong.", icon: "error" });
    } finally {
      resetButton(submitBtn, "Register");
    }
  });
});
