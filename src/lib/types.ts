export interface Topic {
  name: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  name: string;
  points: string[];
}

export interface BlurtAttempt {
  id?: string;
  user_id: string;
  topic: string;
  subtopic: string;
  score: number;
  text: string;
  matched_points: string[];
  created_at?: string;
}

export interface TrackerPoint {
  id?: string;
  user_id: string;
  topic: string;
  subtopic: string;
  point_text: string;
  point_key: string;
  rag: "Red" | "Amber" | "Green";
  notes: string;
  updated_at?: string;
}

export interface TopicProgress {
  topic: string;
  subtopic: string;
  best_score: number;
  last_score: number;
  attempts: number;
  manual_rag: "Red" | "Amber" | "Green" | null;
}
