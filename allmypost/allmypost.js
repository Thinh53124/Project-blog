// GET DATA
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let editingPostId = null;

const listHTML = document.getElementById("tbody");
const filterSelect = document.getElementById("filter-category");
const searchInput = document.getElementById("search-input");

// HELPER
function getCategoryName(id) {
  const c = categories.find((x) => x.id === id);
  return c ? c.name : "Không xác định";
}

// ERROR UI
function showErrorTitle(error, display) {
  const el = document.querySelector(".error-title");
  el.style.display = display;
  el.textContent = error;
}

function showErrorStatus(error, display) {
  const el = document.querySelector(".error-status");
  el.style.display = display;
  el.textContent = error;
}

// FORM MODE
function setFormMode(isEdit) {
  const titleEl = document.querySelector(".form-header h1");
  const submitBtn = document.querySelector(".form button");

  if (isEdit) {
    titleEl.textContent = "Edit Article";
    submitBtn.textContent = "Update";
  } else {
    titleEl.textContent = "Add New Article";
    submitBtn.textContent = "Add";
  }
}

// RENDER POSTS
function renderPost() {
  const keyword = searchInput?.value.toLowerCase() || "";
  const categoryId = filterSelect?.value || "";

  let filteredPosts = [...posts];

  if (categoryId) {
    filteredPosts = filteredPosts.filter(
      (p) => p.categoryId === Number(categoryId),
    );
  }

  if (keyword) {
    filteredPosts = filteredPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.content.toLowerCase().includes(keyword),
    );
  }

  listHTML.innerHTML = filteredPosts
    .map((val) => {
      return `
      <div class="post-card">
        <img src="${val.file}" alt="">
        <p class="date">Date: ${val.date}</p>
        <h3>${val.title}</h3>
        <p class="desc">${val.content}</p>
        <div class="post-footer">
          <span class="tag">${getCategoryName(val.categoryId)}</span>
          <a href="#" onclick="editPost(${val.id})">Edit your post</a>
        </div>
      </div>`;
    })
    .join("");
}

// RENDER CATEGORY
function renderCategories() {
  const list = document.getElementById("category-input");
  if (!list) return;

  list.innerHTML = categories
    .map((val) => `<option value="${val.id}">${val.name}</option>`)
    .join("");
}

function renderFilterCategories() {
  if (!filterSelect) return;

  filterSelect.innerHTML =
    `<option value="">All</option>` +
    categories
      .map((c) => {
        return `<option value="${c.id}">${c.name}</option>`;
      })
      .join("");
}

renderCategories();
renderFilterCategories();
renderPost();

// EVENTS
if (filterSelect) {
  filterSelect.addEventListener("change", renderPost);
}

if (searchInput) {
  searchInput.addEventListener("input", renderPost);
}

// MODAL ADD OR EDIT
const modal = document.getElementById("modal");

document.querySelector(".add-new-article").onclick = () => {
  if (!currentUser) {
    window.location.href = "../login/login.html";
  } else {
    modal.style.display = "block";
    editingPostId = null;
    document.querySelector(".form").reset();
    setFormMode(false);
  }
};

// EDIT POST
function editPost(id) {
  const post = posts.find((p) => p.id === id);
  if (!post) return;

  editingPostId = id;

  modal.style.display = "block";
  setFormMode(true);

  document.getElementById("title-input").value = post.title;
  document.getElementById("category-input").value = post.categoryId;
  document.getElementById("mood-input").value = post.mood;
  document.getElementById("textarea-input").value = post.content;

  document.querySelectorAll('input[name="status"]').forEach((radio) => {
    radio.checked = radio.value === post.status;
  });
}

