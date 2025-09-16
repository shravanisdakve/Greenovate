-- Drop existing trigger if it exists and recreate it properly
DROP TRIGGER IF EXISTS update_video_progress_updated_at ON public.video_progress;

CREATE TRIGGER update_video_progress_updated_at
BEFORE UPDATE ON public.video_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_video_progress_updated_at();