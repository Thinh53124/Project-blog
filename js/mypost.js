document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authSection = document.getElementById('authSection');
    const postContainer = document.getElementById('postContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const errorMsg = document.getElementById('error-msg');
    const errorText = document.getElementById('error-text');
    
    let tempImgBase64 = "";
    let isEditing = false;

    const moodIcons = {
        "Happy": "😀",
        "Sad": "😢",
        "Productive": "🔥",
        "Tired": "😴"
    };

    function init() {
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        initHeader();
        loadCategoriesData();
        renderPosts();
    }

    function initHeader() {
        if (currentUser) {
            authSection.innerHTML = `
                <div class="user-avatar-container" onclick="toggleDropdown(event)">
                    <img src="${currentUser.avatar || '../image/avt_default.png'}" class="nav-avatar">
                </div>`;
            document.getElementById('dropdownAvatar').src = currentUser.avatar || '../image/avt_default.png';
            document.getElementById('dropdownName').innerText = currentUser.username;
            document.getElementById('dropdownEmail').innerText = currentUser.email;
        }
    }

    function loadCategoriesData() {
        const cats = JSON.parse(localStorage.getItem('categories')) || [{name: 'Daily Journal'}, {name: 'Work & Career'}];
        let filterHtml = '<option value="all">All Categories</option>';
        cats.forEach(c => filterHtml += `<option value="${c.name}">${c.name}</option>`);
        categoryFilter.innerHTML = filterHtml;
        document.getElementById('postCategory').innerHTML = cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }

    // 1. HIỂN THỊ DANH SÁCH BÀI VIẾT NGOÀI TRANG CHỦ MYPOST
    function renderPosts() {
        const allPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        const userId = currentUser.id || currentUser.email;
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCat = categoryFilter.value;

        const filtered = allPosts.filter(p => {
            return p.userId === userId && 
                   p.title.toLowerCase().includes(searchTerm) && 
                   (selectedCat === 'all' || p.category === selectedCat);
        });

        filtered.sort((a, b) => b.id - a.id);
        postContainer.innerHTML = '';

        filtered.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card-mini';
            
            // Click vào bất kỳ đâu trên card để xem chi tiết (trừ nút Edit)
            card.onclick = (e) => {
                if (!e.target.classList.contains('btn-edit-trigger')) {
                    openDetailModal(post.id);
                }
            };

            card.innerHTML = `
                <img src="${post.img || '../image/Group.png'}">
                <div class="card-content">
                    <div class="date">Date: ${post.date} | Mood: ${moodIcons[post.mood] || '😶'}</div>
                    <h4>${post.title}</h4>
                    <p>${post.content.substring(0, 80)}...</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                        <span class="category-tag">${post.category}</span>
                        <button class="btn-edit-trigger" onclick="openEditModal(${post.id})">Edit your post</button>
                    </div>
                </div>
            `;
            postContainer.appendChild(card);
        });
    }

    // 2. XỬ LÝ MODAL CHI TIẾT (CÓ COMMENT FIX CỨNG)
    window.openDetailModal = (id) => {
        const allPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        const post = allPosts.find(p => p.id === id);

        if (post) {
            // Đổ dữ liệu bài viết vào Modal
            document.getElementById('detailTitle').innerText = post.title;
            document.getElementById('detailContent').innerText = post.content;
            
            // Cập nhật Avatar người đăng
            const userAvatar = currentUser.avatar || '../image/avt_default.png';
            document.getElementById('detailAvatar').src = userAvatar;
            
            // Hiển thị Modal
            const modal = document.getElementById('detailModal');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Khóa cuộn trang
        }
    };

    window.closeDetailModal = () => {
        document.getElementById('detailModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // 3. LƯU BÀI VIẾT (ADD / EDIT)
    window.handleSave = () => {
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const category = document.getElementById('postCategory').value;
        const mood = document.getElementById('postMood').value;
        const status = document.querySelector('input[name="postStatus"]:checked').value;

        if (!title || !content) return showError("Fields cannot be empty!");

        let allPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        const userId = currentUser.id || currentUser.email;

        if (isEditing) {
            const id = parseInt(document.getElementById('targetPostId').value);
            allPosts = allPosts.map(p => p.id === id ? {
                ...p, title, content, category, mood, status, img: tempImgBase64 || p.img
            } : p);
        } else {
            allPosts.unshift({
                id: Date.now(), 
                userId, 
                title, 
                content, 
                category, 
                mood, 
                status,
                img: tempImgBase64 || "../image/Group.png",
                date: new Date().toISOString().split('T')[0],
                likes: 15 // Fix cứng số like ban đầu cho đẹp giao diện
            });
        }

        localStorage.setItem('user_posts', JSON.stringify(allPosts));
        closeModal();
        renderPosts();
    };

    // 4. CÁC HÀM ĐIỀU KHIỂN MODAL ADD/EDIT
    window.openAddModal = () => {
        isEditing = false;
        resetModal();
        document.getElementById('modalTitle').innerText = "📝 Add New Article";
        document.getElementById('modalSubmitBtn').innerText = "Add";
        document.getElementById('articleModal').style.display = 'flex';
    };

    window.openEditModal = (id) => {
        isEditing = true;
        const allPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        const post = allPosts.find(p => p.id === id);
        if (post) {
            document.getElementById('targetPostId').value = post.id;
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postContent').value = post.content;
            document.getElementById('postCategory').value = post.category;
            document.getElementById('postMood').value = post.mood || "Happy";
            document.getElementById('previewImg').src = post.img;
            document.getElementById('previewImg').style.display = post.img ? "block" : "none";
            tempImgBase64 = post.img;
            document.getElementById('modalTitle').innerText = "✏️ Edit Your Article";
            document.getElementById('modalSubmitBtn').innerText = "Save";
            document.getElementById('articleModal').style.display = 'flex';
        }
    };

    // 5. CÁC HÀM TIỆN ÍCH
    function resetModal() {
        document.getElementById('postTitle').value = "";
        document.getElementById('postContent').value = "";
        document.getElementById('previewImg').style.display = "none";
        tempImgBase64 = "";
    }

    function showError(message) {
        errorText.innerText = message;
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
    }

    window.logout = () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    };

    window.toggleDropdown = (e) => {
        e.stopPropagation();
        const d = document.getElementById('userDropdown');
        d.style.display = d.style.display === 'block' ? 'none' : 'block';
    };

    window.closeModal = () => {
        document.getElementById('articleModal').style.display = 'none';
    };

    // Xử lý Upload Ảnh
    document.getElementById('fileInput').onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                tempImgBase64 = ev.target.result;
                document.getElementById('previewImg').src = tempImgBase64;
                document.getElementById('previewImg').style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    };

    // Đóng dropdown khi click ra ngoài
    window.onclick = () => {
        document.getElementById('userDropdown').style.display = 'none';
    };

    searchInput.addEventListener('input', renderPosts);
    categoryFilter.addEventListener('change', renderPosts);

    init();
});