let articles = JSON.parse(localStorage.getItem('articles')) || [];
let currentPage = 1;
const rowsPerPage = 5;
let articleIdToDelete = null;
let addImageBase64 = ""; // Biến tạm lưu ảnh khi thêm mới

// --- 1. TIỆN ÍCH ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 15px 25px; background: ${type === 'success' ? '#28a745' : '#dc3545'}; color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 11000; font-weight: bold; transition: all 0.5s ease;`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// Hàm đổ chủ đề từ Entries vào các ô Select
function loadCategoriesToSelects() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const selects = [document.getElementById('addPostCategory'), document.getElementById('editCategory')];
    
    selects.forEach(select => {
        if (select) {
            select.innerHTML = categories.length > 0 
                ? categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')
                : '<option value="General">General</option>';
        }
    });
}

// --- 2. LOGIC HIỂN THỊ ---
function renderArticles() {
    const postList = document.getElementById('postList');
    if (!postList) return;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedItems = articles.slice(startIndex, startIndex + rowsPerPage);

    postList.innerHTML = '';
    paginatedItems.forEach(item => {
        const row = document.createElement('div');
        row.className = 'post-row';
        row.innerHTML = `
            <img src="${item.img || '../image/Group.png'}" class="thumb" />
            <div><b>${item.title}</b></div>
            <div>${item.category}</div>
            <div title="${item.content}">${item.content.substring(0, 30)}...</div>
            <div><span class="status ${item.status.toLowerCase()}">${item.status}</span></div>
            <div class="status-select">
                <select onchange="updateStatus(${item.id}, this.value)">
                    <option value="public" ${item.status === 'public' ? 'selected' : ''}>Public</option>
                    <option value="private" ${item.status === 'private' ? 'selected' : ''}>Private</option>
                </select>
            </div>
            <div class="actions">
                <button class="edit" onclick="openEditModal(${item.id})">Sửa</button>
                <button class="delete" onclick="openDeleteConfirm(${item.id})">Xóa</button>
            </div>
        `;
        postList.appendChild(row);
    });
    renderPagination();
}

// --- 3. LOGIC THÊM MỚI (MODAL) ---
window.openAddModal = () => {
    loadCategoriesToSelects();
    document.getElementById('addModal').style.display = 'flex';
};

window.closeAddModal = () => {
    document.getElementById('addModal').style.display = 'none';
    // Reset Form
    document.getElementById('addPostTitle').value = "";
    document.getElementById('addPostContent').value = "";
    document.getElementById('addPreviewImg').src = "../image/Group.png";
    addImageBase64 = "";
};

// --- 4. LOGIC SỬA ---
window.openEditModal = (id) => {
    loadCategoriesToSelects();
    const article = articles.find(a => a.id === id);
    if (article) {
        document.getElementById('editId').value = article.id;
        document.getElementById('editTitle').value = article.title;
        document.getElementById('editCategory').value = article.category;
        document.getElementById('editContent').value = article.content;
        document.getElementById('editModal').style.display = 'flex';
    }
};

window.closeEditModal = () => {
    document.getElementById('editModal').style.display = 'none';
};

window.saveEdit = () => {
    const id = parseInt(document.getElementById('editId').value);
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
        articles[index].title = document.getElementById('editTitle').value;
        articles[index].category = document.getElementById('editCategory').value;
        articles[index].content = document.getElementById('editContent').value;
        localStorage.setItem('articles', JSON.stringify(articles));
        closeEditModal();
        showToast("Cập nhật thành công!");
        renderArticles();
    }
};

// --- 5. LOGIC XÓA ---
window.openDeleteConfirm = (id) => {
    articleIdToDelete = id;
    document.getElementById('deleteModal').style.display = 'flex';
};

window.closeDeleteModal = () => {
    document.getElementById('deleteModal').style.display = 'none';
};

// --- 6. KHỞI TẠO VÀ SỰ KIỆN ---
document.addEventListener('DOMContentLoaded', () => {
    // Mở modal thêm
    const openAddBtn = document.getElementById('openAddBtn');
    if (openAddBtn) openAddBtn.onclick = openAddModal;

    // Xử lý chọn ảnh khi thêm
    const addFileInput = document.getElementById('addFileInput');
    if (addFileInput) {
        addFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    addImageBase64 = event.target.result;
                    document.getElementById('addPreviewImg').src = addImageBase64;
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Nút lưu bài viết mới
    const saveNewBtn = document.getElementById('saveNewBtn');
    if (saveNewBtn) {
        saveNewBtn.onclick = () => {
            const title = document.getElementById('addPostTitle').value.trim();
            const content = document.getElementById('addPostContent').value.trim();
            const category = document.getElementById('addPostCategory').value;
            const mood = document.getElementById('addPostMood').value;
            const status = document.querySelector('input[name="addStatus"]:checked').value;

            if (!title || !content) {
                showToast("Vui lòng điền đủ thông tin!", "error");
                return;
            }

            const newArticle = {
                id: Date.now(),
                title, category, mood, content, status,
                img: addImageBase64 || "../image/Group.png"
            };

            articles.unshift(newArticle);
            localStorage.setItem('articles', JSON.stringify(articles));
            showToast("Đã đăng bài viết mới!");
            closeAddModal();
            renderArticles();
        };
    }

    // Nút xác nhận xóa
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.onclick = () => {
            articles = articles.filter(a => a.id !== articleIdToDelete);
            localStorage.setItem('articles', JSON.stringify(articles));
            closeDeleteModal();
            renderArticles();
            showToast("Đã xóa bài viết!");
        };
    }

    renderArticles();
});

// Phân trang
function renderPagination() {
    const totalPages = Math.ceil(articles.length / rowsPerPage);
    const container = document.getElementById('paginationNumbers');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const span = document.createElement('span');
        span.innerText = i;
        span.className = i === currentPage ? 'active' : '';
        span.onclick = () => { currentPage = i; renderArticles(); };
        container.appendChild(span);
    }
}

// Cập nhật trạng thái nhanh
window.updateStatus = (id, newStatus) => {
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
        articles[index].status = newStatus;
        localStorage.setItem('articles', JSON.stringify(articles));
        showToast("Đã đổi trạng thái!");
        renderArticles();
    }
};
// Xử lý xem trước ảnh trong Pop-up
const addFileInput = document.getElementById('addFileInput');
const addPreviewImg = document.getElementById('addPreviewImg');
const uploadIcon = document.getElementById('uploadIcon');
const uploadText = document.getElementById('uploadText');

if (addFileInput) {
    addFileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                addPreviewImg.src = event.target.result;
                addPreviewImg.style.display = 'block';
                uploadIcon.style.display = 'none';
                uploadText.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
    // Reset form...
}