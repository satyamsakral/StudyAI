# Smart AI Study Planner Backend

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set up your `.env` file with:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## Endpoints

### /ping
- **GET**
- Test server health

### /generate-plan
- **POST** (public)
- **Body:**
  ```json
  {
    "goal": "Crack DSA",
    "speed": "average",
    "hours_per_day": 3,
    "duration_days": 30
  }
  ```
- **Response:**
  ```json
  {
    "plan": "...AI-generated plan as text..."
  }
  ```

### /generate-notes
- **POST** (public, multipart/form-data)
- **File:** PDF, DOCX, or TXT
- **Response:**
  ```json
  {
    "notes": "...clean notes..."
  }
  ```

## Docs
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs) 