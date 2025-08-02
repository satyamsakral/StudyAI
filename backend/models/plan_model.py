from pydantic import BaseModel
from typing import List, Dict

class PlanRequest(BaseModel):
    goal: str
    speed: str
    hours_per_day: int
    duration_days: int

class PlanDay(BaseModel):
    day: int
    subject: str
    topics: str
    time: str

class PlanResponse(BaseModel):
    plan: List[PlanDay] 