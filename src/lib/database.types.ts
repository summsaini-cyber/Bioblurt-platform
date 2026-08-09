export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          created_at?: string;
        };
      };
      blurts: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          subtopic: string;
          score: number;
          blurt_text: string;
          matched_points: string[];
          manual_rag: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic: string;
          subtopic: string;
          score: number;
          blurt_text: string;
          matched_points?: string[];
          manual_rag?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic?: string;
          subtopic?: string;
          score?: number;
          blurt_text?: string;
          matched_points?: string[];
          manual_rag?: string | null;
          created_at?: string;
        };
      };
      tracker_points: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          subtopic: string;
          point_text: string;
          point_key: string;
          rag: string;
          notes: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic: string;
          subtopic: string;
          point_text: string;
          point_key: string;
          rag?: string;
          notes?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic?: string;
          subtopic?: string;
          point_text?: string;
          point_key?: string;
          rag?: string;
          notes?: string;
          updated_at?: string;
        };
      };
    };
  };
};
