const postsContainer = document.querySelector(".posts-container");
const searchInput = document.querySelector(".search-box input");
const avatar = document.getElementById("avatar");
const authBox = document.getElementById("authBox");

const popup = document.getElementById("userPopup");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

let posts = JSON.parse(localStorage.getItem("posts")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// ================= HEADER =================
function loadHeader() {
  if (currentUser) {
    authBox.style.display = "none";
    avatar.style.display = "block";

    avatar.src = currentUser.avatar || "../img/default.png";
    document.getElementById("popupAvatar").src = avatar.src;
    document.getElementById("popupName").innerText = currentUser.name;
    document.getElementById("popupEmail").innerText = currentUser.email;
  }
}
loadHeader();

avatar.onclick = () => {
  popup.style.display = popup.style.display === "block" ? "none" : "block";
};

window.onclick = (e) => {
  if (!avatar.contains(e.target) && !popup.contains(e.target)) {
    popup.style.display = "none";
  }
};

// ================= LOGOUT =================
document.getElementById("logout").onclick = () => {
  localStorage.removeItem("currentUser");
  location.reload();
};

// ================= UPDATE AVATAR =================
document.getElementById("updateAvatar").onclick = () => {
  modal.style.display = "flex";
  modalContent.innerHTML = `
    <h3>Update Avatar</h3>
    <input type="file" id="file"><br><br>
    <button id="save">Save</button>
  `;

  document.getElementById("save").onclick = () => {
    const file = document.getElementById("file").files[0];
    const reader = new FileReader();
    reader.onload = () => {
      currentUser.avatar = reader.result;
      let index = users.findIndex((u) => u.id === currentUser.id);
      users[index].avatar = reader.result;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      location.reload();
    };
    reader.readAsDataURL(file);
  };
};

// ================= CHANGE PASSWORD =================
document.getElementById("changePassword").onclick = () => {
  modal.style.display = "flex";
  modalContent.innerHTML = `
    <h3>Change Password</h3>
    <input type="password" id="old"><br><br>
    <input type="password" id="new"><br><br>
    <input type="password" id="confirm"><br><br>
    <button id="savePass">Save</button>
  `;

  document.getElementById("savePass").onclick = () => {
    const oldPass = document.getElementById("old").value;
    const newPass = document.getElementById("new").value;
    const confirm = document.getElementById("confirm").value;

    let user = users.find((u) => u.id === currentUser.id);
    if (user.password !== oldPass) return alert("Sai mật khẩu");
    if (newPass !== confirm) return alert("Không khớp");

    user.password = newPass;
    currentUser.password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    alert("Đổi thành công");
    modal.style.display = "none";
  };
};

//  RENDER POSTS
function render(data = []) {
  postsContainer.innerHTML = "";

  if (!currentUser) {
    postsContainer.innerHTML =
      "<p style='text-align:center'>Vui lòng đăng nhập</p>";
    return;
  }

  const myPosts = data.filter((p) => p.userId === currentUser.id);

  if (myPosts.length === 0) {
    postsContainer.innerHTML =
      "<p style='text-align:center'>Chưa có bài viết nào</p>";
    return;
  }

  myPosts.forEach((post) => {
    const category = categories.find((c) => c.id === post.categoryId);

    postsContainer.innerHTML += `
      <div class="post-card">
        <img src="${post.img && post.img !== "" ? post.img : "../img/default.png"}">

        <p class="date">Date: ${post.date}</p>

        <h3>
          <a href="#">${post.title}</a>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </h3>

        <p class="desc">${post.content}</p>

        <!-- FOOTER: category left, edit right -->
        <div class="footer">
          <span class="category ${category?.name?.toLowerCase().replace(/\s+/g, "-") || "work-career"}">
            ${category?.name || ""}
          </span>
          <button class="edit-post-btn">Edit your post</button>
        </div>
      </div>
    `;
  });
}

render(posts);

//  SEARCH
searchInput.oninput = () => {
  const value = searchInput.value.toLowerCase();
  const filtered = posts.filter(
    (p) => p.userId === currentUser.id && p.title.toLowerCase().includes(value),
  );
  render(filtered);
};
