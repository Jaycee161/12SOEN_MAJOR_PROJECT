const loginSection = document.getElementById("loginSection");
const signupSection = document.getElementById("signupSection");
const plannerSection = document.getElementById("plannerSection");

document.getElementById("showSignupLink").onclick = () => {
    loginSection.classList.add("d-none");
    signupSection.classList.remove("d-none");
};

document.getElementById("showLoginLink").onclick = () => {
    signupSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
};

document.getElementById("signupBtn").onclick = async () => {
    const username = signupUser.value;
    const password = signupPass.value;

    const res = await fetch("/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    const data = await res.json();
    if (data.success) {
        alert("Account created!");
        signupSection.classList.add("d-none");
        loginSection.classList.remove("d-none");
    } else {
        alert(data.message);
    }
};

document.getElementById("loginBtn").onclick = async () => {
    const username = loginUser.value;
    const password = loginPass.value;

    const res = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    const data = await res.json();
    if (data.success) {
        currentUser.textContent = username;
        loginSection.classList.add("d-none");
        plannerSection.classList.remove("d-none");
        loadTasks(username);
    } else {
        alert(data.message);
    }
};

async function loadTasks(username) {
    const res = await fetch(`/tasks/${username}`);
    const list = await res.json();

    taskList.innerHTML = "";

    list.forEach(t => {
        taskList.innerHTML += `
            <div class="task-card">
                <strong>${t.subject}</strong><br>
                ${t.task}<br>
                <span class="task-date">Due: ${t.due}</span>
            </div>
        `;
    });
}

document.getElementById("addTaskBtn").onclick = async () => {
    const username = currentUser.textContent;

    const subject = document.getElementById("subject").value;
    const task = document.getElementById("task").value;
    const due = document.getElementById("due").value;

    const res = await fetch(`/tasks/${username}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({subject, task, due})
    });

    const data = await res.json();
    if (data.success) {
        loadTasks(username);
    } else {
        alert(data.message);
    }
};

document.getElementById("logoutBtn").onclick = () => {
    plannerSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
};
