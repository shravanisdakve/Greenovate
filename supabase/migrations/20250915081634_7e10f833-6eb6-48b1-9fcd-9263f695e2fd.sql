-- Greenovate Platform Database Schema
-- User roles enum
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');

-- User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  school_name TEXT,
  class_name TEXT,
  avatar_url TEXT,
  nickname TEXT,
  bio TEXT,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges table
CREATE TABLE badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  color TEXT DEFAULT '#10b981',
  points_required INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges (earned badges)
CREATE TABLE user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Challenges table
CREATE TABLE challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quiz', 'activity', 'mission', 'event')),
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points_reward INTEGER DEFAULT 10,
  badge_reward UUID REFERENCES badges(id),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  is_daily BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge submissions
CREATE TABLE challenge_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  submission_data JSONB,
  score INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id),
  UNIQUE(challenge_id, user_id)
);

-- Quizzes table
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  time_limit INTEGER, -- in minutes
  passing_score INTEGER DEFAULT 70
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  answers JSONB,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  school_name TEXT,
  class_name TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Resources table
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('pdf', 'video', 'link', 'image')),
  url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs for tracking
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carbon footprint tracking
CREATE TABLE carbon_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  carbon_saved DECIMAL(10,2), -- kg of CO2
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_activities ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Teachers can view student profiles" ON profiles
  FOR SELECT USING (
    get_user_role(auth.uid()) = 'teacher' AND 
    (role = 'student' OR auth.uid() = id)
  );

-- Badges policies
CREATE POLICY "Everyone can view badges" ON badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage badges" ON badges FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- User badges policies
CREATE POLICY "Users can view their badges" ON user_badges
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins and teachers can view all badges" ON user_badges
  FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'teacher'));

-- Challenges policies
CREATE POLICY "Everyone can view active challenges" ON challenges
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and teachers can manage challenges" ON challenges
  FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'teacher'));

-- Other policies (similar pattern for remaining tables)
CREATE POLICY "Users manage own submissions" ON challenge_submissions
  FOR ALL USING (user_id = auth.uid() OR get_user_role(auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "Everyone can view quizzes" ON quizzes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers can manage quizzes" ON quizzes FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "Users manage own attempts" ON quiz_attempts
  FOR ALL USING (user_id = auth.uid() OR get_user_role(auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "Teams are viewable by members and staff" ON teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create teams" ON teams FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view team memberships" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join teams" ON team_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Resources are public" ON resources FOR SELECT USING (is_public = true OR uploaded_by = auth.uid());
CREATE POLICY "Staff can upload resources" ON resources FOR INSERT WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "Users manage own activities" ON activity_logs FOR ALL USING (user_id = auth.uid() OR get_user_role(auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "Users manage own carbon data" ON carbon_activities FOR ALL USING (user_id = auth.uid() OR get_user_role(auth.uid()) IN ('admin', 'teacher'));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user level based on points
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = CASE
    WHEN NEW.points >= 5000 THEN 10
    WHEN NEW.points >= 4000 THEN 9
    WHEN NEW.points >= 3000 THEN 8
    WHEN NEW.points >= 2000 THEN 7
    WHEN NEW.points >= 1500 THEN 6
    WHEN NEW.points >= 1000 THEN 5
    WHEN NEW.points >= 700 THEN 4
    WHEN NEW.points >= 400 THEN 3
    WHEN NEW.points >= 200 THEN 2
    ELSE 1
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update user level
CREATE TRIGGER update_level_on_points_change
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (OLD.points IS DISTINCT FROM NEW.points)
  EXECUTE FUNCTION update_user_level();

-- Insert default badges
INSERT INTO badges (name, description, icon_url, color, points_required) VALUES
('Eco Warrior', 'Complete your first environmental challenge', '🌱', '#10b981', 10),
('Quiz Master', 'Score 100% on 5 quizzes', '🧠', '#3b82f6', 50),
('Team Player', 'Join your first team', '👥', '#8b5cf6', 5),
('Streak Keeper', 'Maintain a 7-day activity streak', '🔥', '#f59e0b', 70),
('Carbon Saver', 'Log 10kg of CO2 savings', '🌍', '#059669', 100),
('Daily Champion', 'Complete 30 daily challenges', '⭐', '#dc2626', 300);

-- Insert sample challenges
INSERT INTO challenges (title, description, type, points_reward, is_daily) VALUES
('Plastic-Free Lunch', 'Bring a lunch without any plastic packaging', 'activity', 15, true),
('Water Conservation Quiz', 'Test your knowledge about water conservation', 'quiz', 20, false),
('Bike to School Week', 'Use eco-friendly transportation for a week', 'mission', 50, false),
('School Clean-Up Drive', 'Participate in cleaning your school premises', 'event', 30, false);