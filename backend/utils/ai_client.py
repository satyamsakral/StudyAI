import os
import httpx
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# A list of Gemini models to try in order of preference
GEMINI_MODELS = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
]

# Set a longer timeout (in seconds)
CLIENT_TIMEOUT = 120.0

class GeminiClient:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.critical("GEMINI_API_KEY not found in .env file or environment variables. The application will not work without it.")
            raise ValueError("GEMINI_API_KEY not found in .env file")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    async def health_check(self):
        """
        Checks Gemini API connectivity and authentication by making a minimal request.
        Returns a dict with status and error details if any.
        """
        test_prompt = "Say hello."
        for model in GEMINI_MODELS:
            try:
                logger.info(f"[HealthCheck] Testing model: {model}")
                result = await self.call_gemini_api(model, test_prompt)
                if result:
                    logger.info(f"[HealthCheck] Model {model} responded successfully.")
                    return {"success": True, "model": model, "response": result}
            except Exception as e:
                logger.error(f"[HealthCheck] Model {model} failed: {e}")
        return {"success": False, "error": "All Gemini models failed. Check API key, billing, and API enablement."}

    async def call_gemini_api(self, model: str, prompt: str):
        api_url = f"{self.base_url}/{model}:generateContent?key={self.api_key}"
        
        payload = {
            "contents": [{"parts":[{"text": prompt}]}]
        }
        
        headers = {"Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=CLIENT_TIMEOUT) as client:
            try:
                response = await client.post(api_url, headers=headers, json=payload)
                response.raise_for_status()
                result = response.json()

                candidates = result.get("candidates")
                if not candidates or not candidates[0].get("content"):
                    raise ValueError(f"Gemini API returned unexpected structure: {result}")
                parts = candidates[0]["content"].get("parts")
                if not parts or not parts[0].get("text"):
                    raise ValueError(f"Gemini API returned unexpected structure: {result}")
                
                return parts[0]["text"]

            except httpx.HTTPStatusError as e:
                # Enhanced error handling for user-friendly messages
                status_code = e.response.status_code
                try:
                    error_body = e.response.json()
                except Exception:
                    error_body = e.response.text
                if status_code == 403:
                    logger.error(f"Authentication failed for model {model} (Forbidden). This often means your API key is invalid or the Gemini API is not enabled in your Google Cloud project.")
                    raise Exception("Authentication failed: Check your Gemini API key and API enablement in Google Cloud.")
                elif status_code == 503:
                    logger.warning(f"Model {model} is overloaded. Trying next model.")
                    # Propagate a special message for user-facing error
                    raise Exception("The Gemini model is currently overloaded. Please try again later.")
                elif status_code == 429:
                    logger.error(f"Quota exceeded for model {model}. Response: {error_body}")
                    raise Exception("You have exceeded your Gemini API quota. Please check your plan and billing details at https://ai.google.dev/gemini-api/docs/rate-limits.")
                logger.error(f"--- Gemini API HTTP Error with model {model} ---")
                print(f"Status Code: {status_code}")
                print(f"Response Body: {error_body}")
                print("-----------------------------")
                raise Exception(f"Gemini API error ({status_code}): {error_body}")
            except httpx.ReadTimeout:
                print(f"--- Timeout Error with model {model} ---")
                print(f"The request to the model took too long to respond.")
                print("------------------------")
                raise Exception("The Gemini API request timed out. Please try again later.")
            except Exception as e:
                print(f"--- Unexpected Error with model {model} ---")
                print(f"Error Type: {type(e)}")
                print(f"Error Message: {e}")
                import traceback
                traceback.print_exc()
                print("------------------------")
                raise Exception(f"Unexpected error: {e}")

    async def _generate_with_fallback(self, prompt: str):
        for model in GEMINI_MODELS:
            logger.info(f"Attempting to use model: {model}")
            result = await self.call_gemini_api(model, prompt)
            if result:
                logger.info(f"Successfully generated content with model: {model}")
                return result
            logger.warning(f"Model {model} failed. Trying next model in fallback list.")
        logger.critical("All Gemini models in the fallback list failed. Please check API key, billing, and API enablement.")
        raise Exception("All Gemini models failed.")


    async def generate_plan(self, goal, speed, hours_per_day, duration_days):
        prompt = self.build_study_plan_prompt(goal, speed, hours_per_day, duration_days)
        return await self._generate_with_fallback(prompt)

    async def generate_notes_from_text(self, text: str):
        prompt = self.build_notes_prompt(text)
        return await self._generate_with_fallback(prompt)

    def build_study_plan_prompt(self, goal, speed, hours, duration):
        return f"""
    Create a detailed, day-by-day study plan for the following goal.
    The output must be a single, complete JSON object.

    Goal: {goal}
    My Learning Speed: {speed}
    Hours per day I can study: {hours}
    Total duration of the plan: {duration} days

    Based on this, generate a JSON object with the following structure:
    - "title": A creative and motivating title for the study plan.
    - "totalDays": An integer for the total number of days (should match the duration).
    - "dailyHours": An integer for the hours per day for studying (should match the input).
    - "estimatedCompletion": A friendly string representing the completion date (e.g., "in {duration} days").
    - "days": An array of day objects.

    Each object in the "days" array must have this structure:
    - "day": The day number (integer).
    - "topic": A concise topic for the day (string).
    - "time": The estimated time for that day's tasks (string, e.g., "{hours} hours").
    - "tasks": An array of specific, actionable tasks for the day (array of strings).
    - "completed": A boolean, which must always be `false` by default.

    Example of the final JSON object:
    {{
        "title": "Mastering {goal}: A {duration}-Day Journey",
        "totalDays": {duration},
        "dailyHours": {hours},
        "estimatedCompletion": "in {duration} days",
        "days": [
            {{
                "day": 1,
                "topic": "Introduction to Core Concepts",
                "time": "{hours} hours",
                "tasks": ["Read Chapter 1", "Complete introductory exercises"],
                "completed": false
            }}
        ]
    }}
    """

    def build_notes_prompt(self, text):
        return f"""
        Analyze the following text and generate structured, hierarchical notes.
        The output should be clean, readable text without markdown symbols.

        Requirements:
        - Use clear headings with numbers (1., 2., 3.) instead of ##
        - Use bullet points (- or •) for key points
        - Use numbered lists for steps or sequences
        - Include a summary section at the end
        - Make the notes comprehensive and well-organized
        - Avoid markdown symbols like #, *, **, etc.
        - Use plain text formatting

        Example format:
        1. MAIN TOPIC
        - Key point one
        - Key point two
        - Important concept

        1.1 Sub-topic
        - Detailed explanation
        - Related information
        - Examples

        SUMMARY
        - Main takeaways
        - Key points to remember

        Text to analyze:
        {text}
        """