document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    let firstName = document.querySelectorAll(".name")[0].value.trim();
    let lastName = document.querySelectorAll(".name")[1].value.trim();
    let email = document.querySelector('input[type="email"]').value.trim();
    let password = document.querySelectorAll('input[type="password"]')[0].value;
    let confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;

    clearAllErrors();

    let hasError = false;

    // validate tên
    if (firstName === "") {
        showError(0, "Họ không được để trống");
        hasError = true;
    } else if (firstName.length < 2) {
        showError(0, "Họ phải dài hơn 2 ký tự");
        hasError = true;
    }

    if (lastName === "") {
        showError(1, "Tên không được để trống");
        hasError = true;
    } else if (lastName.length < 1) {
        showError(1, "Tên phải dài hơn 1 ký tự");
        hasError = true;
    }

    // validate email
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        showError("email", "Email không được để trống");
        hasError = true;
    } else if (!emailRegex.test(email)) {
        showError("email", "Email không đúng định dạng");
        hasError = true;
    }

    // validate password
    if (password === "") {
        showError("password", "Mật khẩu không được để trống");
        hasError = true;
    } else if (password.length < 6) {
        showError("password", "Mật khẩu tối thiểu 6 ký tự");
        hasError = true;
    }

    // validate confirm password
    if (confirmPassword === "") {
        showError("confirmPassword", "Mật khẩu xác nhận không được để trống");
        hasError = true;
    } else if (password !== confirmPassword) {
        showError("confirmPassword", "Mật khẩu phải trùng khớp");
        hasError = true;
    }

    if (hasError) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // check email tồn tại
    let isExist = users.some(user => user.email === email);
    if (isExist) {
        showError("email", "Email đã tồn tại");
        return;
    }

    // tạo id tự tăng
    let newId = 1;
    if (users.length > 0) {
        newId = Math.max(...users.map(u => u.id || 0)) + 1;
    }

    let newUser = {
        id: newId,
        name: firstName + " " + lastName,
        username: "@" + firstName.toLowerCase(),
        email: email,
        password: password,
        avatar: "./img/default.png",
        status: "hoạt động"
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showSuccess("Đăng ký thành công! Đang chuyển hướng...");
    setTimeout(() => {
        window.location.href = "../login/login.html";
    }, 1500);
});

function showError(field, message) {
    let input;

    if (field === 0 || field === 1) {
        input = document.querySelectorAll(".name")[field];
    } else if (field === "email") {
        input = document.querySelector('input[type="email"]');
    } else if (field === "password") {
        input = document.querySelectorAll('input[type="password"]')[0];
    } else if (field === "confirmPassword") {
        input = document.querySelectorAll('input[type="password"]')[1];
    }

    input.classList.add("input-error");

    let errorEl = document.createElement("p");
    errorEl.classList.add("error-message");
    errorEl.textContent = message;

    input.parentElement.appendChild(errorEl);
}

function clearAllErrors() {
    document.querySelectorAll(".error-message").forEach(el => el.remove());
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

function showSuccess(message) {
    let successEl = document.createElement("p");
    successEl.classList.add("success-message");
    successEl.textContent = message;

    document.querySelector("form").appendChild(successEl);
}