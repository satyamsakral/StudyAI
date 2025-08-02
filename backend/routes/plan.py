import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from utils.ai_client import GeminiClient
router = APIRouter()
ai_client = GeminiClient()


# TODO: better way to configure origins
origins = [
    "http://localhost:3000",  # Replace with your frontend's origin
    "http://localhost",
    "http://localhost:8000" # allow all origins
]

def extract_json_from_response(text: str) -> dict:
    """
    Extracts a JSON object from a string, cleaning up common LLM artifacts like markdown code blocks.
    """
    # Remove markdown code block fences if they exist
    if text.strip().startswith("```json"):
        text = text.strip()[7:-3].strip()
    elif text.strip().startswith("```"):
        text = text.strip()[3:-3].strip()

    # Find the first '{' or '[' to signify the start of the JSON object.
    first_brace = text.find('{')
    first_bracket = text.find('[')

    start_index = -1

    if first_brace == -1 and first_bracket == -1:
        raise ValueError("No JSON object or array found in the response text.")

    if first_brace != -1 and (first_bracket == -1 or first_brace < first_bracket):
        start_index = first_brace
    else:
        start_index = first_bracket

    json_string = text[start_index:]
    
    try:
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON. Raw text was: '{text}'. Error: {e}")


class StudyPlanRequest(BaseModel):
    goal: str
    speed: str
    hours_per_day: int
    duration_days: int

@router.post("/generate-plan", tags=["plan"])
async def generate_plan_endpoint(req: StudyPlanRequest):
    try:
        plan_text = await ai_client.generate_plan(
            req.goal, req.speed, req.hours_per_day, req.duration_days
        )
        # The plan_text can be a JSON string wrapped in markdown, so we extract it
        plan_json = extract_json_from_response(plan_text)
        return {"plan": plan_json}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-notes/from-plan")
async def generate_notes_endpoint(topic: str, day: int):
    try:
        # replace with actual logic for generating notes
        notes = f"Notes for day {day} on topic {topic}"
        return {"notes": notes}
    except Exception as e:
        # Log the error for debugging
        print(f"Error generating plan: {e}")
        # Provide user-friendly error messages for known Gemini issues
        error_message = str(e).lower()
        if "overloaded" in error_message:
            raise HTTPException(status_code=503, detail="The Gemini model is currently overloaded. Please try again later.")
        elif "quota" in error_message or "billing" in error_message:
            raise HTTPException(status_code=429, detail="You have exceeded your Gemini API quota. Please check your plan and billing details at https://ai.google.dev/gemini-api/docs/rate-limits.")
        elif "Authentication failed" in error_message:
            raise HTTPException(status_code=403, detail="Authentication failed: Check your Gemini API key and API enablement in Google Cloud.")
        elif "timed out" in error_message:
            raise HTTPException(status_code=504, detail="The Gemini API request timed out. Please try again later.")
        else:
            raise HTTPException(status_code=500, detail=f"Failed to generate study plan: {e}") 