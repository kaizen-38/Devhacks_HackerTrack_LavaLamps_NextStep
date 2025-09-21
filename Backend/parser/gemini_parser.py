import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Load your API key (make sure to set it in env var GCP_API_KEY or paste directly)
genai.configure(api_key=os.getenv("AIzaSyDV6lBoB-M78CMwtMkOjNArkDslwJyo6nI"))

model = genai.GenerativeModel("gemini-2.0-flash")


def parse_resume_with_gemini(text: str) -> dict:
    """
    Send resume text to Gemini and return structured JSON.
    """
    prompt = f"""
    You are a resume parser. Extract structured information from this resume text and return JSON
    matching the following schema:

    {{
      "first_name": string,
      "middle_name": string | null,
      "last_name": string,
      "contact_no": string | null,
      "email": string,
      "education": [
        {{
          "university": string,
          "degree": string,
          "major": string | null,
          "cgpa": float | null,
          "scale": float | null,
          "minor": [string] | null,
          "graduation_date": string | null
        }}
      ],
      "experience": [
        {{
          "company": string,
          "position": string,
          "description": string | null,
          "start_date": string | null,
          "end_date": string | null
        }}
      ],
      "skills": [string],
      "certifications": [string]
    }}

    Resume text:
    {text}
    """

    response = model.generate_content(prompt)
    cleaned = re.sub(r"^```json\n|```$", "", response.text.strip())
    # print(type(json.loads(cleaned)))
    # print((json.loads(cleaned)))

    try:
        # Extract JSON from Gemini response
        return cleaned  # Quick + dirty, better: use json.loads with proper parsing
    except Exception:
        return {"error": "Failed to parse response", "raw": cleaned}
