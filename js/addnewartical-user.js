document.addEventListener('DOMContentLoaded', () => {
    const btnAdd = document.querySelector('.btn-add');
    const fileInput = document.getElementById('fileInput');
    const previewImg = document.getElementById('previewImg');
    
    // Lấy thông tin người dùng đang đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Chặn nếu chưa đăng nhập
    if (!currentUser) {
        alert("Vui lòng đăng nhập để đăng bài!");
        window.location.href = "login.html";
        return;
    }

    let base64Image = "../image/homepageimg1.jpg"; // Ảnh mặc định

    // Xử lý chọn ảnh và chuyển sang Base64
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                base64Image = event.target.result;
                previewImg.src = base64Image;
            };
            reader.readAsDataURL(file);
        }
    };

    // Sự kiện Click nút Add
    btnAdd.onclick = () => {
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const category = document.getElementById('postCategory').value;
        const mood = document.getElementById('postMood').value;
        const status = document.querySelector('input[name="status"]:checked').value;

        // --- VALIDATION ---
        if (!title) {
            alert("Tiêu đề không được để trống!");
            return;
        }
        if (!content) {
            alert("Nội dung bài viết không được để trống!");
            return;
        }

        // Tạo đối tượng bài viết mới có UserId
        const newPost = {
            id: Date.now(),
            userId: currentUser.id || currentUser.email, // Gắn ID tài khoản để phân biệt
            author: currentUser.username,
            title: title,
            content: content,
            category: category,
            mood: mood,
            status: status,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            img: base64Image
        };

        // Lưu vào LocalStorage (Mảng chung của toàn hệ thống)
        const allPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        allPosts.unshift(newPost);
        localStorage.setItem('user_posts', JSON.stringify(allPosts));

        alert("Đã thêm bài viết thành công!");
        window.location.href = "mypost.html";
    };
});