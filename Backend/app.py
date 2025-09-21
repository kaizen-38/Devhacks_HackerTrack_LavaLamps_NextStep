from flask import Flask, request, jsonify, render_template
from parser.extractor import parse_resume
from neo4j_handler import Neo4jHandler
import os
from dotenv import load_dotenv

app = Flask(__name__, template_folder="templates")

# connect to AuraDB
neo4j = Neo4jHandler(
    uri=os.getenv("uri"),
    user=os.getenv("user"),
    password=os.getenv("password")
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")  # serve your existing index.html

@app.route("/upload", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No resume uploaded"}), 400

    file = request.files["resume"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Parse resume
    data = parse_resume(file_path)

    # data["education"] = data.get("education", [])
    # data["experience"] = data.get("experience", [])
    # data["skills"] = data.get("skills", [])
    # data["certifications"] = data.get("certifications", [])
    print(data)
    # Store in Neo4j using the correct method
    neo4j.insert_resume(data)

    return jsonify({
        "message": "Resume parsed and stored successfully!",
        "data": data
    }), 200


if __name__ == "__main__":
    app.run(debug=True)
