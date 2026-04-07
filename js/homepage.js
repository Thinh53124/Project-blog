document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const avatarBtn = document.getElementById('avatarBtn');
    const dropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const topicContainer = document.getElementById('topicContainer');
    const blogContainer = document.getElementById('blogContainer');
    const searchInput = document.getElementById('searchInput');

    if (!currentUser) {
        window.location.href = './login.html';
        return;
    }

    // Hiển thị thông tin Header
    document.getElementById('userName').innerText = currentUser.username || "User";
    document.getElementById('userEmail').innerText = currentUser.email;
    const avtSrc = currentUser.avatar || '../image/avt_default.png';
    avatarBtn.src = avtSrc;
    document.getElementById('dropdownAvt').src = avtSrc;

    // 1. RENDER CHỦ ĐỀ TỪ ADMIN (Thay thế Daily Journal, v.v.)
    function renderTopics() {
        // Lấy từ key 'categories' mà admin đã tạo
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        
        // Render các thẻ <p> vào div .topic để nhận CSS có sẵn
        topicContainer.innerHTML = categories.map(cat => 
            `<p style="cursor:pointer" onclick="filterByTopic('${cat.name}', this)">${cat.name}</p>`
        ).join('');
    }

    // 2. LỌC BÀI VIẾT THEO CHỦ ĐỀ
    window.filterByTopic = (topicName, element) => {
        const allPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        // Lọc bài Public + Trùng Category
        const filtered = allPosts.filter(p => p.status === 'public' && p.category === topicName);

        displayPosts(filtered);

        // Hiệu ứng màu sắc cho topic được chọn
        document.querySelectorAll('.topic p').forEach(p => p.style.color = '#000');
        if(element) element.style.color = '#6155F5'; 
    };

    // 3. HIỂN THỊ BÀI VIẾT THEO LAYOUT CSS CÓ SẴN
    function displayPosts(posts) {
        blogContainer.innerHTML = '';
        const extraContainer = document.getElementById('blogContainerExtra');
        extraContainer.innerHTML = ''; // Clear phần extra

        if (posts.length === 0) {
            blogContainer.innerHTML = '<p style="padding:20px; opacity:0.5">No articles found in this category.</p>';
            return;
        }

        // Chia bài viết vào 2 container .card và .card-two nếu bài viết nhiều (đúng layout CSS)
        posts.forEach((post, index) => {
            const cardHTML = `
                <div class="card-mini">
                    <img src="${post.img || '../image/homepageimg1.jpg'}" class="img-mid">
                    <p class="date">Date: ${post.date}</p>
                    <h4>${post.title}</h4>
                    <p class="des">${post.content.substring(0, 100)}...</p>
                    <p class="daily-journal">${post.category}</p>
                </div>
            `;

            if (index < 3) {
                blogContainer.innerHTML += cardHTML;
            } else {
                extraContainer.innerHTML += cardHTML;
            }
        });
    }

    // 4. HIỂN THỊ TẤT CẢ BÀI VIẾT PUBLIC KHI MỚI VÀO
    window.renderAllPublicPosts = () => {
        const allPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        const publicPosts = allPosts.filter(p => p.status === 'public');
        displayPosts(publicPosts);
        document.querySelectorAll('.topic p').forEach(p => p.style.color = '#000');
    };

    // 5. SEARCH LOGIC
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const allPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        const filtered = allPosts.filter(p => 
            p.status === 'public' && 
            (p.title.toLowerCase().includes(val) || p.content.toLowerCase().includes(val))
        );
        displayPosts(filtered);
    });

    // 6. DROPDOWN & LOGOUT
    avatarBtn.onclick = (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    };
    window.onclick = () => dropdown.style.display = 'none';
    logoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = './login.html';
    };

    // Khởi động
    renderTopics();
    renderAllPublicPosts();
});