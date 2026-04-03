let posts = JSON.parse(localStorage.getItem("posts")) || [
  {
    id: 1,
    title: "Học nấu cà sốt cà chua",
    categoryId: 1,
    content: "tôi đã học được cách nấu ăn...",
    status: "Public",
    img: "./img/Bài viết 1.png"
  },
  {
    id: 2,
    title: "Bí kíp viết CV ngành IT",
    categoryId: 2,
    content: "Chia sẻ cách viết CV ấn tượng...",
    status: "Private",
    img: "./img/Bài viết 2.png"
  }
];

let categories = JSON.parse(localStorage.getItem("categories")) || [];

const table = document.querySelector(".post-table");

function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function getCategoryName(id) {
  const c = categories.find(x => x.id === id);
  return c ? c.name : "Không xác định";
}

function render() {
  document.querySelectorAll(".post-row").forEach(e => e.remove());

  posts.forEach(p => {
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
        <button class="edit" onclick="editPost(${p.id})">Sửa</button>
        <button class="delete" onclick="deletePost(${p.id})">Xóa</button>
      </div>
    `;

    table.appendChild(row);
  });
}

function changeStatus(id, value) {
  const post = posts.find(p => p.id === id);
  post.status = value;
  save();
  render();
}

function editPost(id) {
  const post = posts.find(p => p.id === id);

  const newTitle = prompt("Tiêu đề:", post.title);
  const newContent = prompt("Nội dung:", post.content);

  let categoryOptions = categories
    .map(c => `${c.id}: ${c.name}`)
    .join("\n");

  const newCategoryId = prompt(
    "Chọn ID chủ đề:\n" + categoryOptions,
    post.categoryId
  );

  if (!newTitle || !newContent || !newCategoryId) return;

  post.title = newTitle;
  post.content = newContent;
  post.categoryId = Number(newCategoryId);

  save();
  render();
}

function deletePost(id) {
  if (confirm("Xóa bài viết?")) {
    posts = posts.filter(p => p.id !== id);
    save();
    render();
  }
}

render();