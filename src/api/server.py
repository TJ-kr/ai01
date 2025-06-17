from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.handlers.response_handler import ResponseHandler
from src.utils.config import get_settings

app = FastAPI(title="Google Form Auto Emailer")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Google Form Auto Emailer API"}

@app.post("/webhook/form-response")
async def handle_form_response(response: dict):
    try:
        handler = ResponseHandler()
        result = await handler.process_response(response)
        return {"status": "success", "message": "Email sent successfully", "details": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 