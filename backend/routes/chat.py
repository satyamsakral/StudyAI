from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from utils.ai_client import GeminiClient

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: str
    selected_notes: List[str]
    user_id: str

class ChatResponse(BaseModel):
    response: str
    referenced_notes: List[str]

@router.post("/chat-with-notes", tags=["chat"])
async def chat_with_notes(request: ChatRequest):
    """
    Chat with AI assistant using selected notes as context.
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Handle case when no notes are selected
        if not request.context.strip():
            # Provide a helpful response even without notes
            response = """I'd be happy to help you study! However, I don't see any notes selected yet. 

To get the most helpful responses, please:
1. Click the dropdown arrow in the chat header
2. Select the notes you'd like to study from
3. Ask me questions about those specific notes

You can also ask me general study questions, and I'll provide helpful guidance!"""
            
            return ChatResponse(
                response=response,
                referenced_notes=[]
            )

        # Create AI client
        ai_client = GeminiClient()
        
        # Build the prompt with context
        prompt = f"""
        You are a helpful study assistant. You have access to the user's personal notes and should answer questions based on this information.

        USER'S NOTES:
        {request.context}

        USER'S QUESTION: {request.message}

        INSTRUCTIONS:
        1. Answer the question based on the user's notes provided above
        2. If the information is not in their notes, say so and provide general guidance
        3. Be helpful, clear, and educational
        4. If you reference specific information, mention which note it came from
        5. Keep responses concise but informative
        6. Use a friendly, encouraging tone
        7. Use plain text formatting - avoid markdown symbols like #, *, **, etc.
        8. Use bullet points (-) and numbered lists (1., 2., 3.) for clarity

        Please provide a helpful response based on the user's notes using clean, readable text.
        """

        # Generate response using Gemini
        response = await ai_client._generate_with_fallback(prompt)
        
        # For now, we'll return all selected notes as referenced
        # In a more advanced implementation, you could use semantic search to find the most relevant notes
        referenced_notes = request.selected_notes

        return ChatResponse(
            response=response,
            referenced_notes=referenced_notes
        )

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to process chat request: {str(e)}"
        )

@router.get("/chat/test", tags=["chat"])
async def test_chat():
    """
    Test endpoint to verify the chat route is working.
    """
    return {
        "success": True,
        "message": "Chat endpoint is working",
        "status": "ready"
    } 