// ADD OR UPDATE
function addArticle(e) {
  e.preventDefault();

  const title = document.getElementById("title-input").value.trim();
  const categoryId = Number(document.getElementById("category-input").value);
  const mood = document.getElementById("mood-input").value;
  const content = document.getElementById("textarea-input").value.trim();
  const fileInput = document.getElementById("file-input");
  const selected = document.querySelector('input[name="status"]:checked');

  function customAlert(message, callback) {
    const overlay = document.createElement("div");
    overlay.className = "popup";

    const box = document.createElement("div");
    box.className = "popup-box";
    box.innerHTML = `
      <h3>${message}</h3>
      <button>OK</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    box.querySelector("button").onclick = () => {
      overlay.remove();
      if (callback) callback();
    };
  }

  let isValid = true;

  if (!title) {
    showErrorTitle("Title can't be empty", "block");
    isValid = false;
  } else showErrorTitle("", "none");

  if (!categoryId) {
    customAlert("Please select category");
    isValid = false;
  }

  if (!content) {
    customAlert("Content can't be empty");
    isValid = false;
  }

  if (!selected) {
    showErrorStatus("Choose status", "block");
    isValid = false;
  } else showErrorStatus("", "none");

  if (!isValid) return;

  if (!currentUser) {
    customAlert("Login first", () => {
      window.location.href = "../login/login.html";
    });
    return;
  }

  if (
    posts.find(
      (p) =>
        p.title.toLowerCase() === title.toLowerCase() && p.id !== editingPostId,
    )
  ) {
    showErrorTitle("Title existed", "block");
    return;
  }

  let img = "../img/default.jpg";
  const file = fileInput.files[0];
  const now = new Date();
  const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  function savePost() {
    if (editingPostId) {
      const index = posts.findIndex((p) => p.id === editingPostId);

      posts[index] = {
        ...posts[index],
        title,
        categoryId,
        mood,
        content,
        status: selected.value,
        file: file ? img : posts[index].file,
      };

      editingPostId = null;

      customAlert("Update success", () => {
        window.location.reload();
      });
    } else {
      const newId =
        posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

      const post = {
        id: newId,
        title,
        categoryId,
        mood,
        content,
        status: selected.value,
        file: img,
        date,
        userEmail: currentUser.email,
        likes: Math.floor(Math.random() * 50) + 1,
      };
      posts.push(post);

      customAlert("Add success", () => {
        window.location.reload();
      });
    }

    localStorage.setItem("posts", JSON.stringify(posts));
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      img = reader.result;
      savePost();
    };
    reader.readAsDataURL(file);
  } else {
    savePost();
  }
}

// USER UI
function renderUserUI() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const authBox = document.getElementById("auth-box");
  const avatar = document.getElementById("avatar");

  if (user) {
    authBox.style.display = "none";
    avatar.style.display = "block";
    document.getElementById("user-name").textContent = user.name;
    document.getElementById("user-email").textContent = user.email;

    if (user.avatar) {
      document.querySelectorAll(".avatar, .avatar-small").forEach((img) => {
        img.src = user.avatar;
      });
    }
  } else {
    authBox.style.display = "flex";
    avatar.style.display = "none";
  }
}
renderUserUI();

//  DETAILS POPUP
const detailsModal = document.createElement("div");
detailsModal.className = "modal";
detailsModal.style.display = "none";
detailsModal.innerHTML = `
  <div class="modal-content" id="details-content" style="
       width: 800px; 
       background: #F7F8F9; 
       border-radius: 12px; 
       padding: 20px; 
       position: relative;">
    <span id="details-close" style="
       position: absolute; 
       top: 12px; 
       right: 12px; 
       cursor: pointer; 
       font-weight: bold;">X</span>
    <div class="details-post" style="display:flex; gap: 16px; align-items:flex-start;">
      <img src='' class="details-avatar" style="width:40px;height:40px;border-radius:50%;">
      <div class="details-body">
        <h2 class="details-title"></h2>
        <p class="details-content" style="line-height:1.5; color:#101828;"></p>
        <div class="details-actions" style="margin-top:10px; font-size:13px; color:#555;"></div>
      </div>
    </div>
  </div>
`;
document.body.appendChild(detailsModal);

// Open details popup
function openDetails(postId) {
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const author = users.find((u) => u.email === post.userEmail) || currentUser;

  const avatarEl = detailsModal.querySelector(".details-avatar");
  avatarEl.src = author?.avatar || "../img/default.jpg";

  detailsModal.querySelector(".details-title").textContent = post.title;
  detailsModal.querySelector(".details-content").textContent = post.content;

  // Hiển thị số like từ post, replies mặc định 0
  detailsModal.querySelector(".details-actions").innerHTML = `
    <span>${post.likes} Like</span> · 
    <span>0 Replies</span>
  `;

  detailsModal.style.display = "flex";
  detailsModal.style.justifyContent = "center";
  detailsModal.style.alignItems = "center";
  detailsModal.style.position = "fixed";
  detailsModal.style.top = 0;
  detailsModal.style.left = 0;
  detailsModal.style.width = "100%";
  detailsModal.style.height = "100%";
  detailsModal.style.background = "rgba(0,0,0,0.3)";
  detailsModal.style.zIndex = 100;
}

// Close details modal
detailsModal.querySelector("#details-close").onclick = () => {
  detailsModal.style.display = "none";
};

window.addEventListener("click", (e) => {
  if (e.target === detailsModal) {
    detailsModal.style.display = "none";
  }
});
function attachPostClick() {
  document.querySelectorAll(".post-card").forEach((card) => {
    card.onclick = (e) => {
      if (e.target.tagName.toLowerCase() === "a") return;
      const title = card.querySelector("h3").textContent;
      const post = posts.find((p) => p.title === title);
      if (post) openDetails(post.id);
    };
  });
}

renderPost();
attachPostClick();

// USER POPUP
const avatar = document.getElementById("avatar");
const popup = document.getElementById("user-popup");

if (avatar) {
  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    popup.classList.toggle("show");
  });
}

document.addEventListener("click", () => {
  popup.classList.remove("show");
});

// LOGOUT
function logout() {
  if (confirm("Logout")) {
    localStorage.removeItem("currentUser");
    window.location.href = "../login/login.html";
  }
}

// PROFILE
const profileModal = document.getElementById("profile-modal");

function openProfile() {
  if (!currentUser) return;
  document.getElementById("profile-name").textContent = currentUser.name;
  document.getElementById("profile-email").textContent = currentUser.email;
  profileModal.style.display = "block";
}

function closeProfile() {
  profileModal.style.display = "none";
}

// AVATAR
const avatarModal = document.getElementById("avatar-modal");
const avatarInput = document.getElementById("avatar-input");

function openAvatar() {
  avatarModal.style.display = "block";
}

function closeAvatar() {
  avatarModal.style.display = "none";
}

function updateAvatar() {
  if (avatarInput.files.length === 0) return;

  const file = avatarInput.files[0];
  const url = URL.createObjectURL(file);

  currentUser.avatar = url;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  document.querySelectorAll(".avatar, .avatar-small").forEach((img) => {
    img.src = url;
  });

  closeAvatar();
}

// PASSWORD
const passwordModal = document.getElementById("password-modal");

function openPassword() {
  passwordModal.style.display = "block";
}

function closePassword() {
  passwordModal.style.display = "none";
}

function changePassword() {
  const oldPass = document.getElementById("old-pass").value;
  const newPass = document.getElementById("new-pass").value;

  if (oldPass !== currentUser.password) {
    alert("Wrong password");
    return;
  }

  currentUser.password = newPass;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  closePassword();
}

// CLOSE MODAL
window.onclick = function (event) {
  [profileModal, avatarModal, passwordModal, modal].forEach((m) => {
    if (event.target == m) m.style.display = "none";
  });
};
