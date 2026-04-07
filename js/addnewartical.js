document.addEventListener('DOMContentLoaded', () => {
    const btnAdd = document.querySelector('.btn-add');
    const categorySelect = document.getElementById('postCategory');
    const fileInput = document.getElementById('fileInput');
    const previewImg = document.getElementById('previewImg');

    // --- MỚI: Đổ dữ liệu Category từ Entries vào Select Box ---
    function initCategories() {
        if (!categorySelect) return;
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        
        if (categories.length > 0) {
            categorySelect.innerHTML = categories.map(cat => 
                `<option value="${cat.name}">${cat.name}</option>`
            ).join('');
        }
    }
    initCategories();

    let selectedImgBase64 = "";

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 15px 25px; background: ${type === 'success' ? '#28a745' : '#dc3545'}; color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; font-weight: bold; transition: all 0.5s ease;`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 2500);
    }

    if (fileInput) {
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    selectedImgBase64 = event.target.result;
                    previewImg.src = selectedImgBase64;
                };
                reader.readAsDataURL(file);
            }
        };
    }

    if (btnAdd) {
        btnAdd.onclick = () => {
            const title = document.getElementById('postTitle').value.trim();
            const content = document.getElementById('postContent').value.trim();
            const category = document.getElementById('postCategory').value;
            const mood = document.getElementById('postMood').value;
            const status = document.querySelector('input[name="status"]:checked')?.value || 'public';

            if (!title || !content) {
                showToast("Vui lòng nhập đầy đủ tiêu đề và nội dung!", "error");
                return;
            }

            const newArticle = {
                id: Date.now(),
                title, category, mood, content, status,
                img: selectedImgBase64 || "../image/Group.png"
            };

            const articles = JSON.parse(localStorage.getItem('articles')) || [];
            articles.unshift(newArticle);
            
            try {
                localStorage.setItem('articles', JSON.stringify(articles));
                showToast("Thêm bài viết thành công!");
                setTimeout(() => {
                    window.location.href = './admin_artical.html';
                }, 1200);
            } catch (e) {
                showToast("Lỗi lưu trữ (có thể ảnh quá lớn)!", "error");
            }
        };
    }
}); 