let posts = JSON.parse(localStorage.getItem("posts")) || [];

let categories = JSON.parse(localStorage.getItem("categories")) || [];

const table = document.querySelector(".post-table");

/* pagination */
let currentPage = 1;
const perPage = 5;

function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function getCategoryName(id) {
  const c = categories.find((x) => x.id === id);
  return c ? c.name : "Không xác định";
}

function render() {
  document.querySelectorAll(".post-row").forEach((e) => e.remove());

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const pagePosts = posts.slice(start, end);

  pagePosts.forEach((p) => {
    const row = document.createElement("div");
    row.className = "post-row";

    row.innerHTML = `
        <img src="${p.img}" class="thumb" />
        <div>${p.title}</div>
        <div>${getCategoryName(p.categoryId)}</div>
        <div>${p.content}</div>
        <span class="status ${p.status.toLowerCase()}">
          <b>${p.status}</b>
        </span>
        <div class="status-select">
          <select onchange="changeStatus(${p.id}, this.value)">
            <option ${p.status === "Public" ? "selected" : ""}>Public</option>
            <option ${p.status === "Private" ? "selected" : ""}>Private</option>
          </select>
        </div>
        <div class="actions">
          <button class="btn-action edit" onclick="editPost(${p.id})">Sửa</button>
          <button class="btn-action delete" onclick="deletePost(${p.id})">Xóa</button>
        </div>
      `;

    table.appendChild(row);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(posts.length / perPage);
  const pagesContainer = document.querySelector(".pages");
  pagesContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const span = document.createElement("span");
    span.innerText = i;

    if (i === currentPage) {
      span.classList.add("active");
    }

    span.onclick = () => {
      currentPage = i;
      render();
      renderPagination();
    };

    pagesContainer.appendChild(span);
  }

  document.querySelector(".prev").onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      render();
      renderPagination();
    }
  };

  document.querySelector(".next").onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      render();
      renderPagination();
    }
  };
}

function changeStatus(id, value) {
  const post = posts.find((p) => p.id === id);
  if (!post) return;

  post.status = value;
  save();
  render();
  renderPagination();
}

function createPopup(contentHTML) {
  const overlay = document.createElement("div");
  overlay.className = "popup";

  const box = document.createElement("div");
  box.className = "popup-box";
  box.innerHTML = contentHTML;

  overlay.appendChild(box);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
  return overlay;
}

function customAlert(message) {
  const popup = createPopup(`
      <h3>${message}</h3>
      <div class="popup-actions">
        <button class="btn-save">OK</button>
      </div>
    `);

  popup.querySelector("button").onclick = () => popup.remove();
}

function customConfirm(message, callback) {
  const popup = createPopup(`
      <h3>${message}</h3>
      <div class="popup-actions">
        <button class="btn-save">OK</button>
        <button class="btn-cancel">Hủy</button>
      </div>
    `);

  const [okBtn, cancelBtn] = popup.querySelectorAll("button");

  okBtn.onclick = () => {
    callback(true);
    popup.remove();
  };

  cancelBtn.onclick = () => {
    callback(false);
    popup.remove();
  };
}

