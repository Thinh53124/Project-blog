document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const avatarBtn = document.getElementById('avatarBtn');
    const dropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    // 1. Kiểm tra đăng nhập
    if (!currentUser) {
        // Nếu chưa đăng nhập, đá về trang login
        window.location.href = './login.html';
        return;
    }

    // 2. Hiển thị thông tin user lên Dropdown
    document.getElementById('userName').innerText = currentUser.username || "User";
    document.getElementById('userEmail').innerText = currentUser.email;
    if(currentUser.avatar) {
        avatarBtn.src = currentUser.avatar;
        document.getElementById('dropdownAvt').src = currentUser.avatar;
    }

    // 3. Bật/Tắt Dropdown khi click vào Avatar
    avatarBtn.onmouseover = (e) => {
        e.stopPropagation(); // Ngăn sự kiện nổi bọt
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    };

    // Click ra ngoài thì ẩn dropdown
    window.onclick = () => {
        dropdown.style.display = 'none';
    };

    // 4. CHỨC NĂNG ĐĂNG XUẤT
    logoutBtn.onclick = (e) => {
        e.preventDefault();
        // Xóa thông tin user đang đăng nhập
        localStorage.removeItem('currentUser');
        // Chuyển về trang login
        window.location.href = './login.html';
    };
});