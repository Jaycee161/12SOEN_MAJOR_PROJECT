from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# In-memory storage (reset when server restarts)
tasks = []

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        subject = request.form.get("subject")
        task = request.form.get("task")
        due_date = request.form.get("due_date")
        if subject and task and due_date:
            tasks.append({
                "subject": subject,
                "task": task,
                "due_date": due_date
            })
        return redirect(url_for("index"))
    return render_template("index.html", tasks=tasks)

@app.route("/delete/<int:task_id>")
def delete_task(task_id):
    if 0 <= task_id < len(tasks):
        tasks.pop(task_id)
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)
