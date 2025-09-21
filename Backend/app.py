from flask import Flask, request, jsonify, render_template
from parser.extractor import parse_resume
from flask_cors import CORS, cross_origin
from neo4j_handler import Neo4jHandler
import os
from dotenv import load_dotenv
import requests
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

app = Flask(__name__, template_folder="templates")
langflow_api_key = os.getenv("langflow_Courses")
# connect to AuraDB
neo4j = Neo4jHandler(
    uri=os.getenv("uri"),
    user=os.getenv("user"),
    password=os.getenv("password")
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods=["GET"])
@cross_origin()
def home():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
@cross_origin()
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
    return jsonify(data)

@app.route("/submit_resume", methods=["POST"])
@cross_origin()
def submit_resume():
    data = request.json
    career_path = data.get("career_path")

    handler = Neo4jHandler(
        uri=os.getenv("uri"),
        user=os.getenv("user"),
        password=os.getenv("password")
    )
    handler.insert_resume(data)
    handler.close()

    return jsonify({"message": "Resume successfully inserted", "career_path": career_path})

@app.route("/course_suggestions", methods=["POST"])
@cross_origin()
def course_suggestions():
    try:
        data = request.json
        query = f"I have this {data.get("skill")} And I want to get this Job {data.get("JD")}. Suggest me some courses that can help me get this job."
        user_input = request.json.get("query", query)
        flow_id = "baa053aa-6038-43f9-8707-f46e2ee2ff20"  # your flow
        url = f"http://localhost:7860/api/v1/run/{flow_id}?stream=false"
        headers = {
            "Content-Type": "application/json",
            "x-api-key": langflow_api_key
        }

        payload = {
            "output_type": "chat",
            "input_type": "chat",
            "input_value": user_input
        }

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()

        return jsonify(response.json())

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/job_search", methods=["POST"])
@cross_origin()
def job_search():
    try:
        data = request.json
        query = f"I have this {data.get("skill")} And I want to pursue career in {data.get("career_path")}. Suggest me some job posting."
        user_input = request.json.get("query", query)
        flow_id = "c842e250-da8e-45e4-9614-5748c1646a31"  # job search flow
        url = f"http://localhost:7860/api/v1/run/{flow_id}?stream=false"

        headers = {
            "Content-Type": "application/json",
            "x-api-key": langflow_api_key
        }

        payload = {
            "output_type": "chat",
            "input_type": "chat",
            "input_value": user_input
        }

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()

        return jsonify(response.json())

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
