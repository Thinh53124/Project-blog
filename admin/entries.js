let categories = JSON.parse(localStorage.getItem("categories")) || [];

let posts = JSON.parse(localStorage.getItem("posts")) || [];

const input = document.getElementById("categoryInput");
const btnAdd = document.getElementById("btnAdd");
const tbody = document.getElementById("categoryBody");
const searchInput = document.getElementById("searchInput");

function save() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

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
  const newName = prompt("Sửa tên:", c.name);

  if (!newName) return;

  c.name = newName;
  save();
  render();
}

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

searchInput.oninput = () => {
  const value = searchInput.value.toLowerCase();

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(value),
  );

  render(filtered);
};

render();
