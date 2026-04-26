from fastapi import FastAPI, UploadFile, File
import requests

app = FastAPI()

API_KEY = "K84159433188957"
OCR_URL = "https://api.ocr.space/parse/image"

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    
    image_bytes = await file.read()

    print("Received file")  # ✅ debug

    response = requests.post(
        OCR_URL,
        files={"file": ("image.png", image_bytes)},
        data={"apikey": API_KEY, "language": "eng"}
    )

    result = response.json()

    print("OCR RESPONSE:", result)  

    try:
        text = result['ParsedResults'][0]['ParsedText']
        print("EXTRACTED TEXT:", text)
        print("OCR TEXT:\n", text)
        return {"extracted_text": text}
    except:
        return {"error": result}