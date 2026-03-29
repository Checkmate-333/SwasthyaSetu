import os
import json
import google.generativeai as genai

def generate_clinical_summary(patient_history_json: dict) -> dict:
    """
    Calls the Gemini API to generate a structured doctor-friendly clinical summary,
    including risks and patterns based on the patient history JSON.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
         raise ValueError("GEMINI_API_KEY environment variable is not properly configured.")
         
    genai.configure(api_key=api_key)
    
    # Utilizing gemini-1.5-flash for rapid JSON struct outputs
    model = genai.GenerativeModel('gemini-1.5-flash', 
        generation_config={"response_mime_type": "application/json"}
    )
    
    prompt = f"""
    You are an expert medical AI assistant.
    Analyze the following patient history JSON data.
    Generate a concise, doctor-friendly clinical summary.
    
    Output perfectly structured JSON EXACTLY in this format:
    {{
      "summary": "String spanning all clinical synthesis",
      "risks": ["Risk factor 1", "Risk factor 2"],
      "patterns": ["Observed pattern 1", "Observed pattern 2"]
    }}
    
    Patient History Data:
    {json.dumps(patient_history_json, indent=2)}
    """
    
    response = model.generate_content(prompt)
    
    try:
        return json.loads(response.text)
    except Exception as e:
        raise RuntimeError(f"Failed to parse Gemini API response: {e}\nRaw output: {response.text}")
