from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import plan, notes, insights, youtube_notes, chat

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(plan.router)
app.include_router(notes.router)
app.include_router(insights.router)
app.include_router(youtube_notes.router)
app.include_router(chat.router)

@app.get("/ping")
def ping():
    return {"message": "pong"} 