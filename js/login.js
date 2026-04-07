// --- DOM Elements ---
const emailInput = document.querySelector('.email input');
const passwordInput = document.querySelector('.pass input');
const loginBtn = document.querySelector('section button');

// --- Tài khoản Admin cố định ---
const ADMIN_ACCOUNT = {
    email: "kiviYT2007@gmail.com",
    password: "bach22082007"
};
/**
 * Hiển thị lỗi ngay dưới ô input
 */
function showInputError(input, message) {
    clearInputError(input);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.cssText = 'color: #e74c3c; font-size: 12px; margin-top: 5px; font-weight: 500;';
    errorElement.textContent = message;
    input.style.borderColor = '#e74c3c';
    input.after(errorElement);
}
/**
 * Xóa lỗi
 */
function clearInputError(input) {
    const parent = input.parentElement;
    const existingError = parent.querySelector('.error-message');
    if (existingError) existingError.remove();
    input.style.borderColor = '';
}

/**
 * Xử lý Đăng nhập
 */
function handleLogin() {
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    let hasError = false;

    clearInputError(emailInput);
    clearInputError(passwordInput);

    if (!emailValue) {
        showInputError(emailInput, 'Vui lòng nhập Email');
        hasError = true;
    }
    if (!passwordValue) {
        showInputError(passwordInput, 'Vui lòng nhập mật khẩu');
        hasError = true;
    }

    if (hasError) return;

    // 1. Kiểm tra nếu là tài khoản ADMIN
    if (emailValue === ADMIN_ACCOUNT.email) {
        if (passwordValue === ADMIN_ACCOUNT.password) {
            // Đăng nhập Admin thành công
            localStorage.setItem('currentUser', JSON.stringify({ role: 'admin', email: emailValue }));
            
            loginBtn.innerText = 'Đang chuyển hướng Admin...';
            loginBtn.style.backgroundColor = '#6172F3';

            setTimeout(() => {
                window.location.href = '../html/admin_customer.html';
            }, 800);
            return;
        } else {
            showInputError(passwordInput, 'Mật khẩu Admin không chính xác');
            return;
        }
    }

    // 2. Nếu không phải Admin, kiểm tra trong LocalStorage (Người dùng thường)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === emailValue);

    if (!user) {
        showInputError(emailInput, 'Tài khoản không tồn tại');
        return;
    }

    if (user.password !== passwordValue) {
        showInputError(passwordInput, 'Mật khẩu không chính xác');
        return;
    }

    // Đăng nhập người dùng thường thành công
    localStorage.setItem('currentUser', JSON.stringify({
        role: 'user',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }));

    loginBtn.innerText = 'Đang đăng nhập...';
    loginBtn.style.backgroundColor = '#2ecc71';

    setTimeout(() => {
        window.location.href = '../html/homepage.html';
    }, 1000);
}

// --- Event Listeners ---
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleLogin();
});

emailInput.addEventListener('input', () => clearInputError(emailInput));
passwordInput.addEventListener('input', () => clearInputError(passwordInput));

// Hỗ trợ nhấn Enter
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
});
document.querySelector('section button').onclick = function() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value.trim();

    // Lấy danh sách users đã đăng ký từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Tìm kiếm user khớp email và password
    const user = users.find(u => u.email === email && u.password === pass);

    if (user) {
        // Lưu thông tin user hiện tại đang đăng nhập
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Chuyển hướng sang homepage
        window.location.href = './homepage.html';
    } else {
        // Sử dụng hàm Toast đã viết ở các phần trước thay cho alert
        alert("Email hoặc mật khẩu không chính xác!");
    }
};