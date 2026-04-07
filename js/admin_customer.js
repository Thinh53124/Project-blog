let users = [];

// Hàm vẽ bảng (Render)
function renderTable() {
    const tbody = document.querySelector('table tbody');
    const userCountSpan = document.querySelector('.user-count');
    const searchInput = document.querySelector('.search input');
    
    if (!tbody) return;

    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // LỌC: 
    // 1. Không hiển thị Admin (kiviYT2007@gmail.com)
    // 2. Chỉ hiển thị các tài khoản có ID > 10 (Tài khoản được đăng ký mới)
    const filteredUsers = users.filter(u => {
        const isNotAdmin = u.email !== 'kiviYT2007@gmail.com';
        const isRegisteredUser = u.id > 10; // Lọc bỏ id từ 0-10 của danh sách mặc định
        const matchesSearch = (u.name || '').toLowerCase().includes(searchText) || 
                              (u.email || '').toLowerCase().includes(searchText);
        
        return isNotAdmin && isRegisteredUser && matchesSearch;
    });

    tbody.innerHTML = '';
    
    // Cập nhật số lượng hiển thị (Chỉ tính người dùng đăng ký)
    if (userCountSpan) {
        userCountSpan.textContent = `${filteredUsers.length} users`;
    }

    // Nếu không có ai đăng ký, hiện thông báo trống
    if (filteredUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">Chưa có người dùng mới đăng ký</td></tr>`;
        return;
    }

    filteredUsers.forEach(user => {
        // Chỉ 'bị chặn' mới có class blocked (màu đỏ)
        const statusClass = (user.status === 'bị chặn') ? 'blocked' : 'active';
        
        const row = `
            <tr>
                <td>
                    <div class="user-info">
                        <img src="${user.avatar || '../image/avt-user.jpg'}" alt="avatar" onerror="this.src='../image/avt-user.jpg'">
                        <div class="fullname">
                            <div class="name">${user.name || 'Người dùng'}</div>
                            <div class="username">${user.username || '@user'}</div>
                        </div>
                    </div>
                </td>
                <td><span class="status ${statusClass}">${user.status || 'hoạt động'}</span></td>
                <td class="email">${user.email}</td>
                <td class="actions">
                    <button class="btn-block" 
                            ${user.status === 'bị chặn' ? 'disabled' : ''} 
                            onclick="updateUserStatus(${user.id}, 'bị chặn')">
                        block
                    </button>
                    <button class="btn-unblock" 
                            ${user.status === 'hoạt động' ? 'disabled' : ''} 
                            onclick="updateUserStatus(${user.id}, 'hoạt động')">
                        unblock
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// Hàm cập nhật trạng thái
window.updateUserStatus = function(id, newStatus) {
    users = users.map(u => {
        if (u.id === id) u.status = newStatus;
        return u;
    });
    localStorage.setItem('users', JSON.stringify(users));
    renderTable();
};

document.addEventListener('DOMContentLoaded', () => {
    // Danh sách mặc định (vẫn cần khai báo để hệ thống có dữ liệu gốc nếu cần)
    const defaultUsers = [
        { id: 0, name: "Bach Admin", email: "kiviYT2007@gmail.com", status: "hoạt động", avatar: "../image/avt_admin.png" },
        { id: 1, name: "Olivia Rhye", username: "@olivia", status: "hoạt động", email: "olivia@untitledui.com", avatar: "../image/olivia.png" },
        { id: 2, name: "Phoenix Baker", username: "@phoenix", status: "hoạt động", email: "phoenix@untitledui.com", avatar: "../image/phoenix.png" },
        { id: 3, name: "Lana Steiner", username: "@lana", status: "hoạt động", email: "lana@untitledui.com", avatar: "../image/lana.png" },
        { id: 4, name: "Demi Wilkinson", username: "@demi", status: "hoạt động", email: "demi@untitledui.com", avatar: "../image/demi.png" },
        { id: 5, name: "Candice Wu", username: "@candice", status: "hoạt động", email: "candice@untitledui.com", avatar: "../image/candice.png" },
        { id: 6, name: "Natali Craig", username: "@natali", status: "hoạt động", email: "natali@untitledui.com", avatar: "../image/natali.png" },
        { id: 7, name: "Drew Cano", username: "@drew", status: "hoạt động", email: "drew@untitledui.com", avatar: "../image/drew.png" },
        { id: 8, name: "Orlando Diggs", username: "@orlando", status: "hoạt động", email: "orlando@untitledui.com", avatar: "../image/orlando.png" },
        { id: 9, name: "Andi Lane", username: "@andi", status: "hoạt động", email: "andi@untitledui.com", avatar: "../image/andi.png" },
        { id: 10, name: "Kate Morrison", username: "@kate", status: "hoạt động", email: "kate@untitledui.com", avatar: "../image/kate.png" }
    ];

    // Lấy dữ liệu từ LocalStorage hoặc nạp mặc định
    users = JSON.parse(localStorage.getItem('users')) || defaultUsers;
    
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    const searchInput = document.querySelector('.search input');
    if (searchInput) {
        searchInput.addEventListener('input', renderTable);
    }

    // Dropdown Avatar
    const avtContainer = document.getElementById('avatar-container');
    const dropdown = document.getElementById('avatar-dropdown');
    if (avtContainer) {
        avtContainer.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        };
    }
    window.onclick = () => dropdown && dropdown.classList.remove('active');

    renderTable();
});