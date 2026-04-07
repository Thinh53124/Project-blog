
const form = document.querySelector('.register form');
const firstNameInput = document.querySelector('.firstname input');
const lastNameInput = document.querySelector('.lastname input');
const emailInput = document.querySelector('input[type="email"]');
const allInputs = Array.from(document.querySelectorAll('input'));
const passwordInput = allInputs[3]; 
const confirmPasswordInput = allInputs[4]; 

// --- Thiết lập thuộc tính ---
firstNameInput.name = 'firstName';
lastNameInput.name = 'lastName';
emailInput.name = 'email';
passwordInput.name = 'password';
confirmPasswordInput.name = 'confirmPassword';

// --- Các hàm kiểm tra (Validation) ---
function validateName(value, label) {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/; //chữ cái và khoảng trắng
    if (!value.trim()) return `Vui lòng nhập ${label}`;
    if (value.trim().length < 2) return `${label} phải có ít nhất 2 ký tự`;
    if (!nameRegex.test(value.trim())) return `${label} không được chứa ký tự đặc biệt hoặc số`;
    return '';
}

function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) return 'Email không được để trống';
    if (!emailRegex.test(value.trim())) return 'Email không hợp lệ';
    return '';
}

function validatePassword(value) {
    if (!value.trim()) return 'Mật khẩu không được để trống';
    if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    return '';
}

// --- Hiển thị lỗi ---
function showError(input, message) {
    clearError(input);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-msg';
    errorElement.style.cssText = 'color: #e74c3c; font-size: 12px; margin-top: 4px;';
    errorElement.setAttribute('data-error-for', input.name);
    errorElement.textContent = message;
    input.style.borderColor = '#e74c3c';
    input.after(errorElement);
}

function clearError(input) {
    const existingError = input.parentElement.querySelector(`[data-error-for="${input.name}"]`);
    if (existingError) existingError.remove();
    input.style.borderColor = '';
}

// validate khi blur 
function validateField(input) {
    let error = '';
    switch(input.name) {
        case 'firstName': error = validateName(input.value, 'Họ'); break;
        case 'lastName': error = validateName(input.value, 'Tên'); break;
        case 'email': error = validateEmail(input.value); break;
        case 'password': error = validatePassword(input.value); break;
        case 'confirmPassword': 
            if (input.value !== passwordInput.value) error = 'Mật khẩu không khớp';
            break;
    }
    if (error) showError(input, error);
}

[firstNameInput, lastNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
});

// Đăng ký 
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate lại tất cả trước khi submit
    [firstNameInput, lastNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => validateField(input));
    
    if (document.querySelector('.error-msg')) return; 

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kiểm tra trùng Email
    if (users.find(u => u.email === emailInput.value.trim())) {
        showError(emailInput, 'Email này đã được sử dụng');
        return;
    }

    // TẠO USER MỚI KHỚP VỚI TRANG ADMIN
    const newUser = {
        id: Date.now(),
        name: `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`,
        username: `@${lastNameInput.value.trim().toLowerCase()}${Math.floor(Math.random() * 100)}`,
        email: emailInput.value.trim(),
        password: passwordInput.value,
        status: "hoạt động",
        avatar: "../image/avt-user.jpg" 
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('lastEmail', newUser.email);
    
    const submitBtn = form.querySelector('button');
    submitBtn.innerText = 'Đăng ký thành công!';
    submitBtn.style.backgroundColor = '#2ecc71';
    
    setTimeout(() => { window.location.href = './login.html'; }, 1200);
});