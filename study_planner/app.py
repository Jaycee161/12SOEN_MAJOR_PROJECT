from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

users = {}
tasks = {}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    user = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not user or not password:
        return jsonify({"success": False, "message": "Missing username or password"}), 400

    if user in users:
        return jsonify({"success": False, "message": "User already exists"}), 400

    users[user] = password
    tasks[user] = []
    return jsonify({"success": True})

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if user not in users or users[user] != password:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    return jsonify({"success": True})

@app.route("/tasks/<username>", methods=["GET"])
def get_tasks(username):
    return jsonify(tasks.get(username, []))

@app.route("/tasks/<username>", methods=["POST"])
def add_task(username):
    if username not in tasks:
        return jsonify({"success": False, "message": "User not found"}), 404

    data = request.get_json()
    subject = data.get("subject", "").strip()
    task = data.get("task", "").strip()
    due = data.get("due", "").strip()

    if not subject or not task or not due:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    tasks[username].append({
        "id": len(tasks[username]) + 1,
        "subject": subject,
        "task": task,
        "due": due
    })

    return jsonify({"success": True})