function editPost(id) {
  const post = posts.find((p) => p.id === id);
  if (!post) return;

  if (categories.length === 0) {
    customAlert("Chưa có chủ đề!");
    return;
  }

  const popup = createPopup(`
    <div class="form">

      <img src="./img/x-circle.png" class="close-btn">

      <div class="form-header">
        <h1>✏️ Edit Article</h1>
      </div>

      <br>

      <label>Title:</label><br>
      <input type="text" id="new-title" value="${post.title.replace(/"/g, "&quot;")}"><br><br>

      <label>Article Categories:</label><br>
      <select id="new-category">
        ${categories
          .map(
            (c) => `
          <option value="${c.id}" ${c.id === post.categoryId ? "selected" : ""}>
            ${c.name}
          </option>
        `,
          )
          .join("")}
      </select><br><br>

      <label>Mood:</label><br>
      <select id="new-mood">
        <option ${post.mood === "😊 Happy" ? "selected" : ""}>😊 Happy</option>
        <option ${post.mood === "😢 Sad" ? "selected" : ""}>😢 Sad</option>
        <option ${post.mood === "😎 Cool" ? "selected" : ""}>😎 Cool</option>
      </select><br><br>

      <label>Content:</label><br>
      <textarea id="new-content" rows="6">${post.content}</textarea><br><br>

      <div class="form-status">
        <span>Status</span>
        <input type="radio" name="newStatus" value="Public" ${post.status === "Public" ? "checked" : ""}> Public
        <input type="radio" name="newStatus" value="Private" ${post.status === "Private" ? "checked" : ""}> Private
      </div><br>

      <!-- GIỮ NGUYÊN PHẦN UPLOAD NHƯNG KHÔNG XỬ LÝ -->
      <div class="upload-box">
        <input type="file" id="file-input">
        <label class="upload-label">
          <img src="./img/upload-icon.png" alt="">
          <p>Ảnh hiện tại sẽ được giữ nguyên</p>
        </label>
      </div>

      <br><br>

      <div class="popup-actions">
        <button id="updatePostBtn" class="btn-save">Update</button>
      </div>

    </div>
  `);

  // xử lý update
  popup.querySelector("#updatePostBtn").onclick = () => {
    const title = popup.querySelector("#new-title").value.trim();
    const content = popup.querySelector("#new-content").value.trim();
    const categoryId = Number(popup.querySelector("#new-category").value);
    const status = popup.querySelector('input[name="newStatus"]:checked').value;
    const mood = popup.querySelector("#new-mood").value;

    if (!title || !content) {
      customAlert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // update dữ liệu
    post.title = title;
    post.content = content;
    post.categoryId = categoryId;
    post.status = status;
    post.mood = mood;

    save();
    render();
    renderPagination();

    popup.remove();
  };

  popup.querySelector(".close-btn").onclick = () => {
    popup.remove();
  };
}

function deletePost(id) {
  customConfirm("Xóa bài viết?", (result) => {
    if (result) {
      posts = posts.filter((p) => p.id !== id);

      const totalPages = Math.ceil(posts.length / perPage);
      if (currentPage > totalPages) {
        currentPage = totalPages || 1;
      }

      save();
      render();
      renderPagination();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".popup").forEach((p) => p.remove());
  }
});

function goToAdd() {
  window.location.href = "../new post/newpost.html";
}

function openAddPopup() {
  if (categories.length === 0) {
    customAlert("Chưa có chủ đề! Hãy tạo trước.");
    return;
  }

  const popup = createPopup(`
      <div class="form">

        <img src="./img/x-circle.png" class="close-btn">
        <div class="form-header">
          <h1>📝 Add New Article</h1>
        </div>

        <br>

        <label>Title:</label><br>
        <input type="text" id="new-title" placeholder="Enter your title..."><br><br>

        <label>Article Categories:</label><br>
        <select id="new-category">
          ${categories
            .map((c) => `<option value="${c.id}">${c.name}</option>`)
            .join("")}
        </select><br><br>

        <!-- GIỮ NGUYÊN MOOD -->
        <label>Mood:</label><br>
        <select id="new-mood">
          <option>😊 Happy</option>
          <option>😢 Sad</option>
          <option>😎 Cool</option>
        </select><br><br>

        <label>Content:</label><br>
        <textarea id="new-content" rows="6"></textarea><br><br>

        <div class="form-status">
          <span>Status</span>
          <input type="radio" name="newStatus" value="Public" checked> Public
          <input type="radio" name="newStatus" value="Private"> Private
        </div><br>

        <div class="upload-box">
          <input type="file" id="file-input">

          <label for="file-input" class="upload-label">
            <img src="./img/upload-icon.png" alt="">
            <p>Browse and choose the files you want<br>to upload from your computer</p>
          </label>
        </div>
        <br><br>

        <div class="popup-actions">
          <button id="addPostBtn" class="btn-save">Add</button>
        </div>

      </div>
    `);

  // xử lý add
  popup.querySelector("#addPostBtn").onclick = () => {
    const title = popup.querySelector("#new-title").value.trim();
    const content = popup.querySelector("#new-content").value.trim();
    const categoryId = Number(popup.querySelector("#new-category").value);
    const status = popup.querySelector('input[name="newStatus"]:checked').value;

    // lấy mood
    const mood = popup.querySelector("#new-mood").value;

    if (!title || !content) {
      customAlert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    let newId = 1;
    if (posts.length > 0) {
      newId = Math.max(...posts.map((p) => p.id)) + 1;
    }

    const newPost = {
      id: newId,
      title,
      content,
      categoryId,
      status,
      mood,
      img: "./img/default.png",
    };

    posts.push(newPost);

    save();
    render();
    renderPagination();

    popup.remove();
  };

  popup.querySelector(".close-btn").onclick = () => {
    popup.remove();
  };
}

render();
renderPagination();
