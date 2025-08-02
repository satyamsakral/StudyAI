from pydantic import BaseModel
from typing import List

class NotesResponse(BaseModel):
    notes: str  # Could be markdown or HTML 