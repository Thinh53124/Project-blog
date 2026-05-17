let posts = JSON.parse(localStorage.getItem("posts")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || [];


if (currentUser.length == 0) {
  displayAuth("block", "none");
} else {
  displayAuth("none", "block");
}

function displayAuth(displayOut, displayIn) {
  document.querySelector(".signed-out").style.display = displayOut;
  document.querySelector(".signed-in").style.display = displayIn;
}

function getCategoryName(id) {
  const c = categories.find((x) => x.id === id);
  return c ? c.name : "Không xác định";
}
const listHTML = document.getElementById("tbody");

function renderPost() {
  let filted = posts.filter((val) => {
    return val.status == "Public";
  });
  listHTML.innerHTML = filted
    .map((val,index) => {
      return `
      <div class="card-mini">
                    <img src="${val.file}" alt="" class="img-mid">
                    <p class="date">Date:${val.date}</p>
                    <h4>${val.title}</h4>
                    <p class="des">${val.content}</p>
                    <p class="category" style="--i:${val.id}">${getCategoryName(val.categoryId)}</p>
    </div>`;
    })
    .join("");
}
renderPost();
const avatar = document.querySelector(".avatar");
const popup = document.getElementById("user-popup");

// Toggle khi click avatar
avatar.addEventListener("click", (e) => {
  e.stopPropagation(); // tránh bị click ngoài đóng luôn
  popup.classList.toggle("show");

  // Gán thông tin user
  if (currentUser) {
    document.getElementById("user-name").textContent =
      currentUser.name || "User";
    document.getElementById("user-email").textContent = currentUser.email || "";
  }
});

// Click ra ngoài → đóng popup
document.addEventListener("click", () => {
  popup.classList.remove("show");
});
function logout() {
  currentUser.length == 0;
  localStorage.setItemItem("currentUser",JSON.stringify(currentUser));
  window.location.reload();
}