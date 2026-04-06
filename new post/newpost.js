// SELECT DOM
const form = document.querySelector(".form");
const titleInput = document.querySelector(".title-2");
const categorySelect = document.querySelector(".category");
const contentInput = document.querySelector("textarea");
const fileInput = document.getElementById("file-input");

// LOAD CATEGORIES
let categories = JSON.parse(localStorage.getItem("categories")) || [];

function loadCategories() {
  categorySelect.innerHTML = `<option value="">-- Select category --</option>`;
  categories.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.name;
    categorySelect.appendChild(option);
  });
}

loadCategories();

// ================= POPUP =================
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

function customAlert(message, callback) {
  const popup = createPopup(`
    <h3>${message}</h3>
    <div class="popup-actions">
      <button class="btn-save">OK</button>
    </div>
  `);

  popup.querySelector("button").onclick = () => {
    popup.remove();
    if (callback) callback();
  };
}

// ================= FORM VALIDATE =================
function highlightError(input) {
  input.style.border = "1px solid red";
}
function clearError(input) {
  input.style.border = "";
}

// ================= SUBMIT =================
form.onsubmit = function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const categoryId = Number(categorySelect.value);
  const status = document.querySelector('input[name="Status"]:checked')?.value;

  let isValid = true;

  if (!title) { highlightError(titleInput); isValid = false; } else clearError(titleInput);
  if (!content) { highlightError(contentInput); isValid = false; } else clearError(contentInput);
  if (!categoryId) { highlightError(categorySelect); isValid = false; } else clearError(categorySelect);
  if (!status) { customAlert("Vui lòng chọn trạng thái!"); isValid = false; }

  if (!isValid) {
    customAlert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || { id: 0 };
  let newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  let img = "../img/default.png";

  const file = fileInput.files[0];
  const now = new Date();
  const date = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;

  function savePost() {
    const newPost = {
      id: newId,
      title,
      content,
      categoryId,
      status: status.charAt(0).toUpperCase() + status.slice(1),
      img,
      userId: currentUser.id,
      date
    };

    posts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));

    customAlert("Thêm bài viết thành công!", () => {
      window.location.href = "../allmypost/allmypost.html";
    });
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
};

// ESC để đóng popup
document.addEventListener("keydown", e => {
  if (e.key === "Escape") document.querySelectorAll(".popup").forEach(p => p.remove());
});