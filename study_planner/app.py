from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

tasks = []

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        subject = request.form.get("subject")
        task = request.form.get("task")
        due_date = request.form.get("due_date")
        tasks.append({
            "subject": subject,
            "task": task,
            "due_date": due_date
        })
        return redirect(url_for("index"))
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
