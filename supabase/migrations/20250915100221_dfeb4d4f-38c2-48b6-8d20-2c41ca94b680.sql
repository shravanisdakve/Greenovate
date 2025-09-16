-- Add actual_watch_time_seconds to video_progress table to track cumulative watch time
ALTER TABLE public.video_progress 
ADD COLUMN actual_watch_time_seconds integer DEFAULT 0;