document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.querySelectorAll(".login-form input")[0];
  const passwordInput = document.querySelectorAll(".login-form input")[1];
  const loginBtn = document.querySelector(".btn-login");

  const emailLabel = document.querySelectorAll(".login-form span")[0];
  const passwordLabel = document.querySelectorAll(".login-form span")[1];

  // ===== ADMIN ACCOUNT =====
  const ADMIN_EMAIL = "thinh531240958@gmail.com";
  const ADMIN_PASSWORD = "thinh53124";

  // ===== ERROR UI =====
  const emailError = document.createElement("p");
  emailError.classList.add("error-message");
  emailLabel.insertAdjacentElement("afterend", emailError);

  const passwordError = document.createElement("p");
  passwordError.classList.add("error-message");
  passwordLabel.insertAdjacentElement("afterend", passwordError);

  const loginError = document.createElement("p");
  loginError.classList.add("error-message");
  loginBtn.insertAdjacentElement("beforebegin", loginError);

  function showError(el, message) {
    el.textContent = message;
    el.style.display = "block";
  }

  function hideError(el) {
    el.textContent = "";
    el.style.display = "none";
  }

  function setInputError(input, status) {
    if (status) input.classList.add("input-error");
    else input.classList.remove("input-error");
  }

  function validateForm() {
    let isValid = true;

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (emailValue === "") {
      showError(emailError, "Email không được để trống");
      setInputError(emailInput, true);
      isValid = false;
    } else {
      hideError(emailError);
      setInputError(emailInput, false);
    }

    if (passwordValue === "") {
      showError(passwordError, "Mật khẩu không được để trống");
      setInputError(passwordInput, true);
      isValid = false;
    } else {
      hideError(passwordError);
      setInputError(passwordInput, false);
    }

    return isValid;
  }

  // ===== LOGIN =====
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    hideError(loginError);

    if (!validateForm()) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // ===== CHECK ADMIN =====
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("currentUser", JSON.stringify({
        name: "Admin",
        email: ADMIN_EMAIL,
        role: "admin"
      }));

      // chuyển sang trang admin
      window.location.href = "../admin/custom.html";
      return;
    }

    // ===== CHECK USER =====
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.length === 0) {
      showError(loginError, "Chưa có tài khoản");
      return;
    }

    const foundUser = users.find(
      user => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify({
        ...foundUser,
        role: "user"
      }));

      window.location.href = "../home/homepage.html";
    } else {
      showError(loginError, "Sai email hoặc mật khẩu");
    }
  });

  // ===== REALTIME INPUT =====
  emailInput.addEventListener("input", () => {
    hideError(emailError);
    setInputError(emailInput, false);
  });

  passwordInput.addEventListener("input", () => {
    hideError(passwordError);
    setInputError(passwordInput, false);
  });
});