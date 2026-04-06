let categories = JSON.parse(localStorage.getItem("categories")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];

const input = document.getElementById("categoryInput");
const btnAdd = document.getElementById("btnAdd");
const tbody = document.getElementById("categoryBody");
const searchInput = document.getElementById("searchInput");

// Modal edit
const modal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const btnSaveEdit = document.getElementById("btnSaveEdit");
const btnCancelEdit = document.getElementById("btnCancelEdit");

let currentId = null;

/* Popup system */
function createPopup(contentHTML) {
  const overlay = document.createElement("div");
  overlay.className = "modal";
  overlay.style.display = "flex";

  const box = document.createElement("div");
  box.className = "modal-content";
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
    <h3>Thông báo</h3>
    <p style="margin-bottom:15px; color:#4B5563;">${message}</p>
    <div class="modal-actions">
      <button class="btn-ok">OK</button>
    </div>
  `);

  popup.querySelector("button").onclick = () => popup.remove();
}

function customConfirm(message, callback) {
  const popup = createPopup(`
    <h3>Xác nhận</h3>
    <p style="margin-bottom:15px; color:#4B5563;">${message}</p>

    <div class="modal-actions">
      <button class="btn-ok">OK</button>
      <button class="btn-cancel">Hủy</button>
    </div>
  `);

  const cancelBtn = popup.querySelector(".btn-cancel");
  const okBtn = popup.querySelector(".btn-ok");

  okBtn.onclick = () => {
    callback(true);
    popup.remove();
  };

  cancelBtn.onclick = () => {
    callback(false);
    popup.remove();
  };
}

// Esc de dong popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".popup").forEach((p) => p.remove());
  }
});

/* Core */

// Luu du lieu
function save() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

// Render
function render(data = categories) {
  tbody.innerHTML = "";

  data.forEach((c, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${c.name}</td>
      <td>
        <button class="edit" onclick="editCategory(${c.id})">Edit</button>
        <button class="delete" onclick="deleteCategory(${c.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Them category
btnAdd.onclick = () => {
  const name = input.value.trim();

  if (!name) {
    customAlert("Nhập tên chủ đề");
    return;
  }

  let newId = 1;

  if (categories.length > 0) {
    newId = Math.max(...categories.map((c) => c.id)) + 1;
  }

  categories.push({
    id: newId,
    name,
  });

  input.value = "";
  save();
  render();
};

// Mo modal edit
function editCategory(id) {
  const c = categories.find((x) => x.id === id);

  currentId = id;
  editInput.value = c.name;

  modal.style.display = "flex";
}

// Luu edit
btnSaveEdit.onclick = () => {
  const newName = editInput.value.trim();

  if (!newName) {
    customAlert("Nhập tên!");
    return;
  }

  const c = categories.find((x) => x.id === currentId);
  c.name = newName;

  save();
  render();

  modal.style.display = "none";
};

btnCancelEdit.onclick = () => {
  modal.style.display = "none";
};

// Click ngoai modal de dong
window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

// Xoa
function deleteCategory(id) {
  const hasPost = posts.some((p) => p.categoryId === id);

  if (hasPost) {
    customAlert("Không thể xóa vì còn bài viết!");
    return;
  }

  customConfirm("Xóa chủ đề?", (result) => {
    if (result) {
      categories = categories.filter((c) => c.id !== id);
      save();
      render();
    }
  });
}

// Search
searchInput.oninput = () => {
  const value = searchInput.value.toLowerCase();

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(value),
  );

  render(filtered);
};

render();
