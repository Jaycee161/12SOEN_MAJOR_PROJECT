from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Home route
@app.route("/")
def home():
    return render_template("index.html")

# Example API route
@app.route("/api/data", methods=["POST"])
def get_data():
    data = request.json
    return jsonify({"received": data})

# Start the server (required for Codespaces)
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
