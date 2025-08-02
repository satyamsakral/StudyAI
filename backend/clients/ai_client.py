import httpx
from dotenv import load_dotenv

load_dotenv()

# A list of Gemini models to try in order of preference
GEMINI_MODELS = [
    "gemini-1.5-flash-001",
    "gemini-1.5-pro-latest",
    "gemini-1.0-pro",
    "gemini-pro-vision" # This is a fallback, but it's not ideal for text generation
]

class GeminiClient: 