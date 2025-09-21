from PyPDF2 import PdfReader
from parser.gemini_parser import parse_resume_with_gemini

def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text.strip()

def parse_resume(file_path: str) -> dict:
    text = extract_text_from_pdf(file_path)
    return parse_resume_with_gemini(text)
