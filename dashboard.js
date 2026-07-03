const API_URL = "https://yourapp.onrender.com"; // backend deployed URL
let token = localStorage.getItem("token") || "";

async function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  alert("Signup successful!");
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  token = data.token;
  localStorage.setItem("token", token);
  loadUsers();
}

function logout() {
  token = "";
  localStorage.removeItem("token");
  document.getElementById("userTable").innerHTML = "";
}

async function loadUsers() {
  const res = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const users = await res.json();
  renderTable(users);
}

function renderTable(users) {
  const table = document.getElementById("userTable");
  table.innerHTML = "<tr><th>Name</th><th>Email</th><th>Actions</th></tr>";
  users.forEach((u) => {
    table.innerHTML += `<tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td><button onclick="deleteUser('${u._id}')">Delete</button></td>
    </tr>`;
  });
}

async function addUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;

  await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, password }),
  });

  loadUsers();
}

async function deleteUser(id) {
  await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadUsers();
}
