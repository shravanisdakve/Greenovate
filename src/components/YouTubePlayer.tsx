import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface YouTubePlayerProps {
  videoId: string;
  levelId: string;
  topicId: number;
  onProgressUpdate?: (progress: number, completed: boolean) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  levelId,
  topicId,
  onProgressUpdate,
}) => {
  const { user } = useAuth();
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [actualWatchTime, setActualWatchTime] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);
  const totalWatchTimeRef = useRef<number>(0);

  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!containerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      height: '360',
      width: '640',
      videoId: videoId,
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerReady = () => {
    setIsReady(true);
    loadSavedProgress();
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      startProgressTracking();
    } else {
      stopProgressTracking();
    }
  };

  const loadSavedProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('video_progress')
        .select('progress_percentage, watch_time_seconds, actual_watch_time_seconds')
        .eq('user_id', user.id)
        .eq('level_id', levelId)
        .eq('topic_id', topicId)
        .eq('video_id', videoId)
        .maybeSingle();

      if (error) {
        console.error('Error loading progress:', error);
        return;
      }

      if (data) {
        setProgress(data.progress_percentage);
        setActualWatchTime(data.actual_watch_time_seconds || 0);
        totalWatchTimeRef.current = data.actual_watch_time_seconds || 0;
        onProgressUpdate?.(data.progress_percentage, data.progress_percentage >= 95);
        
        // Resume from saved position
        if (data.watch_time_seconds > 0 && playerRef.current && playerRef.current.seekTo) {
          playerRef.current.seekTo(data.watch_time_seconds, true);
        }
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Initialize last time for continuous watching detection
    if (playerRef.current) {
      lastTimeRef.current = playerRef.current.getCurrentTime();
    }

    progressIntervalRef.current = setInterval(() => {
      if (!playerRef.current || !user) return;

      try {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();

        if (duration && currentTime >= 0) {
          const newProgress = Math.round((currentTime / duration) * 100);
          setProgress(newProgress);
          
          // Track actual watch time (only if playing continuously)
          const timeDiff = currentTime - lastTimeRef.current;
          if (timeDiff > 0 && timeDiff <= 2) { // Normal playback (not seeking)
            totalWatchTimeRef.current += 1;
            setActualWatchTime(totalWatchTimeRef.current);
          }
          
          lastTimeRef.current = currentTime;
          
          // Determine completion based on progress or watch time
          const isCompleted = newProgress >= 95 || (totalWatchTimeRef.current >= duration * 0.8);
          onProgressUpdate?.(newProgress, isCompleted);

          // Save progress every 3 seconds
          if (totalWatchTimeRef.current % 3 === 0) {
            saveProgress(newProgress, Math.round(currentTime), totalWatchTimeRef.current);
          }
        }
      } catch (error) {
        console.error('Error tracking progress:', error);
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Save final progress when stopping
    if (playerRef.current && user) {
      try {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        
        if (duration && currentTime) {
          const finalProgress = Math.round((currentTime / duration) * 100);
          saveProgress(finalProgress, Math.round(currentTime), totalWatchTimeRef.current);
        }
      } catch (error) {
        console.error('Error saving final progress:', error);
      }
    }
  };

  const saveProgress = async (progressPercentage: number, watchTimeSeconds: number, actualWatchTimeSeconds?: number) => {
    if (!user) return;

    try {
      const completed = progressPercentage >= 95;
      
      const { error } = await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          level_id: levelId,
          topic_id: topicId,
          video_id: videoId,
          progress_percentage: progressPercentage,
          watch_time_seconds: watchTimeSeconds,
          actual_watch_time_seconds: actualWatchTimeSeconds || totalWatchTimeRef.current,
          completed,
          last_watched_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,level_id,topic_id,video_id'
        });

      if (error) {
        console.error('Error saving progress:', error);
      } else if (completed && progressPercentage >= 95) {
        toast.success("🎉 Video completed! Great job!");
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  return (
    <div className="relative w-full">
      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />
      </div>
      
      {isReady && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress: {progress}%</span>
            <span>Watch Time: {Math.floor(actualWatchTime / 60)}:{(actualWatchTime % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>{progress >= 95 ? 'Completed!' : 'In Progress'}</span>
            {playerRef.current && (
              <span>
                Duration: {Math.floor((playerRef.current?.getDuration?.() || 0) / 60)}:{((playerRef.current?.getDuration?.() || 0) % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;