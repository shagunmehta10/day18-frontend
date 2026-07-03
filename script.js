// Redirect if not logged in
if (window.location.pathname.includes("dashboard.html")) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must log in first!");
    window.location.href = "index.html";
  }
}

const API = "const API = "https://day18-backend.onrender.com";

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert("Login failed!");
  }
});

// Logout
document.getElementById("logout")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// Add User
document
  .getElementById("addUserForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const name = addName.value,
      email = addEmail.value,
      password = addPassword.value;

    await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password }),
    });
    alert("User added!");
    loadUsers();
  });

// Load Users
async function loadUsers() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const users = await res.json();

  const table = document.getElementById("usersTable");
  table.innerHTML = "<tr><th>Name</th><th>Email</th><th>Actions</th></tr>";

  users.forEach((u) => {
    table.innerHTML += `
      <tr>
        <td><input type="text" value="${u.name}" id="name-${u._id}"></td>
        <td><input type="email" value="${u.email}" id="email-${u._id}"></td>
        <td>
          <button onclick="updateUser('${u._id}')">Update</button>
          <button onclick="deleteUser('${u._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Update User
async function updateUser(id) {
  const token = localStorage.getItem("token");
  const name = document.getElementById(`name-${id}`).value;
  const email = document.getElementById(`email-${id}`).value;

  await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email }),
  });
  alert("User updated!");
  loadUsers();
}

// Delete User
async function deleteUser(id) {
  const token = localStorage.getItem("token");
  await fetch(`${API}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  alert("User deleted!");
  loadUsers();
}

// Load users on page load
window.addEventListener("load", loadUsers);
