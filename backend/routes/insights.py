from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.ai_client import GeminiClient

router = APIRouter()
ai_client = GeminiClient()

class InsightsRequest(BaseModel):
    note_content: str

@router.post("/generate-insights", tags=["insights"])
async def generate_insights_endpoint(req: InsightsRequest):
    try:
        insights_text = await ai_client.generate_notes_from_text(req.note_content)
        return {"insights": insights_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {e}") 