    document.addEventListener('DOMContentLoaded', () => {
        // --- KIỂM TRA QUYỀN TRUY CẬP (BẢO MẬT) ---
        // Nếu không có currentUser trong LocalStorage, đá ngay ra trang Login
        if (!localStorage.getItem('currentUser')) {
            window.location.replace("../html/login.html");
            return;
        }

        // --- DOM ELEMENTS ---
        const categoryInput = document.querySelector('.input-category');
        const addBtn = document.querySelector('.btn-add');
        const categoryTable = document.querySelector('.category-table');
        const searchInput = document.querySelector('.search input');
        const formGroup = document.querySelector('.form-group');
        const avatarContainer = document.querySelector('.avt');

        // --- KHỞI TẠO UI BỔ SUNG ---
        // 1. Tạo dòng thông báo lỗi trùng tên
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'color: #f87171; font-size: 13px; margin-top: 5px; display: none; font-weight: 500;';
        errorMsg.innerText = 'Tên chủ đề đã tồn tại!';
        formGroup.appendChild(errorMsg);

        // 2. Tạo nút Cancel (Hủy) - Mặc định ẩn
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancel Edit';
        cancelBtn.style.cssText = 'display: none; margin-top: 8px; background: #6c757d; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600; width: 100%;';
        formGroup.appendChild(cancelBtn);

        // 3. Dropdown Menu cho Avatar
        const avatarDropdown = document.createElement('div');
        avatarDropdown.id = 'avatar-dropdown';
        avatarDropdown.className = 'avatar-dropdown';
        avatarDropdown.innerHTML = `
            <a href="#"><i class="fa-solid fa-user-pen"></i> Chỉnh sửa hồ sơ</a>
            <a href="#" id="logout-link" style="color: #d92d20;"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
        `;
        avatarContainer.appendChild(avatarDropdown);

        // --- BIẾN TRẠNG THÁI ---
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        let editId = null;

        // Hiển thị dữ liệu ban đầu
        renderCategories(categories);

        // =========================================
        // 1. QUẢN LÝ DỮ LIỆU (CRUD)
        // =========================================

        function saveData() {
            localStorage.setItem('categories', JSON.stringify(categories));
        }

        function renderCategories(data) {
            let tbody = categoryTable.querySelector('tbody');
            if (!tbody) {
                tbody = document.createElement('tbody');
                categoryTable.appendChild(tbody);
            }
            tbody.innerHTML = "";

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="3" style="padding: 20px; color: #667085; text-align:center;">Chưa có chủ đề nào.</td></tr>`;
                return;
            }
            data.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="col-id">${index + 1}</td>
                    <td class="col-name" style="font-weight: 500;">${item.name}</td>
                    <td>
                        <button class="btn-edit" onclick="prepareEdit(${item.id})">Sửa</button>
                        <button class="btn-delete" onclick="deleteCategory(${item.id})">Xóa</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Nút Xử lý chính (Thêm hoặc Cập nhật)
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = categoryInput.value.trim();

            if (!name) return;

            if (editId !== null) {
                // Chế độ CẬP NHẬT
                const isDuplicate = categories.some(cat =>
                    cat.name.toLowerCase() === name.toLowerCase() && cat.id !== editId
                );

                if (isDuplicate) {
                    showError();
                    return;
                }

                const category = categories.find(cat => cat.id === editId);
                category.name = name;
                resetForm();
            } else {
                // Chế độ THÊM MỚI
                const isExist = categories.some(cat => cat.name.toLowerCase() === name.toLowerCase());
                if (isExist) {
                    showError();
                    return;
                }
                categories.push({ id: Date.now(), name: name });
                categoryInput.value = '';
            }

            saveData();
            renderCategories(categories);
        });

        // Hàm đưa dữ liệu lên ô input để sửa
        window.prepareEdit = function (id) {
            const category = categories.find(cat => cat.id === id);
            editId = id;
            hideError();

            categoryInput.value = category.name;
            categoryInput.focus();

            // Thay đổi giao diện nút bấm
            addBtn.innerText = "Update Category";
            addBtn.style.backgroundColor = "#ffc107";
            addBtn.style.color = "#000";
            cancelBtn.style.display = 'block';
        };

        // Hàm xóa
        window.deleteCategory = function (id) {
            if (confirm("Bạn có chắc muốn xóa chủ đề này?")) {
                if (editId === id) resetForm();
                categories = categories.filter(cat => cat.id !== id);
                saveData();
                renderCategories(categories);
            }
        };

        // Nút Hủy sửa
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm();
        });

        function resetForm() {
            editId = null;
            categoryInput.value = '';
            addBtn.innerText = "Add Category";
            addBtn.style.backgroundColor = "#28a745";
            addBtn.style.color = "#fff";
            cancelBtn.style.display = 'none';
            hideError();
        }

        // =========================================
        // 2. TÌM KIẾM & CẢNH BÁO
        // =========================================
        function showError() {
            errorMsg.style.display = 'block';
            categoryInput.style.borderColor = '#f87171';
        }

        function hideError() {
            errorMsg.style.display = 'none';
            categoryInput.style.borderColor = '#D0D5DD';
        }

        categoryInput.addEventListener('input', hideError);

        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = categories.filter(cat =>
                cat.name.toLowerCase().includes(keyword)
            );
            renderCategories(filtered);
        });

        // =========================================
        // 3. AVATAR & LOGOUT (BẢN SỬA LỖI)
        // =========================================

        // Đóng mở dropdown avatar
        avatarContainer.addEventListener('click', (e) => {
            // Ngăn chặn sự kiện lan ra ngoài làm đóng menu ngay lập tức
            e.stopPropagation();
            avatarDropdown.classList.toggle('active');
        });

        // Click bất kỳ đâu ngoài menu thì đóng menu
        window.addEventListener('click', () => {
            if (avatarDropdown.classList.contains('active')) {
                avatarDropdown.classList.remove('active');
            }
        });

        // XỬ LÝ ĐĂNG XUẤT (Dùng Event Delegation để tránh lỗi không nhận ID)
        document.addEventListener('click', (e) => {
            // Kiểm tra xem phần tử bị click hoặc cha của nó có phải là nút logout không
            const logoutTarget = e.target.closest('#logout-link');

            if (logoutTarget) {
                e.preventDefault();

                // 1. Xóa sạch dấu vết đăng nhập
                localStorage.removeItem('currentUser');

                // 2. Thông báo nhỏ (Tùy chọn)
                console.log("Đang đăng xuất...");

                // 3. Dùng replace để ghi đè lịch sử trình duyệt (Chống Back)
                window.location.replace("../html/login.html");
            }
        });
    });