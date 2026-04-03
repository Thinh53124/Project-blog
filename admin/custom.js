const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "../login/login.html";
}

const table = document.getElementById("userTable");
const userCount = document.querySelector(".users");
const searchInput = document.querySelector(".search-box input");

let defaultUsers = [];

let localUsers = JSON.parse(localStorage.getItem("users")) || [];

let users = [...defaultUsers, ...localUsers];

// RENDER 
function renderUsers(data) {
  table.innerHTML = "";

  data.forEach((user, index) => {
    const row = `
      <div class="row">
        <div class="col name">
          <img src="${user.avatar}" />
          <div>
            <p>${user.name}</p>
            <span>${user.username}</span>
          </div>
        </div>

        <div class="col status">${user.status}</div>
        <div class="col-email">${user.email}</div>

        <div class="col actions">
          <span class="block" data-index="${index}">block</span>
          <span class="unblock" data-index="${index}">unblock</span>
        </div>
      </div>
    `;

    table.innerHTML += row;
  });

  userCount.textContent = data.length + " users";

  handleActions();
}

// BLOCK / UNBLOCK 
function handleActions() {
  document.querySelectorAll(".block").forEach(btn => {
    btn.onclick = function () {
      let index = this.dataset.index;
      users[index].status = "đã khóa";
      saveLocalUsers();
      renderUsers(users);
    };
  });

  document.querySelectorAll(".unblock").forEach(btn => {
    btn.onclick = function () {
      let index = this.dataset.index;
      users[index].status = "hoạt động";
      saveLocalUsers();
      renderUsers(users);
    };
  });
}

function saveLocalUsers() {
  let onlyLocal = users.slice(defaultUsers.length);
  localStorage.setItem("users", JSON.stringify(onlyLocal));
}

// SEARCH 
searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = users.filter(user =>
    user.name.toLowerCase().includes(value) ||
    user.email.toLowerCase().includes(value)
  );

  renderUsers(filtered);
});

document.querySelector(".logout").onclick = function (e) {
  e.preventDefault();
  localStorage.removeItem("currentUser");
  window.location.href = "../login/login.html";
};

renderUsers(users);