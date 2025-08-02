from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

router = APIRouter()

class YouTubeURLRequest(BaseModel):
    video_url: str

def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from various URL formats."""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
        r'youtube\.com\/watch\?.*v=([^&\n?#]+)',
        r'youtu\.be\/([^&\n?#]+)',
        r'youtube\.com\/embed\/([^&\n?#]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    raise HTTPException(status_code=400, detail="Invalid YouTube URL format")

async def generate_youtube_notes(transcript: str) -> str:
    """Generate AI notes from YouTube transcript using Gemini API."""
    from utils.ai_client import GeminiClient
    
    ai_client = GeminiClient()
    
    prompt = f"""
    Create comprehensive revision notes from the following YouTube video transcript.
    
    Requirements:
    - Use clear headings with numbers (1., 2., 3.) instead of ##
    - Use bullet points (- or •) for key points
    - Use CAPITAL LETTERS for important terms instead of **bold**
    - Use numbered lists for steps or sequences
    - Include a summary section at the end
    - Make the notes comprehensive and well-organized
    - Avoid markdown symbols like #, *, **, etc.
    - Use plain text formatting
    
    Example format:
    1. MAIN TOPIC
    - Key point one
    - Key point two with IMPORTANT TERM
    - Step-by-step process:
      1. First step
      2. Second step
    
    1.1 Sub-topic
    - Another key point
    - "Important quote from the video"
    
    SUMMARY
    - Main takeaways
    - Key points to remember
    
    Transcript:
    {transcript}
    
    Create clean, readable notes using plain text formatting.
    """
    
    try:
        notes = await ai_client._generate_with_fallback(prompt)
        return notes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate AI notes: {str(e)}")

@router.post("/generate-notes/youtube", tags=["youtube-notes"])
async def generate_youtube_notes_endpoint(request: YouTubeURLRequest):
    try:
        print(f"Received request with video_url: {request.video_url}")
        # Extract video ID from URL
        video_id = extract_video_id(request.video_url)
        print(f"Extracted video_id: {video_id}")
        
        # Fetch transcript
        try:
            print(f"Attempting to fetch transcript for video_id: {video_id}")
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            print(f"Successfully fetched transcript with {len(transcript_list)} entries")
            
            # Debug: Print first entry structure
            if transcript_list:
                print(f"First transcript entry: {transcript_list[0]}")
            
            # Format transcript manually to avoid formatter issues
            transcript_text = ""
            for entry in transcript_list:
                if isinstance(entry, dict) and 'text' in entry:
                    transcript_text += entry['text'] + " "
                else:
                    print(f"Unexpected entry format: {entry}")
                    transcript_text += str(entry) + " "
            
            transcript_text = transcript_text.strip()
            print(f"Formatted transcript length: {len(transcript_text)} characters")
        except TranscriptsDisabled as e:
            print(f"TranscriptsDisabled exception: {str(e)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=400,
                detail="Transcripts are disabled for this video. The video owner has turned off captions/subtitles."
            )
        except NoTranscriptFound as e:
            print(f"NoTranscriptFound exception: {str(e)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=400,
                detail="No transcript found for this video. The video may not have any captions or subtitles available."
            )
        except Exception as e:
            print(f"Unexpected error fetching transcript: {str(e)}")
            print(f"Error type: {type(e)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"An unexpected error occurred while fetching the transcript: {str(e)}"
            )
        
        if not transcript_text.strip():
            raise HTTPException(
                status_code=400, 
                detail="Transcript is empty or unavailable for this video."
            )
        
        # Generate AI notes
        ai_notes = await generate_youtube_notes(transcript_text)
        
        # Save to Supabase (for now, just return the notes)
        # TODO: Add Supabase integration when authentication is set up
        print(f"Generated AI notes for video: {video_id}")
        print(f"Notes length: {len(ai_notes)} characters")
        
        return {
            "success": True,
            "ai_notes": ai_notes,
            "video_url": request.video_url,
            "video_id": video_id,
            "message": "YouTube notes generated successfully"
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@router.get("/youtube-notes/test", tags=["youtube-notes"])
async def test_youtube_notes():
    """Test endpoint to verify the route is working."""
    return {
        "success": True,
        "message": "YouTube notes endpoint is working",
        "status": "ready"
    }

@router.get("/youtube-notes/test-transcript/{video_id}", tags=["youtube-notes"])
async def test_transcript_fetch(video_id: str):
    """Test endpoint to verify transcript fetching works."""
    try:
        print(f"Testing transcript fetch for video_id: {video_id}")
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        print(f"Success! Found {len(transcript_list)} transcript entries")
        return {
            "success": True,
            "video_id": video_id,
            "transcript_count": len(transcript_list),
            "message": "Transcript fetch successful"
        }
    except TranscriptsDisabled as e:
        print(f"TranscriptsDisabled exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "video_id": video_id,
            "error": "TranscriptsDisabled",
            "message": "Transcripts are disabled for this video"
        }
    except NoTranscriptFound as e:
        print(f"NoTranscriptFound exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "video_id": video_id,
            "error": "NoTranscriptFound",
            "message": "No transcript found for this video"
        }
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "video_id": video_id,
            "error": "UnexpectedError",
            "message": f"Unexpected error: {str(e)}"
        } 