let categories = JSON.parse(localStorage.getItem("categories")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];

const input = document.getElementById("categoryInput");
const btnAdd = document.getElementById("btnAdd");
const tbody = document.getElementById("categoryBody");
const searchInput = document.getElementById("searchInput");

// modal
const modal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const btnSaveEdit = document.getElementById("btnSaveEdit");
const btnCancelEdit = document.getElementById("btnCancelEdit");

let currentId = null;

// lưu dữ liệu
function save() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

// render
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

// thêm category
btnAdd.onclick = () => {
  const name = input.value.trim();
  if (!name) return alert("Nhập tên chủ đề");

  categories.push({
    id: Date.now(),
    name,
  });

  input.value = "";
  save();
  render();
};

function editCategory(id) {
  const c = categories.find((x) => x.id === id);

  currentId = id;
  editInput.value = c.name;

  modal.style.display = "flex";
}

// lưu edit
btnSaveEdit.onclick = () => {
  const newName = editInput.value.trim();
  if (!newName) return alert("Nhập tên!");

  const c = categories.find((x) => x.id === currentId);
  c.name = newName;

  save();
  render();

  modal.style.display = "none";
};

btnCancelEdit.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

// xóa
function deleteCategory(id) {
  const hasPost = posts.some((p) => p.categoryId === id);

  if (hasPost) {
    alert("Không thể xóa vì còn bài viết!");
    return;
  }

  if (confirm("Xóa chủ đề?")) {
    categories = categories.filter((c) => c.id !== id);
    save();
    render();
  }
}

// search
searchInput.oninput = () => {
  const value = searchInput.value.toLowerCase();

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(value)
  );

  render(filtered);
};

render();