from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image, ImageOps
import pytesseract
import io
import re
import numpy as np
import cv2

app = FastAPI()

# If Tesseract is not in your PATH, specify it here:
import os
import shutil

# Check if tesseract is in PATH
if shutil.which("tesseract"):
    pass # It's in PATH, all good
elif os.path.exists(r'C:\Program Files\Tesseract-OCR\tesseract.exe'):
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
elif os.path.exists(r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe'):
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe'
else:
    print("WARNING: Tesseract not found in standard paths. OCR might fail.")

def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Convert to grayscale and threshold to improve OCR accuracy.
    Using OpenCV for more robust preprocessing.
    """
    # Convert PIL Image to slightly more usable format for OpenCV
    img_array = np.array(image)
    
    # Convert RGB to BGR (OpenCV uses BGR)
    if len(img_array.shape) == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

    # Convert to grayscale
    gray = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)

    # Apply adaptive thresholding
    # This often works better for ID cards with varying lighting
    processed = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # Denoise
    processed = cv2.fastNlMeansDenoising(processed, None, 10, 7, 21)

    # Convert back to PIL Image
    return Image.fromarray(processed)

def parse_id_card(text: str):
    """
    Analyze OCR text to find patterns like ID numbers.
    Customize regex for your specific ID type (e.g., Passport, National ID).
    """
    # Example: Looking for a generic 8-digit ID number
    id_pattern = r"\b\d{8}\b"
    
    # Example: Looking for date patterns (DD/MM/YYYY or YYYY-MM-DD)
    date_pattern = r"\b\d{2}[/-]\d{2}[/-]\d{4}\b|\b\d{4}[/-]\d{2}[/-]\d{2}\b"
    
    found_id = re.search(id_pattern, text)
    found_dates = re.findall(date_pattern, text)
    
    # Filter empty lines
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    return {
        "raw_text": text,
        "extracted_id": found_id.group(0) if found_id else None,
        "extracted_dates": found_dates,
        "lines": lines
    }

@app.post("/verify-id")
async def verify_id(file: UploadFile = File(...)):
    # 1. Validate File Type
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG/PNG allowed.")

    try:
        # 2. Read Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # 3. Pre-process
        # We try to use the original if preprocessing fails, but usually it helps.
        try:
            processed_image = preprocess_image(image)
        except Exception:
            # Fallback to original if CV2 fails for some reason
            processed_image = image

        # 4. Run PyTesseract
        # lang='eng' can be changed based on the ID language
        # psm 6 (Assume a single uniform block of text) often works well for IDs
        custom_config = r'--oem 3 --psm 6' 
        text = pytesseract.image_to_string(processed_image, lang='eng', config=custom_config)

        # 5. Parse Data
        result = parse_id_card(text)
        
        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def health_check():
    return {"status": "ok", "service": "ocr-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
