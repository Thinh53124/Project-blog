let posts = JSON.parse(localStorage.getItem("posts")) || [
  {
    id: 1,
    title: "Học nấu cà sốt cà chua",
    categoryId: 1,
    content: "tôi đã học được cách nấu ăn...",
    status: "Public",
    img: "./img/Bài viết 1.png",
  },
  {
    id: 2,
    title: "Bí kíp viết CV ngành IT",
    categoryId: 2,
    content: "Chia sẻ cách viết CV ấn tượng...",
    status: "Private",
    img: "./img/Bài viết 2.png",
  },
];



let categories = JSON.parse(localStorage.getItem("categories")) || [
  { id: 1, name: "Nấu ăn" },
  { id: 2, name: "IT" },
];

const table = document.querySelector(".post-table");

const staticPopup = document.getElementById("popup");
if (staticPopup) {
  staticPopup.style.display = "none";
}

function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function getCategoryName(id) {
  const c = categories.find((x) => x.id === id);
  return c ? c.name : "Không xác định";
}

function render() {
  document.querySelectorAll(".post-row").forEach((e) => e.remove());

  posts.forEach((p) => {
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
        <button class="btn-action edit" onclick="editPost(${p.id})">
          Sửa
        </button>
        <button class="btn-action delete" onclick="deletePost(${p.id})">
          Xóa
        </button>
      </div>
    `;

    table.appendChild(row);
  });
}

function changeStatus(id, value) {
  const post = posts.find((p) => p.id === id);
  if (!post) return;

  post.status = value;
  save();
  render();
}

function createPopup(contentHTML) {
  const old = document.getElementById("popup");
  if (old) old.style.display = "none";

  document.querySelectorAll(".popup.dynamic").forEach((p) => p.remove());

  const overlay = document.createElement("div");
  overlay.className = "popup dynamic";

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

function closePopup(popup) {
  if (popup) popup.remove();
}

function customAlert(message) {
  const popup = createPopup(`
    <h3>${message}</h3>
    <button id="okBtn">OK</button>
  `);

  popup.querySelector("#okBtn").onclick = () => {
    popup.remove();
  };
}

function customConfirm(message, callback) {
  const popup = createPopup(`
    <h3>${message}</h3>
    <button id="yesBtn">OK</button>
    <button id="noBtn">Hủy</button>
  `);

  popup.querySelector("#yesBtn").onclick = () => {
    callback(true);
    popup.remove();
  };

  popup.querySelector("#noBtn").onclick = () => {
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

  const categoryOptions = categories
    .map((c) => `${c.id}: ${c.name}`)
    .join("<br>");

  const popup = createPopup(`
    <h3>Sửa bài viết</h3>

    <input id="title" value="${post.title.replace(/"/g, '&quot;')}" placeholder="Tiêu đề"/>
    <textarea id="content">${post.content}</textarea>
    <input id="category" value="${post.categoryId}" placeholder="Category ID"/>

    <p>${categoryOptions}</p>

    <button id="saveBtn">Lưu</button>
    <button id="cancelBtn">Hủy</button>
  `);

  popup.querySelector("#saveBtn").onclick = () => {
    const newTitle = popup.querySelector("#title").value.trim();
    const newContent = popup.querySelector("#content").value.trim();
    const newCategoryId = Number(popup.querySelector("#category").value);

    if (!newTitle || !newContent) {
      customAlert("Không được để trống!");
      return;
    }

    const categoryExists = categories.some((c) => c.id === newCategoryId);

    if (!categoryExists) {
      customAlert("ID chủ đề không hợp lệ!");
      return;
    }

    post.title = newTitle;
    post.content = newContent;
    post.categoryId = newCategoryId;

    save();
    render();
    popup.remove();
  };

  popup.querySelector("#cancelBtn").onclick = () => {
    popup.remove();
  };
}

function deletePost(id) {
  customConfirm("Xóa bài viết?", (result) => {
    if (result) {
      posts = posts.filter((p) => p.id !== id);
      save();
      render();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".popup").forEach((p) => p.remove());
  }
});

render();