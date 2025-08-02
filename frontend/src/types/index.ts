export interface Day {
  day: number;
  topic: string;
  time: string; // Changed from duration
  tasks: string[];
  completed: boolean;
}

export interface StudyPlan {
  id?: number; // The database ID of the plan
  created_at?: string; // The date the plan was created
  title: string;
  totalDays?: number;
  dailyHours?: number;
  estimatedCompletion?: string;
  days: Day[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  downloadUrl?: string;
  filename?: string;
}

export interface Topic {
  id: string;
  title: string;
  notes: Note[];
}

export interface SavedNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  note_type: 'upload' | 'youtube';
  video_url?: string;
  filename?: string;
  created_at: string;
}

export interface YouTubeNote {
  id: string;
  user_id: string;
  video_url: string;
  transcript: string;
  ai_notes: string;
  created_at: string;
  title?: string;
  content?: string;
  note_type?: 'youtube';
}

export interface UnifiedNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  note_type: 'upload' | 'youtube';
  video_url?: string;
  filename?: string;
  created_at: string;
} 