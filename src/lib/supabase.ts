import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not available
// This allows the app to load while Supabase integration is being configured
let supabase: any;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Mock Supabase client for development
  console.warn('⚠️  Supabase environment variables not found. Please ensure your Supabase integration is properly connected in Lovable.');
  
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        count: 'exact',
        head: true,
      }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ 
        eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      }),
      delete: () => ({ 
        eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      }),
    }),
  };
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'teacher' | 'student';
          school_level: string;
          class_name?: string;
          points: number;
          level: number;
          streak: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role: 'admin' | 'teacher' | 'student';
          school_level: string;
          class_name?: string;
          points?: number;
          level?: number;
          streak?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'teacher' | 'student';
          school_level?: string;
          class_name?: string;
          points?: number;
          level?: number;
          streak?: number;
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          level_id: string;
          topic_id: number;
          completed: boolean;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          level_id: string;
          topic_id: number;
          completed?: boolean;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          level_id?: string;
          topic_id?: number;
          completed?: boolean;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_notes: {
        Row: {
          id: string;
          user_id: string;
          level_id: string;
          topic_id: number;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          level_id: string;
          topic_id: number;
          notes: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          level_id?: string;
          topic_id?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      game_scores: {
        Row: {
          id: string;
          user_id: string;
          game_id: string;
          score: number;
          level: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          game_id: string;
          score: number;
          level?: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          game_id?: string;
          score?: number;
          level?: number;
          completed_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          points_required: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          points_required: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          points_required?: number;
          created_at?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          points_reward: number;
          challenge_type: 'quiz' | 'activity' | 'simulation';
          created_by: string;
          target_role: 'student' | 'all';
          target_level?: string;
          is_active: boolean;
          deadline?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          points_reward: number;
          challenge_type: 'quiz' | 'activity' | 'simulation';
          created_by: string;
          target_role?: 'student' | 'all';
          target_level?: string;
          is_active?: boolean;
          deadline?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          points_reward?: number;
          challenge_type?: 'quiz' | 'activity' | 'simulation';
          created_by?: string;
          target_role?: 'student' | 'all';
          target_level?: string;
          is_active?: boolean;
          deadline?: string;
          created_at?: string;
        };
      };
      challenge_submissions: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          content: string;
          file_url?: string;
          status: 'pending' | 'approved' | 'rejected';
          reviewed_by?: string;
          review_comment?: string;
          points_earned: number;
          submitted_at: string;
          reviewed_at?: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          content: string;
          file_url?: string;
          status?: 'pending' | 'approved' | 'rejected';
          reviewed_by?: string;
          review_comment?: string;
          points_earned?: number;
          submitted_at?: string;
          reviewed_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          content?: string;
          file_url?: string;
          status?: 'pending' | 'approved' | 'rejected';
          reviewed_by?: string;
          review_comment?: string;
          points_earned?: number;
          submitted_at?: string;
          reviewed_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string;
          file_url: string;
          file_type: 'pdf' | 'video' | 'image' | 'document';
          uploaded_by: string;
          target_level?: string;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          file_url: string;
          file_type: 'pdf' | 'video' | 'image' | 'document';
          uploaded_by: string;
          target_level?: string;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          file_url?: string;
          file_type?: 'pdf' | 'video' | 'image' | 'document';
          uploaded_by?: string;
          target_level?: string;
          is_public?: boolean;
          created_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          details: string;
          points_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          details: string;
          points_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          details?: string;
          points_earned?: number;
          created_at?: string;
        };
      };
    };
  };
};