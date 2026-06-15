let currentUser = null;

// Helpers
function showSignup() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("signupSection").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("signupSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
}

function showPlanner() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("signupSection").classList.add("hidden");
    document.getElementById("plannerSection").classList.remove("hidden");
}

function logout() {
    currentUser = null;
    document.getElementById("plannerSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("currentUser").textContent = "";
    document.getElementById("taskList").innerHTML = "";
}

// API calls
async function apiSignup(username, password) {
    const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return res.json();
}

async function apiLogin(username, password) {
    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return res.json();
}

async function apiGetTasks(username) {
    const res = await fetch(`/tasks/${encodeURIComponent(username)}`);
    return res.json();
}

async function apiAddTask(username, subject, task, due) {
    const res = await fetch(`/tasks/${encodeURIComponent(username)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, task, due })
    });
    return res.json();
}

// UI logic
async function handleSignup() {
    const user = document.getElementById("signupUser").value.trim();
    const pass = document.getElementById("signupPass").value.trim();

    if (!user || !pass) {
        alert("Fill all fields");
        return;
    }

    const result = await apiSignup(user, pass);
    if (!result.success) {
        alert(result.message || "Signup failed");
        return;
    }

    alert("Account created");
    showLogin();
}

async function handleLogin() {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    if (!user || !pass) {
        alert("Fill all fields");
        return;
    }

    const result = await apiLogin(user, pass);
    if (!result.success) {
        alert(result.message || "Incorrect username or password");
        return;
    }

    currentUser = user;
    document.getElementById("currentUser").textContent = user;
    showPlanner();
    await loadTasks();
}

async function handleAddTask() {
    if (!currentUser) {
        alert("You must be logged in");
        return;
    }

    const subject = document.getElementById("subject").value.trim();
    const task = document.getElementById("task").value.trim();
    const due = document.getElementById("due").value;

    if (!subject || !task || !due) {
        alert("Fill all fields");
        return;
    }

    const result = await apiAddTask(currentUser, subject, task, due);
    if (!result.success) {
        alert(result.message || "Could not add task");
        return;
    }

    document.getElementById("subject").value = "";
    document.getElementById("task").value = "";
    document.getElementById("due").value = "";

    await loadTasks();
}

async function loadTasks() {
    if (!currentUser) return;

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    const userTasks = await apiGetTasks(currentUser);

    userTasks.forEach(t => {
        const div = document.createElement("div");
        div.innerHTML = `<strong>${t.subject}</strong><br>${t.task}<br>Due: ${t.due}`;
        list.appendChild(div);
    });
}

// Event listeners
document.getElementById("showSignupLink").addEventListener("click", (e) => {
    e.preventDefault();
    showSignup();
});

document.getElementById("showLoginLink").addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
});

document.getElementById("signupBtn").addEventListener("click", handleSignup);
document.getElementById("loginBtn").addEventListener("click", handleLogin);
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("addTaskBtn").addEventListener("click", handleAddTask);
